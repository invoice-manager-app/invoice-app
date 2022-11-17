import decimal
import uuid
from datetime import timedelta

from apps.account.models import Account
from apps.company.models import Company
from django.db import models
from django.db.models import Sum
from django.utils.translation import gettext_lazy as _


class Invoice(models.Model):
    PAID = "paid"
    PENDING = "pending"

    CHOICES_TYPE = ((PAID, "paid"), (PENDING, "pending"))

    invoice_code = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        verbose_name="Invoice Code/Id",
        help_text=_("Automaticlly generated"),
    )
    client_name = models.CharField(
        max_length=250,
        null=False,
        blank=False,
        verbose_name=_("Client Name"),
    )
    client_email = models.EmailField(
        max_length=250,
        null=False,
        blank=False,
        verbose_name="Client Email Address",
        help_text=_("Must be work"),
    )
    client_number = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Client Phone Number"),
    )
    client_address = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        verbose_name=_("Client Full Adress"),
    )
    client_zipcode = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Client Adress's Zipcode"),
    )
    client_city = models.CharField(
        max_length=50,
        null=False,
        blank=False,
        verbose_name=_("Client City"),
    )
    client_country = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        verbose_name=_("Client Country"),
    )
    due_after = models.IntegerField(
        default=10,
        null=False,
        blank=False,
        verbose_name=_("Due after"),
        help_text=_("shouold be integer"),
    )
    email_is_sent = models.BooleanField(
        default=False,
        verbose_name=_("Email Is sent"),
    )
    status = models.CharField(max_length=20, choices=CHOICES_TYPE, default=PENDING, verbose_name=_("Invoice Status"))
    discount_amount = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        null=True,
        blank=True,
        verbose_name=_("Discount amount"),
    )
    description = models.TextField(null=True, blank=True, default="No description")
    created_by = models.ForeignKey(
        Account,
        related_name="created_invoices",
        on_delete=models.PROTECT,
        verbose_name=_("Created By"),
    )
    modified_by = models.ForeignKey(
        Account,
        related_name="modified_invoices",
        on_delete=models.PROTECT,
        verbose_name=_("Modified by"),
    )
    company = models.ForeignKey(
        Company,
        related_name="invoices",
        on_delete=models.PROTECT,
        verbose_name=_("Issuing company"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("Created at"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated at"),
        help_text=_("format: Y-m-d H:M:S"),
    )

    class Meta:
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"
        ordering = ("-created_at",)

    def __str__(self):
        return str(self.invoice_code)

    def get_gross_amount(self):
        gross_amount_count = Item.objects.filter(invoice__pk=self.pk).aggregate(Sum("net_amount"))
        # print(gross_amount_count)
        return gross_amount_count["net_amount__sum"]

    def get_net_amount(self):
        return self.get_gross_amount() - self.discount_amount

    def get_due_date(self):
        return self.created_at + timedelta(days=self.due_after)

    def get_due_date_formatted(self):
        return self.get_due_date().strftime("%d.%m.%Y")


class Item(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        related_name="items",
        on_delete=models.CASCADE,
        verbose_name=_("Invoice"),
    )
    title = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        verbose_name=_("Item's title/name"),
    )
    quantity = models.IntegerField(
        default=1,
        null=False,
        blank=False,
        verbose_name=_("Item's quantity"),
    )
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=False,
        blank=False,
        verbose_name=_("Item's price per one"),
    )
    tax_rate = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0,
        blank=False,
        null=False,
        verbose_name=_("Tax rate"),
    )
    net_amount = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        blank=False,
        null=False,
        verbose_name=_("Total amount after taxes"),
        help_text=_("Automaticlly generated"),
    )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.tax_rate != 0:
            tax_rate_calc = decimal.Decimal(self.tax_rate / 100 * (self.unit_price * self.quantity))
            self.net_amount = (self.unit_price * self.quantity) + tax_rate_calc
        else:
            self.net_amount = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def get_gross_amount(self):
        tax_rate = decimal.Decimal(self.tax_rate / 100)
        return self.net_amount + (self.net_amount * tax_rate)
