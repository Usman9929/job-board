from . import db
from datetime import datetime

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    posting_date = db.Column(db.DateTime, default=datetime.utcnow)
    job_type = db.Column(db.String(50))
    tags = db.Column(db.String(250))  # comma-separated string of tags
    link = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "posting_date": self.posting_date.strftime('%Y-%m-%d'),
            "job_type": self.job_type,
            "tags": self.tags.split(",") if self.tags else [],
            "link": self.link
        }
