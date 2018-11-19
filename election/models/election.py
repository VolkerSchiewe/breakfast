from django.conf import settings
from django.contrib.auth.models import User
from django.db import models

from election.models import Ballot, Candidate
from election.models.state import ElectionState
from election.util import generate_random_string


class Election(models.Model):
    title = models.CharField(max_length=128)
    state = models.IntegerField(default=ElectionState.NOT_ACTIVE, choices=ElectionState.choices)

    def __str__(self):
        return self.title

    @property
    def codes(self):
        return self.electionuser_set.select_related('user').values_list('user__username', flat=True)

    @property
    def votes_count(self):
        # TODO test
        if self.subelection_set.all().count() == 0:
            return 0
        if self.state == ElectionState.CLOSED:
            return sum(Candidate.objects.filter(sub_election__election=self)
                       .values_list('saved_votes', flat=True)) / self.subelection_set.count()
        return int(len(set(Ballot.objects.filter(choice__sub_election__election=self).values_list(
            'choice__sub_election', 'user'))) / len(self.subelection_set.all()))

    def candidates_sorted(self):
        # TODO improve
        result = ''
        for sub_election in self.subelection_set.all():
            if sub_election.candidate_set.exists():
                result += '{}: {}\n'.format(
                    sub_election.title,
                    ', '.join(sub_election.candidate_set.all().values_list('name', flat=True)))
        return result

    def create_users(self, number):
        blacklist = User.objects.all().values_list('username', flat=True)
        user_names = generate_random_string(4, number, blacklist)
        for name in user_names:
            user = User.objects.create_user(username=name, password=settings.PASSWORD)
            election_user = user.electionuser  # ElectionUser.objects.get(user=user)
            election_user.election = self
            election_user.save()
            user.save()
