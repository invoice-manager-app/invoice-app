from django.contrib.auth import views as auth_views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

# app_name = "account"

urlpatterns = [
    path("get_routs/", views.getRouts, name="routs"),
    path("login_token/", views.LoginTokenView.as_view(), name="login"),
    path("register/", views.registerUser, name="register"),
    path("view/", views.profileUser, name="account_view"),
    path("edit/", views.updateprofileUser, name="account_edit"),
    path("change_password/", views.ChangePasswordView.as_view(), name="change_password"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("check_email/", views.does_account_exist_view, name="check_email"),
    path("activate-account/<slug:uidb46>/<slug:token>/", views.UserActivationView.as_view(), name="activate-account"),
    path("reset-password/", views.ResetPasswordView, name="reset-password"),
    path(
        "reset-password-confirm/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(template_name="email/password_reset_new_form.html"),
        name="reset-password-confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(template_name="email/password_reset_complete.html"),
        name="password_reset_complete",
    ),
]
