from account.serializers import AccountProfileSerilizers
from company.models import Company
from rest_framework import serializers


# from account.serializers import AccountProfileSerilizers
class CompanyReadSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField("validate_avatar_url")
    # author = AccountProfileSerilizers(read_only=True)
    owner = AccountProfileSerilizers()

    class Meta:
        model = Company
        fields = ["id", "owner", "name", "about", "email", "number", "address", "slug", "avatar"]

    def validate_avatar_url(self, company):
        request = self.context["request"]
        avatar = company.avatar.url
        return request.build_absolute_uri(avatar)


class CompanyWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["name", "about", "email", "number", "address", "avatar"]
        # read_only_fields = ['id','slug','creatd_at','updated_at']

    def validate_name(self, value):
        if len(value) <= 1:
            raise serializers.ValidationError("name must be more than 2 letters")
        return value

    # def validate_avatar(self, value):
    #     if value is None:
    #         return get_default_avatar()
    #     return value

    def create(self, validated_data):
        try:
            company = Company.objects.create(
                owner=validated_data["owner"],
                name=validated_data["name"],
                email=validated_data["email"],
                about=validated_data.get("about", "No about"),
                number=validated_data.get("number", "No number"),
                address=validated_data.get("address", "No address"),
                # avatar=validated_data.get("avatar", "images/default/default.jpg"),
                avatar=validated_data["avatar"],
            )
        except serializers.ValidationError:
            raise serializers.ValidationError("Invalid data")

        return company

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.about = validated_data.get("about", instance.about)
        instance.email = validated_data.get("email", instance.email)
        instance.number = validated_data.get("number", instance.number)
        instance.address = validated_data.get("address", instance.address)
        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.save()
        return instance
