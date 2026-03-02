from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from django.db.models import Q

from .models import Order, Product
from .serializers import OrderSerializer, ProductSerializer, ProductUpdateSerializer


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Product.objects.select_related("posted_by")
        status_filter = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if self.request.user.is_authenticated and self.request.user.role == "admin":
            if status_filter:
                queryset = queryset.filter(status=status_filter)
        else:
            queryset = queryset.filter(status=Product.STATUS_APPROVED)
            if status_filter == Product.STATUS_APPROVED:
                queryset = queryset.filter(status=Product.STATUS_APPROVED)

        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        status_value = Product.STATUS_APPROVED if user.role == "admin" else Product.STATUS_PENDING
        serializer.save(posted_by=user, status=status_value)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related("posted_by")
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return ProductUpdateSerializer
        return ProductSerializer

    def get_permissions(self):
        if self.request.method in ["GET"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_object(self):
        product = super().get_object()

        if self.request.method == "GET":
            if product.status == Product.STATUS_APPROVED:
                return product
            if self.request.user.is_authenticated and (
                self.request.user.role == "admin" or product.posted_by_id == self.request.user.id
            ):
                return product
            self.permission_denied(self.request, message="Product is not available.")

        return product

    def update(self, request, *args, **kwargs):
        product = self.get_object()

        if request.user.role == "admin":
            return super().update(request, *args, **kwargs)

        if product.posted_by_id != request.user.id:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        if product.status != Product.STATUS_PENDING:
            return Response(
                {"detail": "Only pending products can be edited by customers."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "admin":
            return Response({"detail": "Only admin can delete products."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def approve_product(request, pk):
    if request.user.role != "admin":
        return Response({"detail": "Only admin can approve products."}, status=status.HTTP_403_FORBIDDEN)

    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

    product.status = Product.STATUS_APPROVED
    product.save(update_fields=["status"])
    return Response({"message": "Product approved successfully."})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def reject_product(request, pk):
    if request.user.role != "admin":
        return Response({"detail": "Only admin can reject products."}, status=status.HTTP_403_FORBIDDEN)

    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({"message": "Product rejected and removed."})


class MyProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(posted_by=self.request.user).select_related("posted_by")


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.select_related("customer", "product", "product__posted_by")
        if self.request.user.role == "admin":
            return queryset
        return queryset.filter(customer=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role != "customer":
            return Response({"detail": "Only customers can place orders."}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)


class OrderDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.select_related("customer", "product", "product__posted_by")
        if self.request.user.role == "admin":
            return queryset
        return queryset.filter(customer=self.request.user)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "admin":
            return Response({"detail": "Only admin can delete orders."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def admin_statistics(request):
    if request.user.role != "admin":
        return Response({"detail": "Only admin can view statistics."}, status=status.HTTP_403_FORBIDDEN)

    total_products = Product.objects.count()
    pending_products = Product.objects.filter(status=Product.STATUS_PENDING).count()
    approved_products = Product.objects.filter(status=Product.STATUS_APPROVED).count()
    total_orders = Order.objects.count()

    return Response(
        {
            "total_products": total_products,
            "pending_products": pending_products,
            "approved_products": approved_products,
            "total_orders": total_orders,
        }
    )
