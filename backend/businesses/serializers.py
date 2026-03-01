"""
Businesses serializers for API data serialization.
"""
from rest_framework import serializers
from .models import Category, Business, BusinessImage, BusinessVideo, BusinessReview
from accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    businesses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'businesses_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_businesses_count(self, obj):
        return obj.businesses.filter(status='approved').count()


class BusinessImageSerializer(serializers.ModelSerializer):
    """Serializer for BusinessImage model."""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BusinessImage
        fields = ['id', 'image', 'image_url', 'caption', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None


class BusinessVideoSerializer(serializers.ModelSerializer):
    """Serializer for BusinessVideo model."""
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BusinessVideo
        fields = ['id', 'video', 'video_url', 'thumbnail', 'thumbnail_url', 'title', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_video_url(self, obj):
        if obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
        return None
    
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
        return None


class BusinessReviewSerializer(serializers.ModelSerializer):
    """Serializer for BusinessReview model."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = BusinessReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BusinessListSerializer(serializers.ModelSerializer):
    """Serializer for listing businesses."""
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Business
        fields = [
            'id', 'owner', 'name', 'description', 'category', 'price',
            'contact_email', 'contact_phone', 'status', 
            'primary_image', 'average_rating', 'views',
            'created_at', 'updated_at'
        ]
    
    def get_primary_image(self, obj):
        images = obj.business_images.first()
        if images:
            request = self.context.get('request')
            if request and images.image:
                return request.build_absolute_uri(images.image.url)
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum([r.rating for r in reviews]) / len(reviews)
        return 0


class BusinessDetailSerializer(serializers.ModelSerializer):
    """Serializer for business details."""
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = BusinessImageSerializer(many=True, read_only=True)
    videos = BusinessVideoSerializer(many=True, read_only=True)
    reviews = BusinessReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Business
        fields = [
            'id', 'owner', 'name', 'description', 'category', 'price',
            'contact_email', 'contact_phone', 'address', 'website',
            'images', 'videos', 'reviews', 'average_rating',
            'status', 'is_featured', 'views',
            'created_at', 'updated_at'
        ]
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum([r.rating for r in reviews]) / len(reviews)
        return 0


class BusinessCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating businesses."""
    
    class Meta:
        model = Business
        fields = [
            'name', 'description', 'category', 'price',
            'contact_email', 'contact_phone', 'address', 'website'
        ]
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        validated_data['status'] = 'pending'
        return super().create(validated_data)


class BusinessAdminSerializer(serializers.ModelSerializer):
    """Serializer for admin business management."""
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Business
        fields = [
            'id', 'owner', 'name', 'description', 'category', 'price',
            'contact_email', 'contact_phone', 'address', 'website',
            'status', 'is_featured', 'views',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
