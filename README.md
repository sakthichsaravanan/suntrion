Hospital Appointment System

A full-stack Hospital Appointment Management System built using Django REST Framework for the backend and React + TypeScript + TailwindCSS for the frontend.
The system allows managing patients, doctors, and appointments with secure authentication, encrypted data storage, and caching for improved performance.

---

Project Overview

This project provides a RESTful API and modern UI to manage hospital operations.

Core features include:

- Patient management
- Doctor management
- Appointment scheduling
- JWT authentication
- Redis caching
- Encrypted sensitive data
- Modern responsive dashboard UI

The backend exposes REST APIs while the frontend consumes them to display an interactive interface.

---

Tech Stack

Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Redis
- SimpleJWT
- django-fernet-fields
- django-redis

Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Router
- Zustand
- Framer Motion
- React Hook Form
- Zod

---

Project Architecture

hospital-appointment-system

backend/
    config/
    authentication/
    patients/
    doctors/
    appointments/
    utils/
    manage.py
    requirements.txt
    .env

frontend/
    hospital-frontend/
        src/
        public/
        package.json

Backend handles business logic and database operations.
Frontend provides the user interface and communicates with backend APIs.

---

Backend Features

Authentication

JWT authentication using SimpleJWT.

Login endpoint:

POST /api/token/

Token decode endpoint:

POST /api/token/decode/

---

Patient Management

Endpoints:

GET /api/patients/
POST /api/patients/
GET /api/patients/{id}/
PUT /api/patients/{id}/
DELETE /api/patients/{id}/

Sensitive patient phone numbers are encrypted using django-fernet-fields.

---

Doctor Management

Endpoints:

GET /api/doctors/
POST /api/doctors/
GET /api/doctors/{id}/
PUT /api/doctors/{id}/
DELETE /api/doctors/{id}/

---

Appointment Management

Endpoints:

GET /api/appointments/
POST /api/appointments/
GET /api/appointments/{id}/
PUT /api/appointments/{id}/
DELETE /api/appointments/{id}/

Each appointment links a patient with a doctor.

Status values:

- Scheduled
- Completed
- Cancelled

---

Redis Caching

Redis is used to cache frequently accessed API responses.

Caching rules:

Patients list → 2 minutes
Doctors list → 2 minutes
Appointments list → 1 minute

Detail endpoints also use caching.

Cache automatically invalidates when records are created, updated, or deleted.

---

Database

The project uses PostgreSQL as the main database.

Environment variables are used for secure configuration.

Example ".env" file:

SECRET_KEY=your_secret_key

DB_NAME=hospital_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

FERNET_KEYS=your_encryption_key

---

Frontend Features

The frontend is a responsive dashboard built with React.

Pages included:

- Login
- Dashboard
- Patients
- Doctors
- Appointments

Features:

- JWT authentication
- Protected routes
- API integration with Axios
- Form validation
- Animated UI components
- Responsive design

---

Setup Instructions

1. Clone Repository

git clone https://github.com/yourusername/hospital-appointment-system.git
cd hospital-appointment-system

---

Backend Setup

Create virtual environment

python -m venv venv

Activate environment:

Windows

venv\Scripts\activate

Linux / Mac

source venv/bin/activate

---

Install dependencies

pip install -r requirements.txt

---

Configure Environment Variables

Create ".env" file inside backend folder.

Add database and secret key configuration.

---

Run Database Migrations

python manage.py makemigrations
python manage.py migrate

---

Create Superuser

python manage.py createsuperuser

---

Run Backend Server

python manage.py runserver

Backend will run at:

http://127.0.0.1:8000

---

Frontend Setup

Navigate to frontend folder:

cd frontend/hospital-frontend

Install dependencies:

npm install

Run development server:

npm run dev

Frontend runs at:

http://localhost:5173

---

API Testing

You can test the API using:

- Postman
- cURL
- Browser
- Frontend UI

Example request to create patient:

POST /api/patients/

{
  "name": "John Doe",
  "age": 30,
  "gender": "Male",
  "phone_number": "9876543210"
}

---

Security Features

- JWT authentication
- Encrypted phone numbers
- Environment variable configuration
- Redis caching
- Role-based access capability

---

Future Improvements

Possible improvements:

- Role-based permissions
- Doctor availability scheduling
- Calendar view for appointments
- Email notifications
- Docker deployment
- CI/CD pipeline

---
