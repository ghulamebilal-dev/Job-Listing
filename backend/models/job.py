from datetime import datetime
from db import db

class Job(db.Model):
    __tablename__ = "jobs"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    posting_date = db.Column(db.DateTime, nullable=True)
    job_type = db.Column(db.String(100), nullable=True)
    tags = db.Column(db.String(500), nullable=True)  # CSV
    url = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "posting_date": self.posting_date.isoformat() if self.posting_date else None,
            "job_type": self.job_type,
            "tags": [t.strip() for t in self.tags.split(",")] if self.tags else [],
            "url": self.url,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
