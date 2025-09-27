# 📝 Job Listing Web App

A full-stack job listing application built with **Flask (Python)**, **React (JavaScript)** and a **Selenium scraper**.

This project demonstrates a production-style architecture:
- REST API backend with token-based admin operations
- React frontend with add/edit/delete, filtering, sorting, pagination
- Automated job scraping from RemoteOK (and easily extendable)
- Dashboard placeholder for analytics



---

## 🚀 Features

- **Backend (Flask)**
  - REST endpoints for CRUD on job listings
  - Token-based admin protection for add/edit/delete routes
  - SQLAlchemy database (SQLite locally, easily switch to PostgreSQL)

- **Scraper (Selenium)**
  - Scrapes jobs from [RemoteOK](https://remoteok.com)
  - Sends data to backend via API

- **Frontend (React)**
  - Login/Logout toggle sets a dummy token for admin operations
  - Add new jobs, edit or delete existing jobs (admin only)
  - Filter by keyword, sort by date
  - Pagination with “Load more”
  - Dashboard tab for future analytics

---

## ⚙️ Setup & Installation

### 1️⃣ Clone and create folder structure
```bash
cd Desktop
mkdir project-root && cd project-root
mkdir backend Scraper frontend

Backend Setup
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
python app.py


Scraper Setup
cd Desktop\project-root\Scraper
..\backend\venv\Scripts\Activate.ps1   # activate same venv
python scrape.py



Frontend Setup
cd Desktop\project-root\frontend
npm install
npm start

Using the App (Front-end UI)

At the top you see Job Listings title and Jobs / Dashboard tabs.

A Login button lets you set a dummy admin token (“demo-token”).

When logged out: you can only view jobs.

When logged in: the Add Job form appears and Delete/Edit buttons show up on each job.

Use the Search box and Sort dropdown to filter and sort jobs.

Add new jobs with the form fields: Title, Company, Location, Job Type, Tags.

Click Load more at the bottom to paginate through more jobs.

Click Dashboard tab for the analytics placeholder.