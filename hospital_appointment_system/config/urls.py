from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({
        "message": "Welcome to the Hospital Appointment System API!",
        "endpoints": {
            "token": "/api/token/",
            "patients": "/api/patients/",
            "doctors": "/api/doctors/",
            "appointments": "/api/appointments/"
        }
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/token/', include('authentication.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/appointments/', include('appointments.urls')),
]
