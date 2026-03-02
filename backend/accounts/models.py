from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_ADMIN = "admin"
    ROLE_CUSTOMER = "customer"

    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_CUSTOMER, "Customer"),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CUSTOMER)

    class Meta:
        db_table = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.username} ({self.role})"
