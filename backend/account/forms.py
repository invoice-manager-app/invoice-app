from account.models import Account
from django import forms
from django.contrib.auth.forms import UserCreationForm


class RegistrationForm(UserCreationForm):

    email = forms.EmailField(max_length=254, help_text="Required. Add a valid email address.")

    class Meta:
        model = Account
        fields = (
            "email",
            "username",
            "password1",
            "password2",
        )

        # over the orjinal method for validate the email
        # you can overwrite any filed validate method by type (clean_fieldname)
        #  to return any response you want like errors

    def clean_email(self):
        email = self.cleaned_data["email"].lower()
        try:
            _ = Account.objects.exclude(pk=self.instance.pk).get(email=email)
        except Account.DoesNotExist:
            return email
        raise forms.ValidationError(f'Email "{email}" is already in use.')

    def clean_username(self):
        username = self.cleaned_data["username"]
        try:
            _ = Account.objects.exclude(pk=self.instance.pk).get(username=username)
        except Account.DoesNotExist:
            return username
        raise forms.ValidationError(f'Username "{username}" is already in use.')


# # LOGIN FORM
# class AccountAuthenticationForm(forms.ModelForm):

# 	# YOU OVERWRITE THE FIELDS THAT YOU WANT TO CUSTOMIZE IT
# 	password = forms.CharField(label='Password', widget=forms.PasswordInput)

# 	class Meta:
# 		model = Account
# 		fields = ('email', 'password')

# 	# THIS TAKE ALL FIELDS AND VALIDATE IT WITH CLEAN
# 	def clean(self):
# 		if self.is_valid():
# 			email = self.cleaned_data['email']
# 			password = self.cleaned_data['password']


# class AccountUpdateForm(forms.ModelForm):

#     class Meta:
#         model = Account
#         fields = ('username', 'email', 'profile_image', 'hide_email' )

#     def clean_email(self):
#         email = self.cleaned_data['email'].lower()
#         try:
#             account = Account.objects.exclude(pk=self.instance.pk).get(email=email)
#         except Account.DoesNotExist:
#             return email
#         raise forms.ValidationError(f'Email "{email}" is already in use.')

#     def clean_username(self):
#         username = self.cleaned_data['username']
#         try:
#             account = Account.objects.exclude(pk=self.instance.pk).get(username=username)
#         except Account.DoesNotExist:
#             return username
#         raise forms.ValidationError(f'Username "{username}" is already in use.')


#     def save(self, commit=True):
#         account = super(AccountUpdateForm, self).save(commit=False)
#         account.username = self.cleaned_data['username']
#         account.email = self.cleaned_data['email'].lower()
#         account.profile_image = self.cleaned_data['profile_image']
#         account.hide_email = self.cleaned_data['hide_email']
#         if commit:
#             account.save()
#         return account
