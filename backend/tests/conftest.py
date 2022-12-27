import pytest
from apps.account.models import Account

#     )
### using factoryboy and Fakerlibrary to make it more effiecent
# first we should make the factories - go to factories.py file
# then we will register them here
from pytest_factoryboy import register
from tests.factories import AccountFactory

### normal way
# @pytest.fixture()
# def account_1(db):
#     print('create-account1')
#     account = Account.objects.create_user(
#         username='test',
#         email='test@test.com',
#         password='test',
#         is_active=True,
#         email_verified=True
#         )
#     return account

### with factory approach to make it easy
# @pytest.fixture
# def new_account_factory(db):
#     def create_app_acount(
#         username: str = None,
#         email: str = "test@test.com",
#         password: str = None,
#         firstname: str = "firstname",
#         lastname: str = "lastname",
#         is_staff: bool = False,
#         is_superuser: bool = False,
#         is_admin: bool = False,
#         is_active: bool = True,
#         email_verified: bool = True,
#         hide_email: bool = False
#     ):
#         account = Account.objects.create_user(
#             username=username,
#             email=email,
#             password=password,
#             first_name=firstname,
#             last_name=lastname,
#             is_staff=is_staff,
#             is_superuser=is_superuser,
#             is_admin=is_admin,
#             is_active=is_active,
#             email_verified=email_verified,
#             hide_email=hide_email
#         )
#         return account
#     return create_app_acount

# @pytest.fixture
# def account(db,new_account_factory):
#     print("create-normal-account")
#     return new_account_factory(
#         username='test',
#         email='test@test.com',
#         password='test',
#     )
# @pytest.fixture
# def superuser_account(db,new_account_factory):
#     print("create-superuser-account")
#     return new_account_factory(
#         username='test',
#         email='test@test.com',
#         password='test',
#         is_admin=True,
#         is_staff=True,
#         is_superuser=True


register(AccountFactory)

# we can build the fixture here like this under
# or if you want you can build it inside the test
# @pytest.fixture
# def account(db, account_factory):
#     account = account_factory.create()
#     return account
