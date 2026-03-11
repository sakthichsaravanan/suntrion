# Hospital Appointment System

A production-ready Django REST Framework API for managing patients, doctors, and appointments with secure authentication, Redis caching, and encrypted sensitive data.

---

## 🚀 Features
- **Clean Architecture** with a decoupled design.
- **PostgreSQL Database** for robust relational data modeling.
- **Redis Caching** with automatic invalidation logic mapping API requirements.
- **JWT Authentication** (djangorestframework-simplejwt) with token rotation, blocklisting, and custom claim overrides (roles).
- **At-Rest Encryption** via `django-fernet-fields` to protect sensitive information like phone numbers.
- **Custom Token Decode API** to safely inspect token payloads without valid signatures.

---

## ⚙️ Prerequisites
- Python 3.11+
- PostgreSQL
- Redis Server
- OpenSSL (for generating secure credentials, optional)

---

## 🛠️ 1. Setup PostgreSQL

1. Open your PostgreSQL console (`psql`).
2. Create the database and necessary roles:

```sql
CREATE DATABASE hospital_db;
CREATE USER postgres WITH PASSWORD 'postgres';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE hospital_db TO postgres;
```

*(Note: Adjust credentials in `.env` if you change them.)*

---

## 🛠️ 2. Setup Redis

Ensure Redis is installed and running on default port `6379`.

**Windows**:
Run Redis using WSL or Docker.
```bash
docker run -d --name redis-server -p 6379:6379 redis
```

**Linux/macOS**:
```bash
sudo systemctl start redis
# or
brew services start redis
```

---

## 📦 3. Install Dependencies

Clone this repository and create a Python virtual environment:

```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Linux/Mac:
source venv/bin/activate
```

Install the project dependencies:
```bash
pip install -r requirements.txt
```

---

## 🔐 4. Environment Variables

Environment variables are housed in a `.env` file at the root. The project requires the following keys:

```ini
DB_NAME=hospital_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_PORT=5432

REDIS_URL=redis://127.0.0.1:6379/1
DEBUG=1

# Secure 32 URL-safe base64-encoded bytes (can be generated via cryptography.fernet.Fernet.generate_key())
FERNET_KEYS=yYgT7T_f94VvC24pS3rG_1J1e1aZ9rVd4qK6sM0_W8I=

# Django Secret Key
SECRET_KEY=django-insecure-example-key...
```

---

## 🗄️ 5. Run Migrations

Before running, ensure apps are built in migrations and synced with PostgreSQL:

```bash
python manage.py makemigrations patients doctors appointments
python manage.py migrate
```

Create a superuser to access the endpoints or login:
```bash
python manage.py createsuperuser
```

---

## 🚀 6. Start Server

Start the Django development server:

```bash
python manage.py runserver
```

---

## 🧪 7. Example cURL Requests

Here are examples of usage, assuming server runs on `http://localhost:8000`.

### A. Obtain JWT Token
```bash
curl -X POST http://localhost:8000/api/token/ \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "yourpassword"}'
```
*Capture the `access` token from the response for subsequent requests.*

### B. Create Doctor API (Needs Token)
```bash
curl -X POST http://localhost:8000/api/doctors/ \
-H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "name": "House MD",
  "specialty": "Diagnostic Medicine",
  "phone_number": "555-555-5555"
}'
```

### C. Create Patient API (Phone gets encrypted at rest)
```bash
curl -X POST http://localhost:8000/api/patients/ \
-H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Jane Doe",
  "phone_number": "123-456-7890",
  "age": 30,
  "gender": "Female"
}'
```

### D. Create Appointment API
```bash
curl -X POST http://localhost:8000/api/appointments/ \
-H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "patient": 1,
  "doctor": 1,
  "datetime": "2026-03-10T15:00:00Z",
  "notes": "Followup consultation.",
  "status": "SCHEDULED",
  "location": "Room 203"
}'
```

---

## ⚡ 8. Demonstrate Caching

The caching behaves with strict invalidation rules:
- **Patients List (`/api/patients/`)**: Cached for 2 mins.
- **Patients Detail (`/api/patients/<id>/`)**: Cached for 5 mins.
- **Doctors List (`/api/doctors/`)**: Cached for 2 mins.
- **Doctors Detail (`/api/doctors/<id>/`)**: Cached for 5 mins.
- **Appointments List (`/api/appointments/`)**: Cached for 1 min.
- **Appointments Detail (`/api/appointments/<id>/`)**: Cached for 3 mins.

### Testing Cache Invalidations
Triggering a `POST`, `PUT`, `PATCH`, or `DELETE` on any entity triggers an instant invalidation:

1. Request `/api/patients/` (Load from DB -> Saved to Redis)
2. Request `/api/patients/` again (Returned directly from Redis)
3. Send a `POST` or `PATCH` request to update Patient #1.
4. The Redis keys `patients_list` and `patient_1` are instantly deleted by the `/utils/cache_helpers.py` backend utility ensuring fresh data for incoming requests.

---

## 🔑 9. Demonstrate Token Decode Endpoint

This endpoint allows microservices or frontend apps to verify user authorization claims ("roles") encoded in the token payload safely.

```bash
curl -X POST http://localhost:8000/api/token/decode/ \
-H "Content-Type: application/json" \
-d '{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}'
```

**Example Output**:
```json
{
  "token_type": "access",
  "exp": 1234567890,
  "iat": 1234567000,
  "jti": "unique-id",
  "user_id": 1,
  "username": "admin",
  "role": "admin"
}
```
