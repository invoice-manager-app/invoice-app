# Generated by Django 4.0 on 2022-11-14 13:54

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Account",
            fields=[
                ("password", models.CharField(max_length=128, verbose_name="password")),
                ("last_login", models.DateTimeField(blank=True, null=True, verbose_name="last login")),
                ("id", models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ("email", models.EmailField(max_length=60, unique=True, verbose_name="email address")),
                ("username", models.CharField(max_length=30, unique=True)),
                ("first_name", models.CharField(blank=True, max_length=150)),
                ("last_name", models.CharField(blank=True, max_length=30)),
                ("date_joined", models.DateTimeField(auto_now_add=True, verbose_name="date joined")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="last update")),
                ("is_active", models.BooleanField(default=False)),
                ("email_verified", models.BooleanField(default=False)),
                ("is_admin", models.BooleanField(default=False)),
                ("is_staff", models.BooleanField(default=False)),
                ("is_superuser", models.BooleanField(default=False)),
                ("hide_email", models.BooleanField(default=True)),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "Accounts",
                "verbose_name_plural": "Accounts",
            },
        ),
    ]
