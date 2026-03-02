from django.contrib import admin

from .models import Order, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "posted_by", "price", "status", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["name", "description", "posted_by__username", "posted_by__email"]
    ordering = ["-created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "product", "customer", "quantity", "order_status", "created_at"]
    list_filter = ["order_status", "created_at"]
    search_fields = ["product__name", "customer__username", "customer__email"]
    ordering = ["-created_at"]
