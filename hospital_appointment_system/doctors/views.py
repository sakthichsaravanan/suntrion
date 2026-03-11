from rest_framework import viewsets
from rest_framework.response import Response
from django.core.cache import cache
from .models import Doctor
from .serializers import DoctorSerializer
from utils.cache_helpers import invalidate_cache

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    # CACHE CONSTANTS
    LIST_CACHE_KEY = "doctors_list"
    LIST_CACHE_TIMEOUT = 60 * 2  # 2 minutes
    DETAIL_CACHE_PREFIX = "doctor"
    DETAIL_CACHE_TIMEOUT = 60 * 5  # 5 minutes

    def list(self, request, *args, **kwargs):
        cached_data = cache.get(self.LIST_CACHE_KEY)
        if cached_data is not None:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        cache.set(self.LIST_CACHE_KEY, response.data, self.LIST_CACHE_TIMEOUT)
        return response

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        cache_key = f"{self.DETAIL_CACHE_PREFIX}_{instance.id}"
        cached_data = cache.get(cache_key)
        
        if cached_data is not None:
            return Response(cached_data)

        response = super().retrieve(request, *args, **kwargs)
        cache.set(cache_key, response.data, self.DETAIL_CACHE_TIMEOUT)
        return response

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX)
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        instance = self.get_object()
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX, instance.id)
        return response

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        instance = self.get_object()
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX, instance.id)
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX, instance.id)
        return super().destroy(request, *args, **kwargs)
