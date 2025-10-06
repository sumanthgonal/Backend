"""
URL configuration for budget_tracker project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def api_root(request):
    return JsonResponse({
        'message': 'Personal Budget Tracker API',
        'version': '1.0.0',
        'endpoints': {
            'authentication': '/api/auth/token/',
            'categories': '/api/categories/',
            'transactions': '/api/transactions/',
            'budgets': '/api/budgets/',
            'summary': '/api/summary/',
            'admin': '/admin/',
        },
        'frontend': 'http://localhost:5173/',
        'documentation': 'See README.md for full API documentation'
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('api.urls')),
]
