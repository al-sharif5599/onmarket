import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_shop.settings')
django.setup()

from accounts.models import User

# Create superuser
username = 'admin'
email = 'admin@onmarket.com'
password = 'admin123'

if not User.objects.filter(username=username).exists():
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        role='admin'
    )
    print(f'Superuser created: {username} / {password}')
else:
    print('Superuser already exists')
