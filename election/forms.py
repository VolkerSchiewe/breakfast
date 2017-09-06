from django import forms
from django.conf import settings
from django.contrib import auth
from django.core.exceptions import ValidationError


class LoginForm(forms.Form):
    username = forms.CharField(label='Dein Code', max_length=6,
                               widget=forms.TextInput(
                                   attrs={'placeholder': '', 'autocomplete': 'off', 'autofocus': ''}))

    def clean_username(self):

        username = self.cleaned_data.get('username')
        user = auth.authenticate(username=username, password=settings.PASSWORD)

        if user is not None:
            return username
        else:
            raise ValidationError('Falscher Code')


class CreateElectionForm(forms.Form):
    user_number = forms.IntegerField(label='Anzahl der Wahlberechtigten')


class CreateSubElectionForm(forms.Form):
    title = forms.CharField(label='Titel', widget=forms.TextInput(attrs={'placeholder': ''}))
    short = forms.CharField(label='Kurzform', max_length=6, widget=forms.TextInput(attrs={'placeholder': ''}))
    candidates = forms.CharField(label='Kandidaten',
                                 widget=forms.TextInput(attrs={'placeholder': '(durch Komma trennen)'}))
