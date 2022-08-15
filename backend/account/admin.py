from account.forms import RegistrationForm
from account.models import Account
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken


class AccountAdmin(UserAdmin):
    list_display = ("email", "username", "date_joined", "last_login", "is_admin", "is_staff", "is_active")
    search_fields = (
        "email",
        "username",
    )
    readonly_fields = ("id", "updated_at", "date_joined", "last_login")

    ordering = ("-date_joined",)

    filter_horizontal = ()
    list_filter = (
        "email",
        "username",
        "is_admin",
        "is_staff",
    )

    fieldsets = (
        (None, {"fields": ("email", "username")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_admin",
                    "is_staff",
                    "is_superuser",
                    "is_active",
                    "email_verified",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Personal", {"fields": ("hide_email", "updated_at", "date_joined", "last_login")}),
    )

    # formfield_overrides = {
    # 	Account.email : {'widget' : Textarea(attrs={'rows':10, 'cols':40})}
    # }

    add_fieldsets = (
        (None, {"fields": ("email", "username", "password1", "password2")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_admin",
                    "is_staff",
                    "is_superuser",
                    "is_active",
                    "email_verified",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Personal", {"fields": ("hide_email",)}),
    )

    add_form = RegistrationForm


# THIS IS FOR CHANGE THE FORM IN ADMIN PANEL HERE WE ADD A EMAIL FIELD IN THE FORM IN IT
admin.site.register(Account, AccountAdmin)


class CustomOutstandingTokenAdmin(OutstandingTokenAdmin):
    def has_delete_permission(self, *args, **kwargs):
        return True


admin.site.unregister(OutstandingToken)
admin.site.register(OutstandingToken, CustomOutstandingTokenAdmin)
