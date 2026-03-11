import os
import django

# Monkeypatch for django-fernet-fields compatibility with Django 4+
import django.utils.encoding
if not hasattr(django.utils.encoding, 'force_text'):
    django.utils.encoding.force_text = django.utils.encoding.force_str

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from django.db import connection
from django.core.cache import cache

def run_verifications():
    print("-----------------------------------------")
    print("1. Verifying .env variables loaded...")
    print(f"DB_NAME: {settings.DATABASES['default']['NAME']}")
    print(f"DB_USER: {settings.DATABASES['default']['USER']}")
    print(f"DB_HOST: {settings.DATABASES['default']['HOST']}")
    print(f"REDIS_LOCATION: {settings.CACHES['default']['LOCATION']}")
    print(f"FERNET_KEYS Configured: {bool(settings.FERNET_KEYS and settings.FERNET_KEYS[0])}")
    print("-----------------------------------------")

    print("2. Verifying PostgreSQL Connection...")
    try:
        connection.ensure_connection()
        print("[SUCCESS] PostgreSQL Connection successful!")
    except Exception as e:
        print(f"[ERROR] PostgreSQL Connection failed: {e}")

    print("-----------------------------------------")
    print("3. Verifying Redis Caching Configuration...")
    try:
        cache.set("test_key", "test_value", timeout=10)
        value = cache.get("test_key")
        if value == "test_value":
            print("[SUCCESS] Redis Caching successful!")
        else:
            print("[ERROR] Redis Caching failed: Retrieved value didn't match.")
    except Exception as e:
        print(f"[ERROR] Redis Caching failed: {e}")
    print("-----------------------------------------")

if __name__ == '__main__':
    run_verifications()
