from apps.company.models import Company
from apps.company.serializers import CompanyReadSerializer
from rest_framework import serializers

from .models import Invoice, Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        read_only_fields = ("id",)
        fields = (
            "id",
            "title",
            "quantity",
            "unit_price",
            "tax_rate",
            "net_amount",
        )


class InvoiceCompanySerializer(CompanyReadSerializer, serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            "name",
            "about",
            "email",
            "number",
            "address",
            "slug",
            "avatar",
        )
        read_only_fields = fields


class InvoiceWriteSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True)
    company = serializers.SlugRelatedField(slug_field="slug", queryset=Company.objects.all())

    class Meta:
        model = Invoice
        read_only_fields = (
            "invoice_code",
            "created_at",
            "created_by",
            "updated_at",
            "modified_by",
        )
        fields = (
            "company",
            "client_name",
            "client_email",
            "client_number",
            "client_address",
            "client_zipcode",
            "client_country",
            "client_city",
            "due_after",
            "email_is_sent",
            "status",
            "description",
            "discount_amount",
            "items",
            "get_due_date_formatted",
        )

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        invoice = Invoice.objects.create(**validated_data)
        for item in items_data:
            Item.objects.create(invoice=invoice, **item)
        return invoice

    def update(self, instance, validated_data):
        instance.client_name = validated_data.get("client_name", instance.client_name)
        instance.client_email = validated_data.get("client_email", instance.client_email)
        instance.client_number = validated_data.get("client_number", instance.client_number)
        instance.client_address = validated_data.get("client_address", instance.client_address)
        instance.client_zipcode = validated_data.get("client_zipcode", instance.client_zipcode)

        instance.client_country = validated_data.get("client_country", instance.client_country)
        instance.client_city = validated_data.get("client_city", instance.client_city)
        instance.due_after = validated_data.get("due_after", instance.due_after)
        instance.email_is_sent = validated_data.get("email_is_sent", instance.email_is_sent)
        instance.status = validated_data.get("status", instance.status)
        instance.description = validated_data.get("description", instance.description)
        instance.discount_amount = validated_data.get("discount_amount", instance.discount_amount)
        instance.save()
        items_data = self.context["items"]
        if items_data:
            for item in items_data:
                item_id = item.get("id", None)
                if item_id:
                    item_obj = Item.objects.get(id=item_id)
                    delete_order = item.get("delete", False)
                    if delete_order:
                        item_obj.delete()
                    else:
                        item_obj.title = item.get("title", item_obj.title)
                        item_obj.quantity = item.get("quantity", item_obj.quantity)
                        item_obj.unit_price = item.get("unit_price", item_obj.unit_price)
                        item_obj.tax_rate = item.get("tax_rate", item_obj.tax_rate)
                        item_obj.net_amount = item.get("net_amount", item_obj.net_amount)
                        item_obj.save()
                else:
                    Item.objects.create(invoice=instance, **item)
        return instance


class InvoiceRedSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True)
    company = InvoiceCompanySerializer()
    # net_amount = serializers.SerializerMethodField("get_net_amount")
    created_by = serializers.SerializerMethodField("get_created_by_username")
    modified_by = serializers.SerializerMethodField("get_modified_by_username")
    created_at = serializers.SerializerMethodField("get_created_at_date_formatted")
    updated_at = serializers.SerializerMethodField("get_updated_at_date_formatted")

    class Meta:
        model = Invoice
        fields = (
            "invoice_code",
            "company",
            "client_name",
            "client_email",
            "client_number",
            "client_address",
            "client_zipcode",
            "client_country",
            "client_city",
            "due_after",
            "get_due_date_formatted",
            "items",
            "get_gross_amount",
            "discount_amount",
            "get_net_amount",
            "email_is_sent",
            "status",
            "description",
            "created_by",
            "modified_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields

    def get_created_by_username(self, invoice):
        return invoice.created_by.username

    def get_modified_by_username(self, invoice):
        return invoice.modified_by.username

    def get_created_at_date_formatted(self, invoice):
        return invoice.created_at.strftime("%d.%m.%Y")

    def get_updated_at_date_formatted(self, invoice):
        return invoice.updated_at.strftime("%d.%m.%Y")

    # def get_net_amount(self, invoice):
    #     return invoice.get_gross_amount() - invoice.discount_amount


class InvoiceListSerializer(InvoiceRedSerializer, serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = (
            "invoice_code",
            "client_name",
            "created_at",
            "get_due_date_formatted",
            "net_amount",
            "status",
            "items",
        )
        read_only_fields = fields
