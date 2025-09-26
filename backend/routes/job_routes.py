from flask import Blueprint, request, jsonify
from db import db
from models.job import Job
from datetime import datetime
from sqlalchemy import or_, desc, asc, func
import config

bp = Blueprint("jobs", __name__)

# Authorization
def require_auth():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth.split(" ", 1)[1].strip()
    return None

def is_authorized():
    token = require_auth()
    return token and token == config.ADMIN_TOKEN

# Utilities
def parse_iso_date(s):
    if not s:
        return None
    try:
        return datetime.fromisoformat(s)
    except:
        return None

def parse_tags(tags_input):
    if isinstance(tags_input, list):
        return ",".join([t.strip() for t in tags_input])
    elif isinstance(tags_input, str):
        return tags_input.strip()
    return None

# Routes
@bp.route("/jobs", methods=["GET"])
def list_jobs():
    q = Job.query
    job_type = request.args.get("job_type")
    location = request.args.get("location")
    tag = request.args.get("tag")
    keyword = request.args.get("q")
    sort = request.args.get("sort", "posting_date_desc")

    if job_type: q = q.filter(Job.job_type.ilike(f"%{job_type}%"))
    if location: q = q.filter(Job.location.ilike(f"%{location}%"))
    if tag: q = q.filter(Job.tags.ilike(f"%{tag}%"))
    if keyword: q = q.filter(or_(Job.title.ilike(f"%{keyword}%"), Job.company.ilike(f"%{keyword}%")))

    q = q.order_by(asc(Job.posting_date) if sort == "posting_date_asc" else desc(Job.posting_date))

    page = max(int(request.args.get("page", 1)), 1)
    limit = min(int(request.args.get("limit", 20)), 200)

    total = q.count()
    items = q.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        "total": total,
        "page": page,
        "limit": limit,
        "items": [job.to_dict() for job in items]
    }), 200

@bp.route("/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job: return jsonify({"error": "Job not found"}), 404
    return jsonify(job.to_dict()), 200

@bp.route("/jobs", methods=["POST"])
def create_job():
    if not is_authorized(): return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json() or {}

    for field in ["title", "company", "location"]:
        if not data.get(field): return jsonify({"error": f"{field} is required"}), 400

    url = data.get("url")
    if url:
        existing = Job.query.filter_by(url=url).first()
        if existing: return jsonify({"error": "Job already exists (by URL)"}), 409
    else:
        existing = Job.query.filter(
            func.lower(Job.title) == data["title"].strip().lower(),
            func.lower(Job.company) == data["company"].strip().lower()
        ).first()
        if existing: return jsonify({"error": "Job already exists (title + company)"}), 409

    try:
        job = Job(
            title=data["title"].strip(),
            company=data["company"].strip(),
            location=data["location"].strip(),
            posting_date=parse_iso_date(data.get("posting_date")),
            job_type=data.get("job_type"),
            tags=parse_tags(data.get("tags")),
            url=url
        )
        db.session.add(job)
        db.session.commit()
        return jsonify(job.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

@bp.route("/jobs/<int:job_id>", methods=["PUT", "PATCH"])
def update_job(job_id):
    if not is_authorized(): return jsonify({"error": "Unauthorized"}), 401
    job = Job.query.get(job_id)
    if not job: return jsonify({"error": "Job not found"}), 404

    data = request.get_json() or {}
    if data.get("title"): job.title = data["title"].strip()
    if data.get("company"): job.company = data["company"].strip()
    if data.get("location"): job.location = data["location"].strip()
    if "posting_date" in data: job.posting_date = parse_iso_date(data["posting_date"])
    if "job_type" in data: job.job_type = data["job_type"]
    if "tags" in data: job.tags = parse_tags(data["tags"])
    if "url" in data: job.url = data["url"]

    try:
        db.session.commit()
        return jsonify(job.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update job", "details": str(e)}), 500

@bp.route("/jobs/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    if not is_authorized(): return jsonify({"error": "Unauthorized"}), 401
    job = Job.query.get(job_id)
    if not job: return jsonify({"error": "Job not found"}), 404

    try:
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": "Job deleted"}), 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete job", "details": str(e)}), 500

@bp.route("/stats", methods=["GET"])
def stats():
    total = db.session.query(func.count(Job.id)).scalar()
    top_companies = db.session.query(Job.company, func.count(Job.id))\
        .group_by(Job.company)\
        .order_by(desc(func.count(Job.id)))\
        .limit(10).all()

    top_locations = db.session.query(Job.location, func.count(Job.id))\
        .group_by(Job.location)\
        .order_by(desc(func.count(Job.id)))\
        .limit(10).all()

    return jsonify({
        "total": total,
        "top_companies": [{"company": c, "count": cnt} for c, cnt in top_companies],
        "top_locations": [{"location": loc, "count": cnt} for loc, cnt in top_locations]
    }), 200
