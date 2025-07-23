# backend/db.py
from app import create_app, db
from models.jobs import Job      # ← add this line so SQLAlchemy “sees” the model

app = create_app()

with app.app_context():
    db.create_all()              # creates all tables for every imported model
    print("✅ Database tables created.")