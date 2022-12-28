import pytest
from apps.account.models import Account
from apps.company.models import Company

# from django.test import Client
from rest_framework.test import APIClient

client = APIClient()


@pytest.mark.parametrize(
    "name, email, about, number, address, avatar, validity",
    [
        ("google", "google@gmail.com", "for selling", "+90334343343", "USA. NY. 334 Street", "", 201),
        ("google", "google@gmail.com", "DNS", "DNS", "DNS", "", 201),
        ("", "google@gmail.com", "for selling", "+90334343343", "USA. NY. 334 Street", "", 400),
    ],
)
@pytest.mark.django_db
def test_create_company(name: str, email: str, about: str, number: str, address: str, avatar: str, validity: int):
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

    company_data = {
        "name": name,
        "email": email,
        "avatar": avatar,
    }
    if about != "DNS":
        company_data["about"] = about
    if number != "DNS":
        company_data["number"] = number
    if address != "DNS":
        company_data["address"] = address
    response = client.post("/company/", data=company_data)
    assert response.status_code == validity
    if validity == 201:
        assert response.data["name"] == name
        assert response.data["owner"]["username"] == data["username"]
        assert response.data["address"] == (address if address != "DNS" else "No address")
        assert response.data["number"] == (number if number != "DNS" else "No number")
        assert response.data["about"] == (about if about != "DNS" else "No about")
        assert response.data["slug"] == name
        assert "id" and "avatar" in response.data


@pytest.mark.parametrize(
    "name, email, about, number, address, avatar, validity",
    [
        ("google", "google@gmail.com", "for selling", "+90334343343", "USA. NY. 334 Street", "", 200),
        (
            "updategoogle",
            "updategoogle@gmail.com",
            "update for selling",
            "+903343433431",
            "update USA. NY. 334 Street",
            "",
            200,
        ),
        (
            "DNS",
            "updategoogle@gmail.com",
            "update for selling",
            "+903343433431",
            "update USA. NY. 334 Street",
            "",
            200,
        ),
        ("updategoogle", "DNS", "update for selling", "+903343433431", "update USA. NY. 334 Street", "", 200),
        ("updategoogle", "updategoogle@gmail.com", "DNS", "+903343433431", "update USA. NY. 334 Street", "", 200),
        ("updategoogle", "updategoogle@gmail.com", "update for selling", "DNS", "update USA. NY. 334 Street", "", 200),
        ("updategoogle", "updategoogle@gmail.com", "update for selling", "+903343433431", "DNS", "", 200),
    ],
)
@pytest.mark.django_db
def test_update_company(name: str, email: str, about: str, number: str, address: str, avatar: str, validity: int):
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

    company_data = {
        "name": "google",
        "email": "google@gmail.com",
        "about": "for selling",
        "number": "+90334343343",
        "address": "USA. NY. 334 Street",
        "avatar": "",
    }
    create_company_response = client.post("/company/", data=company_data)
    update_company_data = {
        "avatar": avatar,
    }
    if about != "DNS":
        update_company_data["about"] = about
    if number != "DNS":
        update_company_data["number"] = number
    if address != "DNS":
        update_company_data["address"] = address
    if name != "DNS":
        update_company_data["name"] = name
    if email != "DNS":
        update_company_data["email"] = email

    response = client.put(f"/company/{create_company_response.data['slug']}/", data=update_company_data)
    assert response.status_code == validity
    if validity == 200:
        assert response.data["owner"]["username"] == data["username"]
        assert response.data["address"] == (address if address != "DNS" else company_data["address"])
        assert response.data["number"] == (number if number != "DNS" else company_data["number"])
        assert response.data["about"] == (about if about != "DNS" else company_data["about"])
        assert response.data["name"] == (name if name != "DNS" else company_data["name"])
        assert response.data["email"] == (email if email != "DNS" else company_data["email"])
        assert response.data["slug"] == create_company_response.data["slug"]
        assert "id" and "avatar" in response.data


@pytest.mark.parametrize(
    "slug, validity",
    [
        ("google", 200),
        ("wrongslug", 404),
    ],
)
@pytest.mark.django_db
def test_get_company(slug: str, validity: int):
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

    company_data = {
        "name": "google",
        "email": "google@gmail.com",
        "about": "for selling",
        "number": "+90334343343",
        "address": "USA. NY. 334 Street",
        "avatar": "",
    }
    client.post("/company/", data=company_data)
    response = client.get(f"/company/{slug}/")
    assert response.status_code == validity
    if validity == 200:
        assert response.data["name"] == company_data["name"]
        assert response.data["owner"]["username"] == data["username"]
        assert response.data["address"] == company_data["address"]
        assert "id" and "avatar" in response.data


@pytest.mark.django_db
def test_list_company():
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

    company_data = {
        "name": "google",
        "email": "google@gmail.com",
        "about": "for selling",
        "number": "+90334343343",
        "address": "USA. NY. 334 Street",
        "avatar": "",
    }
    client.post("/company/", data=company_data)
    client.post("/company/", data=company_data)
    client.post("/company/", data=company_data)
    response = client.get("/company/")
    assert response.status_code == 200
    assert len(response.data) == 3


@pytest.mark.parametrize(
    "slug, validity",
    [
        ("google", 200),
        ("wrongslug", 404),
    ],
)
@pytest.mark.django_db
def test_delete_company(slug: str, validity: int):
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

    company_data = {
        "name": "google",
        "email": "google@gmail.com",
        "about": "for selling",
        "number": "+90334343343",
        "address": "USA. NY. 334 Street",
        "avatar": "",
    }
    client.post("/company/", data=company_data)
    response = client.delete(f"/company/{slug}/")
    assert response.status_code == validity


@pytest.mark.django_db
def test_selectbarlist_company():
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

    company_data = {
        "name": "google",
        "email": "google@gmail.com",
        "about": "for selling",
        "number": "+90334343343",
        "address": "USA. NY. 334 Street",
        "avatar": "",
    }
    client.post("/company/", data=company_data)
    client.post("/company/", data=company_data)
    client.post("/company/", data=company_data)
    response = client.get("/company/")
    assert response.status_code == 200
    assert len(response.data) == 3
    assert "name", "slug" in response.data[1]
