import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_shop.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Find Al_sharif user and reset password using Django's hashing
user = User.objects.filter(username='Al_sharif').first()
if user:
    user.set_password('admin123')
    user.save()
    print(f"Password reset for user: {user.username}")
else:
    print("User not found")

# Also reset testuser2
user2 = User.objects.filter(username='testuser2').first()
if user2:
    user2.set_password('testpass123')
    user2.save()
    print(f"Password reset for user: {user2.username}")
