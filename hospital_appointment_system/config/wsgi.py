import os
from django.core.wsgi import get_wsgi_application

# Monkeypatch for django-fernet-fields compatibility with Django 4+
import django.utils.encoding
if not hasattr(django.utils.encoding, 'force_text'):
    django.utils.encoding.force_text = django.utils.encoding.force_str

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()
