from account.models import Account
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .utils import decode_uid


class LoginTokenObtainSerializer(TokenObtainPairSerializer):
    # to add the fields inside the access token and hash it
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims

        # token['username'] = user.username

        # Add more custom fields from your custom user model, If you have a
        # custom user model.
        # ...
        return token

    def validate(self, account):
        # context = {}
        email = account["email"].lower()
        password = account["password"]

        account_exists = Account.objects.filter(email=email).exists()
        if account_exists:
            user = authenticate(email=email, password=password)
            if user:
                if user.is_active:
                    data = super().validate(account)
                    return data
                else:
                    raise AuthenticationFailed("The Account Is not Acitve, We sent an activation link to your email!.")
            else:
                raise AuthenticationFailed("The Password Is Incorect.")
        else:
            raise AuthenticationFailed("Invalid credentials, Email or Password is Incorect")


# class RegisterationSerilizers(serializers.ModelSerializer):

#     password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

#     class Meta:
#         model = Account
#         fields = ["username", "email", "password", "password2"]
#         extra_kwargs = {"password": {"write_only": True}}

#     def save(self):
#         account = Account(username=self.validated_data["username"], email=self.validated_data["email"].lower())
#         password = self.validated_data["password"]
#         password2 = self.validated_data["password2"]

#         if password != password2:
#             raise serializers.ValidationError({"password": "password must be mutch"})

#         account.set_password(password)
#         account.save()
#         return account
# HINDO
class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, label="Email Address")
    username = serializers.CharField(required=True, max_length=200)
    password = serializers.CharField(required=True, label="Password", style={"input_type": "password"})
    confirm_password = serializers.CharField(
        required=True,
        label="Confirm Password",
        style={"input_type": "password"},
    )

    def validate_confirm_password(self, value):
        data = self.get_initial()
        password = data.get("password")
        if password != value:
            raise serializers.ValidationError("Passwords doesn't match.")
        return value

    def validate_email(self, value):
        if Account.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_username(self, value):
        if Account.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password should be atleast 8 characters long.")
        return value

    def save(self):
        username = self.validated_data["username"]
        email = self.validated_data["email"].lower()
        password = self.validated_data["password"]
        account = Account(
            username=username,
            email=email,
        )
        account.set_password(password)
        account.is_active = False
        account.save()
        return account


class AccountProfileSerilizers(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "pk",
            "email",
            "username",
            "hide_email",
            "first_name",
            "last_name",
        ]


class UpdateAccountProfileSerilizers(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "email",
            "username",
            "hide_email",
            "first_name",
            "last_name",
        ]

    def validate_email(self, value):
        if Account.objects.exclude(pk=self.instance.pk).filter(email=value.lower()).exists():
            raise serializers.ValidationError({"response": "account with this email already exists."})
        return value

    def validate_username(self, value):
        if Account.objects.exclude(pk=self.instance.pk).filter(username=value).exists():
            raise serializers.ValidationError({"response": "account with this or username already exists."})
        return value

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email).lower()
        instance.username = validated_data.get("username", instance.username)
        instance.hide_email = validated_data.get("hide_email", instance.hide_email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=False,
        allow_blank=True,
        write_only=True,
        label="Email Address",
    )
    username = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
    )

    def validate(self, data):
        email = data.get("email", None)
        username = data.get("username", None)

        if not email and not username:
            raise serializers.ValidationError("Please enter username or email to reset your password.")

        user = (
            Account.objects.filter(Q(email=email) | Q(username=username))
            .exclude(email__isnull=True)
            .exclude(email__iexact="")
            .distinct()
        )

        if user.exists() and user.count() == 1:
            user_obj = user.first()
        else:
            raise serializers.ValidationError("we can't find any accout with this email or username")

        if user_obj.is_active:
            data["user"] = user_obj
        else:
            raise serializers.ValidationError("User not active.")
        return data


class UserActivationSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        # check the user for this uid is available or not in DB
        try:
            uid = decode_uid(self.initial_data.get("uid", ""))
            user = Account.objects.get(pk=uid)
        except (Account.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError("we can't find any user with this token-uid")

        if user is not None:
            # if user.is_active and user.email_verified:
            #     raise serializers.ValidationError("account is active")
            is_token_valid = default_token_generator.check_token(user, validated_data["token"])

        if is_token_valid:
            return user
        else:
            raise serializers.ValidationError("activation token is not valid or your link is expired! request new one")


# --> checkUsername serializer
class CheckAccountSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=50)

    def validate_email(self, value):
        is_exists = False
        if Account.objects.filter(email=value).exists():
            is_exists = True
        return is_exists
