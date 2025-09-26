import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///jobs.db")
DEBUG = os.environ.get("FLASK_DEBUG", "1") == "1"
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "devtoken123")
SQLALCHEMY_ECHO = os.environ.get("SQLALCHEMY_ECHO", "0") == "1"
