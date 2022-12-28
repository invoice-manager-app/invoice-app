import pytest
from apps.account.models import Account

# from django.test import Client
from rest_framework.test import APIClient
from tests.factories import AccountFactory

client = APIClient()
## test impelement of the method 2 of creating factories
# def test_superuser_account(superuser_account):
#     print('check-superuser-account')
#     assert superuser_account.username == 'test'
#     assert superuser_account.email == 'test@test.com'
#     assert superuser_account.is_active == True
#     assert superuser_account.email_verified == True
#     assert superuser_account.is_superuser == True

# def test_account(account):
#     print('check-normal-account')
#     assert account.username == 'test'
#     assert account.email == 'test@test.com'
#     assert account.is_active == True
#     assert account.email_verified == True
#     assert account.is_superuser == False

### testing with the factoryboy and faker method

# def test_account(account_factory):
#     print(account_factory.username)
#     assert True

## to save the user to the test database
## or to create the user without save it to db

# @pytest.mark.django_db
# def test_account(account_factory):

#     # to save
#     # account = account_factory.create()

#     # to create only without save to db
#     # account = account_factory.build()

#     # to create account with passing data - it will overwrite the existing data in the factory
#     account = account_factory(username="ali")

#     print(Account.objects.all().count())
#     assert account.username == 'ali'
#     assert account.is_superuser == False
#     assert account.email == 'test@test.com'

## to check more than one senario in a model


######################################
## test the API endpoints


@pytest.mark.parametrize(
    "email, username, password, confirm_password, validity",
    [
        ("test@example.com", "testuser", "testpass", "testpass", 201),
        ("test@example.com", "testuser", "testpass", "testpass2", 400),
        ("", "testuser", "testpass", "testpass", 400),
        ("test@example.com", "", "testpass", "testpass", 400),
        ("test@example.com", "testuser", "", "testpass", 400),
        ("test@example.com", "testuser", "testpass", "", 400),
    ],
)
@pytest.mark.django_db
def test_create_account(email: str, username: str, password: str, confirm_password: str, validity: int):
    data = {"email": email, "username": username, "password": password, "confirm_password": confirm_password}
    response = client.post("/account/register/", data=data)
    assert response.status_code == validity
    if validity == 201:
        assert response.data["username"] == data["username"]
        assert response.data["email"] == data["email"]
        assert "passowrd" not in response.data
        assert "pk" and "message" in response.data


@pytest.mark.parametrize(
    "email, password, validity",
    [
        ("test@example.com", "testpass", 200),
        ("wrongtest@example.com", "testpass", 401),
        ("test@example.com", "wrongtestpass", 401),
    ],
)
@pytest.mark.django_db
def test_login_account(email: str, password: str, validity: int):
    print("test login called")
    # account = account_factory.create()
    # print(Account.objects.all().count())
    # Create an account
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass",
        "confirm_password": "testpass",
    }
    client.post("/account/register/", data=data)

    # Retrieve the account
    response = client.post("/account/login_token/", data={"email": email, "password": password})
    assert response.status_code == validity
    if validity == 200:
        assert "access" and "refresh" in response.data


# @pytest.mark.parametrize(
#     "email, password, validity",
#     [
#         ("forprokm@gmail.com", "testpass", 200),
#         ("wrongforprokm@gmail.com", "testpass", 401),
#         ("forprokm@gmail.com", "wrongtestpass", 401),

#     ],
# )
@pytest.mark.django_db
def test_view_account():
    # Create an account
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass",
        "confirm_password": "testpass",
    }
    client.post("/account/register/", data=data)

    # Retrieve the account
    login_response = client.post("/account/login_token/", data={"email": data["email"], "password": data["password"]})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
    response = client.get("/account/view/")
    assert response.status_code == 200
    assert "pk" and "first_name" in response.data


# @pytest.mark.parametrize(
#     "email, password, validity",
#     [
#         ("forprokm@gmail.com", "testpass", 200),
#         ("wrongforprokm@gmail.com", "testpass", 401),
#         ("forprokm@gmail.com", "wrongtestpass", 401),

#     ],
# )
@pytest.mark.django_db
def test_edit_account():
    # Create an account
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass",
        "confirm_password": "testpass",
    }
    client.post("/account/register/", data=data)
    login_response = client.post("/account/login_token/", data={"email": data["email"], "password": data["password"]})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    update_data = {
        "email": "updatetest@example.com",
        "username": "updatetestuser",
        "first_name": "firstname",
        "last_name": "lastname",
        "hide_email": False,
    }
    response = client.put("/account/edit/", data=update_data)
    assert response.status_code == 200
    assert response.data["username"] == update_data["username"]
    assert response.data["email"] == update_data["email"]
    assert response.data["first_name"] == update_data["first_name"]
    assert response.data["last_name"] == update_data["last_name"]
    assert response.data["hide_email"] == update_data["hide_email"]
    assert "pk" in response.data


@pytest.mark.parametrize(
    "old_password, new_password, confirm_new_password, validity",
    [
        ("testpass", "newtestpass", "newtestpass", 200),
        ("testpass", "testpass", "testpass", 400),
        ("wrongtestpass", "newtestpass", "newtestpass", 400),
        ("testpass", "newtestpass1", "newtestpass2", 400),
    ],
)
@pytest.mark.django_db
def test_change_password_account(old_password: str, new_password: str, confirm_new_password: str, validity: int):
    # Create an account
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass",
        "confirm_password": "testpass",
    }
    client.post("/account/register/", data=data)
    login_response = client.post("/account/login_token/", data={"email": data["email"], "password": data["password"]})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
    response = client.put(
        "/account/change_password/",
        {"old_password": old_password, "new_password": new_password, "confirm_new_password": confirm_new_password},
    )
    assert response.status_code == validity


@pytest.mark.django_db
def test_token_refresh_account():
    # Create an account
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass",
        "confirm_password": "testpass",
    }
    client.post("/account/register/", data=data)
    login_response = client.post("/account/login_token/", data={"email": data["email"], "password": data["password"]})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    response = client.post("/account/token/refresh/", data={"refresh": login_response.data["refresh"]})
    assert response.status_code == 200
    assert "access" in response.data
    assert login_response.data["access"] != response.data["access"]


@pytest.mark.parametrize(
    "email, validity, validity2",
    [
        ("test@example.com", 200, True),
        ("wrongtest@example.com", 404, False),
    ],
)
@pytest.mark.django_db
def test_check_email_account(email: str, validity: int, validity2: bool):
    # Create an account
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass",
        "confirm_password": "testpass",
    }
    client.post("/account/register/", data=data)
    response = client.post("/account/check_email/", data={"email": email})
    assert response.status_code == validity
    assert response.data["is_exists"] == validity2
