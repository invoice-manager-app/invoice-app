import factory
from apps.account.models import Account
from faker import Faker

fake = Faker()


class AccountFactory(factory.django.DjangoModelFactory):
    print("account created")

    class Meta:
        model = Account

    username: str = "testuser"
    email: str = "test@example.com"
    password: str = "testpass"
    first_name: str = "firstname"
    last_name: str = "lastname"
    is_staff: bool = False
    is_superuser: bool = False
    is_admin: bool = False
    is_active: bool = True
    email_verified: bool = True
    hide_email: bool = False
