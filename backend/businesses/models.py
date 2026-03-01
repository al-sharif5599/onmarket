"""
Businesses models for business listings.
"""
from django.db import models
from django.conf import settings
import os
from uuid import uuid4


def upload_to(instance, filename):
    """Generate unique filename for uploaded files."""
    ext = filename.split('.')[-1]
    filename = f"{uuid4().hex}.{ext}"
    return os.path.join('businesses', filename)


class Category(models.Model):
    """Category model for business classification."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Business(models.Model):
    """Business model for listing businesses/products."""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='businesses'
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='businesses'
    )
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Media fields
    images = models.JSONField(default=list, blank=True)
    videos = models.JSONField(default=list, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'businesses'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def approved(self):
        return self.status == 'approved'
    
    @property
    def pending(self):
        return self.status == 'pending'
    
    @property
    def rejected(self):
        return self.status == 'rejected'


class BusinessImage(models.Model):
    """Additional images for businesses."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='business_images')
    image = models.ImageField(upload_to=upload_to)
    caption = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'business_images'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Image for {self.business.name}"


class BusinessVideo(models.Model):
    """Videos for businesses."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='business_videos')
    video = models.FileField(upload_to=upload_to)
    thumbnail = models.ImageField(upload_to='video_thumbnails/', blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'business_videos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Video for {self.business.name}"


class BusinessReview(models.Model):
    """Reviews for businesses."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='reviews'
    )
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'business_reviews'
        ordering = ['-created_at']
        unique_together = ['business', 'user']
    
    def __str__(self):
        return f"Review by {self.user.username} for {self.business.name}"
