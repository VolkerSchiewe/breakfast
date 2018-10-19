from django.db import models

from election.models.election import Election
from election.util import normalize_string


class SubElection(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_multi_selectable = models.BooleanField(default=False)

    class Meta:
        ordering = ['title']

    @property
    def short(self):
        return normalize_string(self.title)

    def __str__(self):
        return '{} - {}'.format(self.title, self.election)
