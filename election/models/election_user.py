import logging

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.translation import ugettext as _

from election.models.ballot import Ballot
from election.models.sub_election import SubElection

log = logging.getLogger(__name__)


class ElectionUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    election = models.ForeignKey('Election', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return '{} - {}'.format(self.user.username, self.election)

    def already_elected(self):
        ballots = len(Ballot.objects.filter(user=self))
        sub_elections = len(SubElection.objects.filter(election=self.election))
        if ballots > sub_elections:
            raise Exception(_('Something went wrong. Please contact the committee!'))
        else:
            return ballots == sub_elections if sub_elections != 0 else False


@receiver(post_save, sender=User)
def create_election_user(sender, instance: User, created, **kwargs):
    if created:
        ElectionUser.objects.get_or_create(user=instance)


@receiver(post_delete, sender=ElectionUser)
def delete_users(sender, instance: ElectionUser, **kwargs):
    instance.user.delete()
