# 🧑‍💻 Job Board – Full Stack Job Listing Platform

This is a full-stack job board application that includes:

- A **Flask REST API** backend for job management (CRUD operations + filters)
- A **React frontend** to display and filter jobs
- A **Selenium web scraper** that automatically pulls job listings from [ActuaryList.com](https://www.actuarylist.com/)
- **PostgreSQL** as the database

---

## 📁 Project Structure

job-board/
│
├── backend/ # Flask REST API
│ ├── app.py
│ ├── models.py
│ ├── job_routes.py
│ ├── config.py
│ ├── requirements.txt
│ └── migrations/
├ └── scraper.py
│ └── requirements.txt
│
├── frontend/ # React App
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
│
├── README.md



---

## 🚀 Tech Stack

| Layer      | Tech Used                            |
|------------|--------------------------------------|
| Backend    | Flask, Flask-RESTful, SQLAlchemy, Flask-Migrate, PostgreSQL |
| Frontend   | React.js, React Hooks                |
| Scraping   | Selenium (Python)                    |
| Testing    | Postman                              |
| Deployment | (Local only, can extend to Docker)   |

---

## ⚙️ Setup Instructions

> Make sure Python, Node.js, and PostgreSQL are installed on your machine.

---

### 🔧 Backend (Flask API)

1. **Navigate to backend folder:**
   ```bash
   cd backend


Create virtual environment and activate:

        python -m venv venv
        source venv/bin/activate  # On Windows: venv\Scripts\activate


Install dependencies:
        pip install -r requirements.txt


Create .env file for DB URI:
        DATABASE_URL=postgresql://username:password@localhost:5432/jobboard


Initialize DB:
        flask db init
        flask db migrate -m "Initial"
        flask db upgrade


Run the backend server:
        flask run


Frontend (React)
 1)  Navigate to frontend folder:
        cd frontend

 2) Install dependencies:
        npm install

3)  Start development server:
        npm start

React will run at http://localhost:3000



 Scraper (Selenium)
1)  Navigate to scraper folder:
        cd scraper

2)  Install dependencies:
        pip install -r requirements.txt

3) Run the scraper:
        python scraper.py


 API Testing (Postman)
        # You can test all endpoints using Postman:

        # GET /jobs – Get all jobs (with filters: job_type, location, tag)

        # POST /jobs – Add new job

        # PUT /jobs/:id – Update a job

        # DELETE /jobs/:id – Delete a job



Features

    Full CRUD job API with filtering & sorting

    Dynamic job UI built with React

    Real-time filter and sort by title, location, job type

    Automated job scraping from ActuaryList.com via Selenium

    PostgreSQL integration via SQLAlchemy




Assumptions & Shortcuts

    Scraper assumes ActuaryList.com layout is stable (may need changes if site updates).

    No authentication implemented — for simplicity and demo purpose.

    Frontend fetches jobs only (doesn’t yet support add/edit/delete from UI).

    SQLite was replaced with PostgreSQL for a more production-like setup.



Communication Video

    A video walkthrough of the full project has been recorded, showing:

    Project overview and architecture

    API CRUD operations via Postman

    Frontend filtering and UI

    Selenium scraping demo

    Challenges and solutions

    ➡️ Find the video on Google Drive. https://drive.google.com/file/d/1ha_7iOwPqkNi5wd7NU4g-ojtGtoxih5S/view?usp=sharing



Author
    Muahammad Usman
    GitHub Repo https://github.com/Usman9929/job-board