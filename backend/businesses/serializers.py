from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import Order, Product


class ProductSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "image",
            "video",
            "image_url",
            "video_url",
            "status",
            "created_at",
            "posted_by",
        ]
        read_only_fields = ["id", "status", "created_at", "posted_by", "image_url", "video_url"]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_video_url(self, obj):
        if not obj.video:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.video.url)
        return obj.video.url


class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "description", "price", "image", "video"]


class ProductAdminActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["status"]


class OrderSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source="product", queryset=Product.objects.filter(status=Product.STATUS_APPROVED), write_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "product_id",
            "customer",
            "quantity",
            "order_status",
            "created_at",
        ]
        read_only_fields = ["id", "product", "customer", "order_status", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]
        return Order.objects.create(customer=request.user, order_status=Order.STATUS_APPROVED, **validated_data)
