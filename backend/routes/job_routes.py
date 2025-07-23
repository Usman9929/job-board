# routes/job_routes.py
from flask import Blueprint, request, jsonify
from models.jobs import Job
from models import db

job_bp = Blueprint("job_bp", __name__)

@job_bp.route("/jobs", methods=["GET"])
def get_jobs():
    job_type = request.args.get("job_type")
    location = request.args.get("location")
    tag = request.args.get("tag")
    sort = request.args.get("sort", "posting_date_desc")

    query = Job.query

    if job_type:
        query = query.filter_by(job_type=job_type)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if tag:
        query = query.filter(Job.tags.ilike(f"%{tag}%"))

    if sort == "posting_date_desc":
        query = query.order_by(Job.posting_date.desc())
    elif sort == "posting_date_asc":
        query = query.order_by(Job.posting_date.asc())

    jobs = query.all()
    return jsonify([job.to_dict() for job in jobs]), 200


@job_bp.route("/jobs/<int:id>", methods=["GET"])
def get_job(id):
    job = Job.query.get(id)
    if job:
        return jsonify(job.to_dict()), 200
    return jsonify({"error": "Job not found"}), 404


@job_bp.route("/jobs", methods=["POST"])
def create_job():
    data = request.get_json()
    required = ["title", "company", "location"]
    if not all(field in data and data[field] for field in required):
        return jsonify({"error": "Missing required fields"}), 400

    job = Job(
        title=data["title"],
        company=data["company"],
        location=data["location"],
        posting_date=data.get("posting_date"),
        job_type=data.get("job_type"),
        tags=",".join(data.get("tags", []))
    )
    db.session.add(job)
    db.session.commit()
    return jsonify(job.to_dict()), 201


@job_bp.route("/jobs/<int:id>", methods=["PUT", "PATCH"])
def update_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    data = request.get_json()
    for field in ["title", "company", "location", "posting_date", "job_type", "tags"]:
        if field in data:
            if field == "tags":
                setattr(job, field, ",".join(data[field]))
            else:
                setattr(job, field, data[field])
    db.session.commit()
    return jsonify(job.to_dict()), 200


@job_bp.route("/jobs/<int:id>", methods=["DELETE"])
def delete_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted"}), 200
