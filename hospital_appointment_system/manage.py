import os
import sys

def main():
    """Run administrative tasks."""
    # Monkeypatch for django-fernet-fields compatibility with Django 4+
    import django.utils.encoding
    if not hasattr(django.utils.encoding, 'force_text'):
        django.utils.encoding.force_text = django.utils.encoding.force_str

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
