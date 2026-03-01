import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_shop.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

users = User.objects.all()
print(f"Total users: {users.count()}")
for u in users:
    print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}, Role: {u.role}, Is_staff: {u.is_staff}, Is_superuser: {u.is_superuser}")
