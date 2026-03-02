from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthApiTests(APITestCase):
    def test_register_and_login_with_username(self):
        register_payload = {
            "username": "customer1",
            "email": "customer1@example.com",
            "password": "StrongPass123!",
            "confirm_password": "StrongPass123!",
        }

        register_response = self.client.post("/api/auth/register/", register_payload, format="json")
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", register_response.data)
        self.assertEqual(register_response.data["user"]["role"], "customer")

        login_response = self.client.post(
            "/api/auth/login/",
            {"username": "customer1", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data["tokens"])

    def test_only_admin_can_list_customers(self):
        admin = User.objects.create_user(
            username="admin1",
            email="admin1@example.com",
            password="StrongPass123!",
            role="admin",
            is_staff=True,
            is_superuser=True,
        )
        customer = User.objects.create_user(
            username="customer2",
            email="customer2@example.com",
            password="StrongPass123!",
            role="customer",
        )

        self.client.force_authenticate(user=customer)
        customer_response = self.client.get("/api/auth/users/")
        self.assertEqual(customer_response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=admin)
        admin_response = self.client.get("/api/auth/users/")
        self.assertEqual(admin_response.status_code, status.HTTP_200_OK)
        self.assertEqual(admin_response.data["count"], 1)
