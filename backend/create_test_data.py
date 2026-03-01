import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_shop.settings')
django.setup()

from businesses.models import Category, Business
from accounts.models import User

# Create categories
categories_data = [
    {'name': 'Restaurants', 'description': 'Food and dining'},
    {'name': 'Retail', 'description': 'Shopping and retail stores'},
    {'name': 'Services', 'description': 'Professional services'},
    {'name': 'Technology', 'description': 'Tech companies and startups'},
    {'name': 'Health', 'description': 'Healthcare and wellness'},
    {'name': 'Education', 'description': 'Schools and training'},
    {'name': 'Entertainment', 'description': 'Entertainment venues'},
    {'name': 'Automotive', 'description': 'Car dealers and repair'},
]

print("Creating categories...")
for cat_data in categories_data:
    cat, created = Category.objects.get_or_create(name=cat_data['name'], defaults={'description': cat_data['description']})
    if created:
        print(f"  Created category: {cat.name}")

# Get admin user
admin_user = User.objects.filter(username='Al_sharif').first()
if admin_user:
    print(f"\nAdmin user: {admin_user.username}")
    
    # Create some test businesses
    businesses_data = [
        {
            'name': 'Golden Restaurant',
            'description': 'Best local dining experience with authentic cuisine',
            'category': 'Restaurants',
            'price': '25.00',
            'contact_email': 'info@goldenrestaurant.com',
            'contact_phone': '+255 123 456 789',
            'status': 'approved'
        },
        {
            'name': 'Tech Solutions Ltd',
            'description': 'Professional IT consulting and software development',
            'category': 'Technology',
            'price': '100.00',
            'contact_email': 'hello@techsolutions.co.tz',
            'contact_phone': '+255 987 654 321',
            'status': 'approved'
        },
        {
            'name': 'Health Plus Clinic',
            'description': 'Quality healthcare services for the whole family',
            'category': 'Health',
            'price': '50.00',
            'contact_email': 'contact@healthplus.co.tz',
            'contact_phone': '+255 456 789 123',
            'status': 'pending'
        },
    ]
    
    print("\nCreating businesses...")
    for biz_data in businesses_data:
        category_name = biz_data.pop('category')
        category = Category.objects.get(name=category_name)
        
        biz, created = Business.objects.get_or_create(
            name=biz_data['name'],
            owner=admin_user,
            defaults={
                'description': biz_data['description'],
                'category': category,
                'price': biz_data['price'],
                'contact_email': biz_data['contact_email'],
                'contact_phone': biz_data['contact_phone'],
                'status': biz_data['status']
            }
        )
        if created:
            print(f"  Created business: {biz.name} ({biz.status})")
else:
    print("Admin user not found!")

print("\n=== Summary ===")
print(f"Categories: {Category.objects.count()}")
print(f"Businesses: {Business.objects.count()}")
print(f"  - Approved: {Business.objects.filter(status='approved').count()}")
print(f"  - Pending: {Business.objects.filter(status='pending').count()}")
print(f"  - Rejected: {Business.objects.filter(status='rejected').count()}")
