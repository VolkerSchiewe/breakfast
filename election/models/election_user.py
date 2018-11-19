import logging

from django.contrib.auth.models import User
from django.db import models, transaction
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from election.models.ballot import Ballot
from election.models.sub_election import SubElection

log = logging.getLogger(__name__)


class ElectionUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    election = models.ForeignKey('Election', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return '{} - {}'.format(self.user.username, self.election)

    @transaction.atomic
    def select_candidate(self, candidate):
        sub_elections_in_ballots = Ballot.objects.filter(user=self).values_list('choice__sub_election', flat=True)
        if candidate.sub_election.pk in sub_elections_in_ballots:
            log.error(
                '----> ERROR: Ballot for sub_election {} already exists. User: {}'.format(candidate.sub_election, self))
            raise ValueError('Es existiert schon eine Stimme für diese Wahl. Bitte melde Dich beim Wahlausschuss')
        ballot, created = Ballot.objects.get_or_create(user=self, choice=candidate)
        if not created:
            log.error('----> ERROR: Ballot already exits. Candidate: {}, User: {}'.format(candidate, self))
            raise ValueError('Deine Stimme existierte bereits. Bitte melde Dich beim Wahlausschuss!')

    @transaction.atomic
    def select_candidates(self, candidates):
        for candidate in candidates:
            ballot, created = Ballot.objects.get_or_create(user=self, choice=candidate)
            if not created:
                log.error('----> ERROR: Ballot already exits. Candidate: {}, User: {}'.format(candidate, self))
                raise ValueError('Deine Stimme existierte bereits. Bitte melde Dich beim Wahlausschuss!')

    def already_elected(self):
        ballots = len(Ballot.objects.filter(user=self))
        sub_elections = len(SubElection.objects.filter(election=self.election))
        if ballots > sub_elections:
            raise Exception('Etwas ist schief gelaufen. Bitte melde Dich beim Wahlausschuss!')
        else:
            return ballots == sub_elections


@receiver(post_save, sender=User)
def create_election_user(sender, instance: User, created, **kwargs):
    if created:
        ElectionUser.objects.get_or_create(user=instance)


@receiver(post_delete, sender=ElectionUser)
def delete_users(sender, instance: ElectionUser, **kwargs):
    instance.user.delete()
