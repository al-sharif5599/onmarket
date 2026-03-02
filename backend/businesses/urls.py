from django.urls import path

from .views import (
    MyProductsView,
    OrderDetailView,
    OrderListCreateView,
    ProductDetailView,
    ProductListCreateView,
    admin_statistics,
    approve_product,
    reject_product,
)

urlpatterns = [
    path("products/", ProductListCreateView.as_view(), name="product-list-create"),
    path("products/my/", MyProductsView.as_view(), name="my-products"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("admin/products/<int:pk>/approve/", approve_product, name="approve-product"),
    path("admin/products/<int:pk>/reject/", reject_product, name="reject-product"),
    path("admin/statistics/", admin_statistics, name="admin-statistics"),
    path("orders/", OrderListCreateView.as_view(), name="order-list-create"),
    path("orders/<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]
