from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Product(models.Model):
    """Product submitted by admin or customer."""

    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"

    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
    )

    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="products",
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "products"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Order(models.Model):
    """Order placed by customer on approved products."""

    STATUS_APPROVED = "approved"

    STATUS_CHOICES = (
        (STATUS_APPROVED, "Approved"),
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="orders")
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
    )
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_APPROVED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id}"
