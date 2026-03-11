import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from authentication.serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class TokenDecodeView(APIView):
    """
    Endpoint to decode a standard or custom JWT token safely without verifying the signature
    (This returns the decoded payload as requested).
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        token_string = request.data.get('token')
        
        if not token_string:
            return Response({"error": "Token is required in request body."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the token unsafely (just return the decoded payload)
            decoded_payload = jwt.decode(token_string, options={"verify_signature": False})
            return Response(decoded_payload, status=status.HTTP_200_OK)
        except jwt.DecodeError:
            return Response({"error": "Invalid token format"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
