from django.utils.translation import ugettext_lazy as _
from djchoices import DjangoChoices, ChoiceItem


class ElectionState(DjangoChoices):
    NOT_ACTIVE = ChoiceItem(1, _("not active"))
    ACTIVE = ChoiceItem(2, _("active"))
    CLOSED = ChoiceItem(3, _("closed"))
