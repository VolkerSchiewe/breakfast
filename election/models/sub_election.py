from django.db import models

from election.models.election import Election


class SubElection(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_multi_selectable = models.BooleanField(default=False)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return '{} - {}'.format(self.title, self.election)
