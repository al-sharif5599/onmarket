"""
Businesses URL configuration.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, BusinessViewSet, BusinessAdminViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'businesses', BusinessViewSet, basename='business')
router.register(r'admin/businesses', BusinessAdminViewSet, basename='admin-business')

urlpatterns = [
    path('', include(router.urls)),
]
