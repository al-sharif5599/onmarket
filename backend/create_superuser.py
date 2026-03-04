import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "online_shop.settings")
django.setup()

from django.contrib.auth import get_user_model  # noqa: E402


USERNAME = "sharif"
EMAIL = "sharif@gmail.com"
PASSWORD = "12345678"


def main():
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username=USERNAME,
        defaults={
            "email": EMAIL,
            "role": User.ROLE_ADMIN,
            "is_staff": True,
            "is_superuser": True,
        },
    )

    if not created:
        user.email = EMAIL
        user.role = User.ROLE_ADMIN
        user.is_staff = True
        user.is_superuser = True

    user.set_password(PASSWORD)
    user.save()

    status = "created" if created else "updated"
    print(f"Superuser {status}: username={USERNAME}, email={EMAIL}")


if __name__ == "__main__":
    main()
