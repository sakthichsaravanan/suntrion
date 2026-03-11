from django.db import models
from fernet_fields import EncryptedCharField

class Patient(models.Model):
    name = models.CharField(max_length=255)
    phone_number = EncryptedCharField(max_length=50) # Encrypted at rest
    age = models.IntegerField()
    gender = models.CharField(max_length=20)

    def __str__(self):
        return self.name
