from django import forms
from django.conf import settings
from django.contrib import auth
from django.core.exceptions import ValidationError

from election.models import Election


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


class ElectionModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.name


class ElectionModelMultipleChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return obj.name


class ElectionForm(forms.Form):
    def __init__(self, election: Election, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for sub_election in election.subelection_set.all():
            if not sub_election.is_multi_selectable:
                self.fields[sub_election.short] = ElectionModelChoiceField(queryset=sub_election.candidate_set.all(),
                                                                           widget=forms.RadioSelect(),
                                                                           label=sub_election.title, empty_label=None,
                                                                           to_field_name='pk', required=False)
            else:
                self.fields[sub_election.short] = ElectionModelMultipleChoiceField(
                    queryset=sub_election.candidate_set.all(),
                    widget=forms.CheckboxSelectMultiple(),
                    label=sub_election.title, to_field_name='pk', required=False)

    def clean(self):
        for field in self:
            if not self.cleaned_data.get(field.name):
                self.add_error(field.name, 'Nicht vergessen zu wählen!')


class CreateElectionForm(forms.Form):
    user_number = forms.IntegerField(label='Anzahl der Wahlberechtigten')


class CreateSubElectionForm(forms.Form):
    def __init__(self, prefix='pre-0', *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.prefix = prefix

    title = forms.CharField(label='Titel', widget=forms.TextInput(attrs={'placeholder': ''}))
    short = forms.CharField(label='Kurzform', max_length=6, widget=forms.TextInput(attrs={'placeholder': ''}))
    candidates = forms.CharField(label='Kandidaten',
                                 widget=forms.TextInput(attrs={'placeholder': '(durch Komma trennen)'}))
