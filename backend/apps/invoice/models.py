import decimal
import uuid
from datetime import timedelta

from apps.account.models import Account
from apps.company.models import Company
from django.db import models
from django.db.models import Sum
from django.utils.translation import gettext_lazy as _


class Invoice(models.Model):
    # INVOICE = 'invoice'
    # CREDIT_NOTE = 'credit_note'

    # CHOICES_TYPE = (
    #     (INVOICE, 'Invoice'),
    #     (CREDIT_NOTE, 'Credit note')
    # )

    invoice_code = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        verbose_name="Invoice Code/Id",
        help_text=_("Automaticlly generated"),
    )
    client_name = models.CharField(
        max_length=250,
        null=False,
        unique=False,
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
        blank=True,
        null=True,
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
        blank=True,
        null=True,
        verbose_name=_("Client City"),
    )
    client_country = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Client Country"),
    )
    # client_contact_person = models.CharField(max_length=255, blank=True, null=True)
    # client_contact_reference = models.CharField(max_length=255, blank=True, null=True)
    # sender_reference = models.CharField(max_length=255, blank=True, null=True)
    # invoice_type = models.CharField(max_length=20, choices=CHOICES_TYPE, default=INVOICE)
    due_after = models.IntegerField(
        verbose_name=_("Due after"),
        help_text=_("shouold be integer"),
    )
    # due_date = models.DateTimeField(
    #     verbose_name=_("Due Date to pay"),
    # )
    # is_credit_for = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    # is_credited = models.BooleanField(default=False)
    email_is_sent = models.BooleanField(
        default=False,
        verbose_name=_("Email Is sent"),
    )
    is_paid = models.BooleanField(
        default=False,
        verbose_name=_("Invoice Is paid"),
    )
    # bankaccount = models.CharField(max_length=266, blank=True, null=True)
    # gross_amount = models.DecimalField(
    #     max_digits=6,
    #     decimal_places=2,
    #     # default=0,
    #     blank=True,
    #     null=True,
    #     verbose_name=_("Gross amount"),
    # )
    # tax_amount = models.DecimalField(
    #     max_digits=6,
    #     decimal_places=2,
    #     verbose_name=_("Tax amount"),
    # )
    # net_amount = models.DecimalField(
    #     max_digits=6,
    #     decimal_places=2,
    #     null=True,
    #     blank=True,
    #     verbose_name=_("Total Amount after taxes"),
    #     help_text=_("Automaticlly generated"),
    # )
    discount_amount = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        null=True,
        blank=True,
        verbose_name=_("Discount amount"),
    )
    # team = models.ForeignKey(Team, related_name='invoices', on_delete=models.CASCADE)
    # client = models.ForeignKey(Client, related_name='invoices', on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True, default="no description")
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

    def save(self, *args, **kwargs):
        # gross_amount_count = Item.objects.filter(invoice__pk=self.pk).aggregate(Sum('net_amount'))
        # print(gross_amount_count)
        # self.gross_amount = gross_amount_count["net_amount__sum"]
        # if self.discount_amount != 0:
        #     self.net_amount = self.gross_amount - self.discount_amount

        # else:
        #     self.net_amount = self.gross_amount
        super().save(*args, **kwargs)

    def get_gross_amount(self):
        gross_amount_count = Item.objects.filter(invoice__pk=self.pk).aggregate(Sum("net_amount"))
        print(gross_amount_count)
        return gross_amount_count["net_amount__sum"]

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
        null=True,
        blank=True,
        verbose_name=_("Item's title/name"),
    )
    quantity = models.IntegerField(
        default=0,
        null=False,
        blank=False,
        verbose_name=_("Item's quantity"),
    )
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        verbose_name=_("Item's price per one"),
    )
    tax_rate = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0,
        blank=True,
        null=True,
        verbose_name=_("Tax rate"),
    )
    net_amount = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        blank=True,
        null=True,
        verbose_name=_("Total amount after taxes"),
        help_text=_("Automaticlly generated"),
    )
    # discount = models.IntegerField(
    #     default=0,
    #     verbose_name=_("Discount"),
    # )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # old_net_amount = self.net_amount
        if self.tax_rate != 0:
            tax_rate_calc = decimal.Decimal(self.tax_rate / 100 * (self.unit_price * self.quantity))
            self.net_amount = (self.unit_price * self.quantity) + tax_rate_calc
        else:
            self.net_amount = self.unit_price * self.quantity
        super().save(*args, **kwargs)
        # invoice = Invoice.objects.get(invoice_code=self.invoice__invoice_code)
        # if old_net_amount > self.net_amount:
        #     invoice.update(gross_amount=F('gross_amount') - (old_net_amount - self.net_amount))
        # else:
        #     invoice.update(gross_amount=F('gross_amount') - (self.net_amount - old_net_amount))
        # invoice.save()

        # gross_amount_count = Item.objects.filter(invoice__pk=self.pk).aggregate(Sum('net_amount'))
        # print(gross_amount_count)
        # self.gross_amount = gross_amount_count["net_amount__sum"]

    def get_gross_amount(self):
        tax_rate = decimal.Decimal(self.tax_rate / 100)
        return self.net_amount + (self.net_amount * tax_rate)