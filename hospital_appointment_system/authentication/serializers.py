from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # Assuming you determine role based on superuser or staff status, or a custom profile field
        if user.is_superuser:
            token['role'] = 'admin'
        elif user.is_staff:
            token['role'] = 'staff'
        else:
            token['role'] = 'user'

        return token
