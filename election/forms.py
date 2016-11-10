from django import forms


class LoginForm(forms.Form):
    code = forms.CharField(label="Dein Code", max_length=4,)
