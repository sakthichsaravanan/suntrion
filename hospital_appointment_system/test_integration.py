import os
import django

# Monkeypatch for django-fernet-fields compatibility with Django 4+
import django.utils.encoding
if not hasattr(django.utils.encoding, 'force_text'):
    django.utils.encoding.force_text = django.utils.encoding.force_str

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.core.cache import cache
from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment
from rest_framework_simplejwt.tokens import RefreshToken
import json

def test_system():
    client = Client()
    
    # 1. Test JWT Authentication
    print("Testing JWT Auth...")
    response = client.post('/api/token/', {'username': 'admin', 'password': 'admin'}, format='json')
    assert response.status_code == 200, "Failed to get token"
    tokens = response.json()
    access_token = tokens['access']
    refresh_token = tokens['refresh']
    print("[SUCCESS] JWT Access and Refresh tokens obtained.")

    # 2. Test Decode Endpoint
    print("Testing Decode Endpoint...")
    decode_res = client.post('/api/token/decode/', {'token': access_token}, format='json')
    assert decode_res.status_code == 200, "Decode failed"
    payload = decode_res.json()
    assert payload['username'] == 'admin', "Custom claim username missing"
    assert payload['role'] == 'admin', "Custom claim role missing"
    print("[SUCCESS] Custom Decode endpoint successfully decoded payload with roles.")

    headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}

    # 3. Test API CRUD & Caching
    print("Testing API CRUD...")

    # Clear cache before starting
    cache.clear()

    # Create Doctor
    doc_res = client.post('/api/doctors/', {
        'name': 'Gregory House',
        'specialty': 'Diagnostic Medicine',
        'phone_number': '555-555-5555'
    }, **headers)
    assert doc_res.status_code == 201
    doc_id = doc_res.json()['id']
    print("[SUCCESS] Doctor Created.")

    # Create Patient
    pat_res = client.post('/api/patients/', {
        'name': 'John Doe',
        'phone_number': '123-456-7890',
        'age': 40,
        'gender': 'Male'
    }, **headers)
    assert pat_res.status_code == 201
    pat_id = pat_res.json()['id']
    print("[SUCCESS] Patient Created.")

    # Check Patient Encrypted DB Phone
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT phone_number FROM patients_patient WHERE id=%s", [pat_id])
        encrypted_phone_raw = cursor.fetchone()[0]
        
        if isinstance(encrypted_phone_raw, memoryview):
            encrypted_phone = bytes(encrypted_phone_raw).decode('utf-8', errors='ignore')
        elif isinstance(encrypted_phone_raw, bytes):
            encrypted_phone = encrypted_phone_raw.decode('utf-8', errors='ignore')
        else:
            encrypted_phone = str(encrypted_phone_raw)

        # Should not be plain text
        assert "123-456-7890" not in encrypted_phone, "Phone number is NOT encrypted in DB!"
        assert encrypted_phone.startswith("gAAAAA"), f"Does not start with fernet signature: {encrypted_phone}"
    print("[SUCCESS] Verified Patient phone_number is fully encrypted at rest.")

    # Verify Patient Cache Behavior
    # First request: caches
    list_res1 = client.get('/api/patients/', **headers)
    assert cache.get('patients_list') is not None, "List cache not set!"
    print("[SUCCESS] Redis List Caching works.")
    
    detail_res1 = client.get(f'/api/patients/{pat_id}/', **headers)
    assert cache.get(f'patient_{pat_id}') is not None, "Detail cache not set!"
    print("[SUCCESS] Redis Detail Caching works.")

    # Now run an update (PATCH) and verify invalidation
    patch_res = client.patch(f'/api/patients/{pat_id}/', {'age': 41}, content_type='application/json', **headers)
    assert patch_res.status_code == 200
    assert cache.get('patients_list') is None, "List cache WAS NOT invalidated!"
    assert cache.get(f'patient_{pat_id}') is None, "Detail cache WAS NOT invalidated!"
    print("[SUCCESS] Redis Cache Invalidation works on mutative requests (PATCH).")

    # Create Appointment
    app_res = client.post('/api/appointments/', {
        'patient': pat_id,
        'doctor': doc_id,
        'datetime': '2026-03-10T15:00:00Z',
        'notes': 'Consultation',
        'status': 'SCHEDULED',
        'location': 'Room A'
    }, **headers)
    assert app_res.status_code == 201
    print("✅ Appointment Created successfully. All APIs operational.")

    print("\n-------------------------------------------")
    print("ALL INTEGRATION TESTS PASSED SUCCESSFULLY.")
    print("-------------------------------------------")

if __name__ == '__main__':
    test_system()
