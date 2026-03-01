import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_shop.settings')
django.setup()

from accounts.models import User

# Check all users
users = User.objects.all()
print(f"Total users: {users.count()}")
for user in users:
    print(f"- {user.username} (id={user.id}, role={user.role}, email={user.email})")
