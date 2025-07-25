# app.py
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from models import db  

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    from routes.job_routes import job_bp
    app.register_blueprint(job_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
