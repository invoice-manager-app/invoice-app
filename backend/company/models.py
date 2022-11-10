from account.models import Account
from core.utils import unique_slug_generator
from django.db import models
from django.db.models.signals import pre_save
from django.utils.translation import gettext_lazy as _
from PIL import Image

from .utils import get_avatar_filepath, get_default_avatar

# Create your models here.

# help_text=_("format: required, max-100"),
# error_messages={
#             "name": {
#                 "max_length": _("the price must be between 0 and 999.99."),
#             },
#         },


class Company(models.Model):
    owner = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="company_account",
    )
    name = models.CharField(
        max_length=250,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("company name"),
    )
    about = models.TextField(
        default="No about",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("company information"),
    )
    email = models.EmailField(
        max_length=60,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("company email address"),
    )
    number = models.CharField(
        default="No number",
        max_length=60,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("company phone number"),
    )
    address = models.CharField(
        default="No Address",
        max_length=250,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("company address"),
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        verbose_name=_("company safe URL"),
    )
    avatar = models.ImageField(
        max_length=255,
        upload_to=get_avatar_filepath,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("company visibility"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("date company created"),
        help_text=_("format: Y-m-d H:M:S"),
    )

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.avatar:
            self.avatar = get_default_avatar()
            self.save()
        else:
            img = Image.open(self.avatar.path)

            if img.height > 500 or img.width > 500:
                output_size = (500, 500)
                img.thumbnail(output_size)
                img.save(self.avatar.path)

    def get_avatar_filename(self):
        return str(self.avatar)[str(self.avatar).index(f"avatars/{str(self.owner.pk)}/{str(self.slug)}/") :]


def slug_genrator(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance)


pre_save.connect(slug_genrator, sender=Company)
