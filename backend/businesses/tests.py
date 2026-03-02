from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Order, Product

User = get_user_model()


class ProductOrderApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="StrongPass123!",
            role="admin",
            is_staff=True,
            is_superuser=True,
        )
        self.customer = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="StrongPass123!",
            role="customer",
        )
        self.other_customer = User.objects.create_user(
            username="customer_b",
            email="customer_b@example.com",
            password="StrongPass123!",
            role="customer",
        )

    def test_customer_product_submission_and_admin_approval(self):
        self.client.force_authenticate(user=self.customer)
        create_response = self.client.post(
            "/api/products/",
            {"name": "Rice", "description": "Bag of rice", "price": "25000.00"},
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_response.data["status"], "pending")
        product_id = create_response.data["id"]

        list_response = self.client.get("/api/products/")
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data["count"], 0)

        own_detail_response = self.client.get(f"/api/products/{product_id}/")
        self.assertEqual(own_detail_response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.other_customer)
        other_detail_response = self.client.get(f"/api/products/{product_id}/")
        self.assertIn(other_detail_response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        self.client.force_authenticate(user=self.admin)
        approve_response = self.client.post(f"/api/admin/products/{product_id}/approve/")
        self.assertEqual(approve_response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.customer)
        approved_list_response = self.client.get("/api/products/")
        self.assertEqual(approved_list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(approved_list_response.data["count"], 1)

    def test_pending_edit_allowed_but_approved_edit_denied_for_customer(self):
        pending_product = Product.objects.create(
            name="Beans",
            description="Red beans",
            price="8000.00",
            posted_by=self.customer,
            status=Product.STATUS_PENDING,
        )
        approved_product = Product.objects.create(
            name="Oil",
            description="Cooking oil",
            price="12000.00",
            posted_by=self.customer,
            status=Product.STATUS_APPROVED,
        )

        self.client.force_authenticate(user=self.customer)
        pending_update = self.client.patch(
            f"/api/products/{pending_product.id}/",
            {"name": "Beans Updated"},
            format="json",
        )
        self.assertEqual(pending_update.status_code, status.HTTP_200_OK)

        approved_update = self.client.patch(
            f"/api/products/{approved_product.id}/",
            {"name": "Oil Updated"},
            format="json",
        )
        self.assertEqual(approved_update.status_code, status.HTTP_403_FORBIDDEN)

    def test_order_flow_and_permissions(self):
        approved_product = Product.objects.create(
            name="Sugar",
            description="White sugar",
            price="3000.00",
            posted_by=self.admin,
            status=Product.STATUS_APPROVED,
        )
        pending_product = Product.objects.create(
            name="Tea",
            description="Tea leaves",
            price="2000.00",
            posted_by=self.customer,
            status=Product.STATUS_PENDING,
        )

        self.client.force_authenticate(user=self.customer)
        create_order = self.client.post(
            "/api/orders/",
            {"product_id": approved_product.id, "quantity": 2},
            format="json",
        )
        self.assertEqual(create_order.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_order.data["order_status"], "approved")

        invalid_order = self.client.post(
            "/api/orders/",
            {"product_id": pending_product.id, "quantity": 1},
            format="json",
        )
        self.assertEqual(invalid_order.status_code, status.HTTP_400_BAD_REQUEST)

        my_orders = self.client.get("/api/orders/")
        self.assertEqual(my_orders.status_code, status.HTTP_200_OK)
        self.assertEqual(my_orders.data["count"], 1)

        order_id = create_order.data["id"]
        customer_delete = self.client.delete(f"/api/orders/{order_id}/")
        self.assertEqual(customer_delete.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        all_orders = self.client.get("/api/orders/")
        self.assertEqual(all_orders.status_code, status.HTTP_200_OK)
        self.assertEqual(all_orders.data["count"], 1)

        admin_delete = self.client.delete(f"/api/orders/{order_id}/")
        self.assertEqual(admin_delete.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Order.objects.count(), 0)
