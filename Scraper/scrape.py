# Scraper/scrape.py

import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from urllib.parse import urljoin
import os
from datetime import datetime

# Constants
BACKEND_API = "http://127.0.0.1:5000/jobs"
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "devtoken123")  # Token for protected endpoints
START_URL = "https://remoteok.com"  # Target site

# ──────────────────────────────────────────────────────────────────────────────
# Browser Initialization
def init_driver(headless=True):
    options = Options()
    if headless:
        options.add_argument("--headless=new")  # Modern headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--log-level=3")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

# ──────────────────────────────────────────────────────────────────────────────
# Backend Communication
def get_job_items(query=""):
    try:
        r = requests.get(BACKEND_API, params={"q": query})
        if r.status_code != 200:
            return []
        data = r.json()
        return data.get("items", data)
    except:
        return []

def job_exists_by_url(url):
    if not url:
        return False
    for job in get_job_items():
        if job.get("url", "").strip().lower() == url.strip().lower():
            return True
    return False

def job_exists_by_title_company(title, company):
    for job in get_job_items(query=title):
        if job.get("title", "").strip().lower() == title.strip().lower() and \
           job.get("company", "").strip().lower() == company.strip().lower():
            return True
    return False

def post_job(payload, max_retries=3):
    headers = {
        "Authorization": f"Bearer {ADMIN_TOKEN}",
        "Content-Type": "application/json"
    }
    for attempt in range(max_retries):
        try:
            r = requests.post(BACKEND_API, json=payload, headers=headers, timeout=15)
            return r.status_code, r.text
        except requests.exceptions.RequestException as e:
            if attempt < max_retries - 1:
                time.sleep(2)
                continue
            return None, str(e)

# ──────────────────────────────────────────────────────────────────────────────
# Scraping Logic
def scrape(limit_jobs=50):
    driver = init_driver(headless=True)
    inserted = 0

    try:
        driver.get(START_URL)
        time.sleep(3)
        print("Page title:", driver.title)

        rows = driver.find_elements(By.CSS_SELECTOR, "tr.job")
        print("Found rows:", len(rows))

        for row in rows:
            if inserted >= limit_jobs:
                break

            try:
                title = company = job_url = ""
                tags = []

                try:
                    title = row.find_element(By.CSS_SELECTOR, "h2").text.strip()
                except: pass

                try:
                    company = row.find_element(By.CSS_SELECTOR, "h3").text.strip()
                except: pass

                try:
                    a = row.find_element(By.CSS_SELECTOR, "a.preventLink")
                    job_url = a.get_attribute("href") or a.get_attribute("data-href") or ""
                except: pass

                try:
                    tag_elements = row.find_elements(By.CSS_SELECTOR, ".tag")
                    tags = [t.text.strip() for t in tag_elements if t.text.strip()]
                except: pass

                if not title:
                    continue

                # Check duplicates
                if job_exists_by_url(job_url):
                    print(f"[⏩] Skipped (by URL): {title}")
                    continue
                if job_exists_by_title_company(title, company):
                    print(f"[⏩] Skipped (by Title+Company): {title}")
                    continue

                # Prepare payload
                payload = {
                    "title": title,
                    "company": company or "Unknown",
                    "location": "Remote",
                    "posting_date": datetime.utcnow().isoformat(),
                    "job_type": "Full-time",
                    "tags": tags,
                    "url": job_url
                }

                status, text = post_job(payload)
                if status in (200, 201):
                    print(f"[✅] Added: {title} ({company})")
                    inserted += 1
                else:
                    print(f"[❌] Failed to add: {title} – {status}: {text}")

            except Exception as e:
                print("Row parse error:", e)

        print("\n✅ Scraping complete. Jobs inserted:", inserted)

    finally:
        driver.quit()

# ──────────────────────────────────────────────────────────────────────────────
# Entry Point
if __name__ == "__main__":
    scrape(limit_jobs=30)
