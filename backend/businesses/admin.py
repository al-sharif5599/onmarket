"""
Businesses admin configuration.
"""
from django.contrib import admin
from .models import Category, Business, BusinessImage, BusinessVideo, BusinessReview


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""
    list_display = ['name', 'created_at', 'updated_at']
    search_fields = ['name', 'description']
    ordering = ['name']


class BusinessImageInline(admin.TabularInline):
    """Inline admin for BusinessImage."""
    model = BusinessImage
    extra = 1


class BusinessVideoInline(admin.TabularInline):
    """Inline admin for BusinessVideo."""
    model = BusinessVideo
    extra = 1


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    """Admin configuration for Business model."""
    list_display = ['name', 'owner', 'category', 'status', 'is_featured', 'views', 'created_at']
    list_filter = ['status', 'is_featured', 'category', 'created_at']
    search_fields = ['name', 'description', 'owner__username', 'owner__email']
    ordering = ['-created_at']
    list_editable = ['status', 'is_featured']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('owner', 'name', 'description', 'category')
        }),
        ('Pricing & Contact', {
            'fields': ('price', 'contact_email', 'contact_phone', 'address', 'website')
        }),
        ('Status', {
            'fields': ('status', 'is_featured', 'views')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'views']
    inlines = [BusinessImageInline, BusinessVideoInline]


@admin.register(BusinessReview)
class BusinessReviewAdmin(admin.ModelAdmin):
    """Admin configuration for BusinessReview model."""
    list_display = ['business', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['business__name', 'user__username', 'comment']
    ordering = ['-created_at']
