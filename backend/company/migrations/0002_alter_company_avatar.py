# Generated by Django 4.0 on 2022-11-10 14:21

import company.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("company", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="company",
            name="avatar",
            field=models.ImageField(
                blank=True,
                default=company.models.get_default_avatar,
                max_length=255,
                null=True,
                upload_to=company.models.get_avatar_filepath,
            ),
        ),
    ]