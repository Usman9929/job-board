from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from datetime import datetime
import time

from app import create_app, db
from models.jobs import Job

# -------------------- Setup Flask App --------------------
app = create_app()
app.app_context().push()

# -------------------- Setup Selenium --------------------
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
driver = webdriver.Chrome(options=options)

print("🚀 Launching browser and loading Actuary List...")
driver.get("https://www.actuarylist.com/")

# -------------------- Click "Search Jobs" --------------------
try:
    print("🖱️ Clicking 'Search Jobs' button to load listings...")
    search_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Search Jobs')]"))
    )
    search_button.click()
    time.sleep(2)
except Exception as e:
    print(f"⚠️ Could not find or click Search button: {e}")

# -------------------- Wait for Job Listings --------------------
try:
    print("⏳ Waiting for job listings to load...")
    WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.XPATH, "//article"))
    )
except Exception as e:
    print(f"❌ Timeout waiting for job listings: {e}")
    driver.quit()
    exit()

# -------------------- Parse Page --------------------
soup = BeautifulSoup(driver.page_source, "html.parser")
with open("debug_page.html", "w", encoding="utf-8") as f:
    f.write(driver.page_source)  # for debugging

driver.quit()

# -------------------- Scrape Jobs --------------------
job_cards = soup.find_all("article")
print(f"🔍 Found {len(job_cards)} job cards.")

added_count = 0

for card in job_cards:
    try:
        title_el = card.find("p", class_="Job_job-card__position__ic1rc")
        company_el = card.find("p", class_="Job_job-card__company__7T9qY")
        location_el = card.find("div", class_="Job_job-card__locations__x1ker")
        posted_el = card.find("p", class_="Job_job-card__posted_on__NCzJa")
        tags_el = card.find("div", class_="Job_job-card__tags__zfriA")
        link_el = card.find("a", href=True)

        if not (company_el and link_el):
            print("❌ Skipping job: missing company or link.")
            continue

        title = title_el.text.strip() if title_el else "Actuarial Position"
        company = company_el.text.strip()
        location = location_el.text.strip() if location_el else "Not specified"
        posted = posted_el.text.strip() if posted_el else ""
        tags = ",".join(tag.text.strip() for tag in tags_el.find_all("span")) if tags_el else ""
        link = "https://www.actuarylist.com" + link_el["href"]

        job_type = "Full-time"
        if "Intern" in tags:
            job_type = "Internship"
        elif "Part-Time" in tags:
            job_type = "Part-time"

        existing = Job.query.filter_by(link=link).first()
        if existing:
            continue

        job = Job(
            title=title,
            company=company,
            location=location,
            posting_date=datetime.utcnow(),
            job_type=job_type,
            tags=tags,
            link=link
        )
        db.session.add(job)
        added_count += 1

    except Exception as e:
        print(f"❌ Error scraping a job: {e}")
        continue

# -------------------- Save to Database --------------------
db.session.commit()
print(f"✅ Done! {added_count} new job(s) added to the database.")
