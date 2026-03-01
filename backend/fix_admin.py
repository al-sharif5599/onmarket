import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_shop.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Find Al_sharif user and make them superuser
user = User.objects.filter(username='Al_sharif').first()
if user:
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"User {user.username} is now staff and superuser")
else:
    print("User not found")

# List all users again
users = User.objects.all()
print(f"\nTotal users: {users.count()}")
for u in users:
    print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}, Role: {u.role}, Is_staff: {u.is_staff}, Is_superuser: {u.is_superuser}")
