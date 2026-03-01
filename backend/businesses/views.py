"""
Businesses views for business management API.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q, Count
from django.utils import timezone
from .models import Category, Business, BusinessImage, BusinessVideo, BusinessReview
from .serializers import (
    CategorySerializer, 
    BusinessListSerializer, 
    BusinessDetailSerializer,
    BusinessCreateSerializer,
    BusinessAdminSerializer,
    BusinessImageSerializer,
    BusinessVideoSerializer,
    BusinessReviewSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category CRUD operations."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Category.objects.annotate(
            businesses_count=Count('businesses', filter=Q(businesses__status='approved'))
        )
        return queryset.order_by('name')


class BusinessViewSet(viewsets.ModelViewSet):
    """ViewSet for Business CRUD operations."""
    queryset = Business.objects.all()
    serializer_class = BusinessListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BusinessListSerializer
        elif self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return BusinessDetailSerializer
        return BusinessListSerializer
    
    def get_queryset(self):
        queryset = Business.objects.select_related('owner', 'category').prefetch_related(
            'business_images', 'business_videos', 'reviews'
        )
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        
        if self.request.user.is_authenticated:
            if self.request.user.is_admin:
                # Admin sees all businesses
                if status_filter:
                    queryset = queryset.filter(status=status_filter)
            else:
                # Regular users see only approved businesses
                queryset = queryset.filter(status='approved')
        else:
            # Anonymous users see only approved businesses
            queryset = queryset.filter(status='approved')
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Filter by owner (for customer's own businesses)
        owner = self.request.query_params.get('owner', None)
        if owner and self.request.user.is_authenticated:
            queryset = queryset.filter(owner_id=owner)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        business = serializer.save()
        # Handle image uploads
        images = self.request.FILES.getlist('images')
        for image in images:
            BusinessImage.objects.create(business=business, image=image)
        
        # Handle video uploads
        videos = self.request.FILES.getlist('videos')
        for video in videos:
            BusinessVideo.objects.create(business=business, video=video)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment views
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upload_image(self, request, pk=None):
        """Upload additional image to business."""
        business = self.get_object()
        
        # Check permission
        if not request.user.is_admin and business.owner != request.user:
            return Response(
                {'error': 'You do not have permission to upload images to this business'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        image = request.FILES.get('image')
        if not image:
            return Response(
                {'error': 'No image provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        business_image = BusinessImage.objects.create(
            business=business, 
            image=image,
            caption=request.data.get('caption', '')
        )
        
        serializer = BusinessImageSerializer(business_image, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upload_video(self, request, pk=None):
        """Upload video to business."""
        business = self.get_object()
        
        # Check permission
        if not request.user.is_admin and business.owner != request.user:
            return Response(
                {'error': 'You do not have permission to upload videos to this business'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        video = request.FILES.get('video')
        if not video:
            return Response(
                {'error': 'No video provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        business_video = BusinessVideo.objects.create(
            business=business,
            video=video,
            title=request.data.get('title', '')
        )
        
        serializer = BusinessVideoSerializer(business_video, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_review(self, request, pk=None):
        """Add review to business."""
        business = self.get_object()
        
        # Check if user already reviewed
        if BusinessReview.objects.filter(business=business, user=request.user).exists():
            return Response(
                {'error': 'You have already reviewed this business'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = BusinessReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(business=business, user=request.user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_businesses(self, request):
        """Get current user's businesses."""
        businesses = Business.objects.filter(owner=request.user).select_related('category')
        serializer = BusinessListSerializer(businesses, many=True, context={'request': request})
        return Response(serializer.data)


class BusinessAdminViewSet(viewsets.ModelViewSet):
    """ViewSet for admin business management."""
    queryset = Business.objects.all()
    serializer_class = BusinessAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = Business.objects.select_related('owner', 'category')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a business."""
        business = self.get_object()
        business.status = 'approved'
        business.save(update_fields=['status'])
        return Response({'message': 'Business approved successfully'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a business."""
        business = self.get_object()
        business.status = 'rejected'
        business.save(update_fields=['status'])
        return Response({'message': 'Business rejected successfully'})
    
    @action(detail=True, methods=['post'])
    def feature(self, request, pk=None):
        """Toggle featured status of a business."""
        business = self.get_object()
        business.is_featured = not business.is_featured
        business.save(update_fields=['is_featured'])
        return Response({
            'message': f"Business {'featured' if business.is_featured else 'unfeatured'} successfully"
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get business statistics."""
        total_businesses = Business.objects.count()
        pending_businesses = Business.objects.filter(status='pending').count()
        approved_businesses = Business.objects.filter(status='approved').count()
        rejected_businesses = Business.objects.filter(status='rejected').count()
        
        return Response({
            'total': total_businesses,
            'pending': pending_businesses,
            'approved': approved_businesses,
            'rejected': rejected_businesses,
        })
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending businesses."""
        businesses = Business.objects.filter(status='pending').select_related('owner', 'category')
        serializer = BusinessAdminSerializer(businesses, many=True)
        return Response(serializer.data)
