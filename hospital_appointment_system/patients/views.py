from rest_framework import viewsets
from rest_framework.response import Response
from django.core.cache import cache

from .models import Patient
from .serializers import PatientSerializer
from utils.cache_helpers import invalidate_cache


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    # Cache settings
    LIST_CACHE_KEY = "patients_list"
    LIST_CACHE_TIMEOUT = 60 * 2   # 2 minutes

    DETAIL_CACHE_PREFIX = "patient"
    DETAIL_CACHE_TIMEOUT = 60 * 5  # 5 minutes


    # GET /api/patients/
    def list(self, request, *args, **kwargs):

        # Check Redis cache first
        cached_data = cache.get(self.LIST_CACHE_KEY)

        if cached_data is not None:
            return Response(cached_data)

        # If cache not found → query database
        response = super().list(request, *args, **kwargs)

        # Store result in Redis
        cache.set(self.LIST_CACHE_KEY, response.data, self.LIST_CACHE_TIMEOUT)

        return response


    # GET /api/patients/<id>/
    def retrieve(self, request, *args, **kwargs):

        instance = self.get_object()
        cache_key = f"{self.DETAIL_CACHE_PREFIX}_{instance.id}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        # Not cached → fetch from database
        response = super().retrieve(request, *args, **kwargs)

        # Save to Redis
        cache.set(cache_key, response.data, self.DETAIL_CACHE_TIMEOUT)

        return response


    # POST /api/patients/
    def create(self, request, *args, **kwargs):

        response = super().create(request, *args, **kwargs)

        # Clear cache after new patient
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX)

        return response


    # PUT /api/patients/<id>/
    def update(self, request, *args, **kwargs):

        response = super().update(request, *args, **kwargs)

        instance = self.get_object()

        # Clear cache
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX, instance.id)

        return response


    # PATCH /api/patients/<id>/
    def partial_update(self, request, *args, **kwargs):

        response = super().partial_update(request, *args, **kwargs)

        instance = self.get_object()

        # Clear cache
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX, instance.id)

        return response


    # DELETE /api/patients/<id>/
    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        # Clear cache before delete
        invalidate_cache(self.LIST_CACHE_KEY, self.DETAIL_CACHE_PREFIX, instance.id)

        return super().destroy(request, *args, **kwargs)