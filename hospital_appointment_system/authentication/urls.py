from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from authentication.jwt_views import CustomTokenObtainPairView, TokenDecodeView

urlpatterns = [
    path('', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('decode/', TokenDecodeView.as_view(), name='token_decode'),
]
