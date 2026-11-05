# AgenticX Placement Poster Studio

A production-ready Django application for generating professional **1080×1350 (4:5 ratio)** student placement posters and clickable PDFs.

---

## 🌟 Key Features

- **Canva-Style Interactive Photo Controls**:
  - Direct on-canvas click-and-drag positioning.
  - Interactive scroll/wheel and slider zoom (60% to 250%).
  - One-click centering and position reset.
  - Automatic fallback to `student_1.jpg` when starting a new poster.
- **Export Capabilities**:
  - **Single-page 4:5 PDF** with real clickable link annotations:
    - AgenticX Website (`https://www.agenticx.co.in/`)
    - LinkedIn (`https://www.linkedin.com/company/agenticx-knowledge-solutions/`)
    - Instagram (`https://www.instagram.com/agenticxknowledgesolutions`)
  - **High-Resolution PNG** (1080×1350) for Instagram & social media sharing.
- **Save as Draft & Continue Editing**:
  - Cloud database drafts and automatic local browser draft recovery.
- **Poster Management Dashboard (`/manage/`)**:
  - Card-based search & filtering by student, college, company, or designation.
  - One-click actions to edit, download, or delete posters.
- **Responsive Layout**:
  - Tailored UI tiers for Mobile Phone, Tablet, Laptop, and Desktop screens.
  - Collapsible side panel for wide canvas viewing.
- **Hardened for Production**:
  - Environment-based security with `python-decouple`.
  - SSL redirection, HSTS headers, WhiteNoise static files, and Heroku/Render `Procfile`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- `pip` and `virtualenv`

### 2. Installation
```bash
# Clone repository
git clone https://github.com/AgenticxKnowledgesolutions/AgenticX_Poster.git
cd AgenticX_Poster

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
# Windows
copy .env.example .env
# Linux/macOS
cp .env.example .env
```
Update `.env` with your secure secret key and allowed host settings.

### 4. Database Setup & Migrations
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### 5. Run Local Development Server
```bash
python manage.py runserver
```
Visit `http://127.0.0.1:8000/` in your browser.

---

## 📁 Project Structure

```
├── poster_studio/           # Django project configuration & settings
├── posters/                 # Poster studio application (models, views, templates)
│   ├── templates/posters/
│   │   ├── index.html       # Poster design canvas & controls
│   │   └── manage.html      # Poster management dashboard
├── static/                  # CSS stylesheets, JS app logic, and brand assets
│   ├── css/styles.css
│   ├── js/app.js
│   └── assets/
├── media/                   # User-uploaded student photos
├── requirements.txt         # Production dependencies
├── Procfile                 # Deployment process file (Gunicorn)
├── .env.example             # Template environment configuration
└── README.md
```

---

## 🔒 Security Note
Never commit the `.env` file or SQLite database to version control. The `.gitignore` file is pre-configured to keep credentials and local media secure.
