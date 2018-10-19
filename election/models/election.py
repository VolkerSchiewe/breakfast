from django.conf import settings
from django.contrib import auth
from django.contrib.auth.models import User
from django.db import models

from election.models import Ballot
from election.models.candidate import Candidate
from election.util import generate_random_string


class Election(models.Model):
    title = models.CharField(max_length=128)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.title + str(self.active)

    @property
    def codes(self):
        return self.electionuser_set.select_related('user').values_list('user__username', flat=True)

    # async def send_results(self):
    #     channel_layer = layers.get_channel_layer()
    #     await channel_layer.group_send('election_%s' % self.pk, {
    #         'type': 'election_result',
    #         'message': self.get_results()
    #     })

    @staticmethod
    def get_next_title():
        return str(len(Election.objects.all()) + 1) + '. Durchgang'

    def toggle_active(self):
        if len(Election.objects.filter(active=True)) >= 1 and not self.active:
            raise AttributeError('Only on active election is allowed')

        self.active = not self.active
        self.save()

    # def get_results(self):
    #     results = []
    #     for sub_election in self.subelection_set.all():
    #         sub_elections = {
    #             'title': sub_election.title,
    #             'short': sub_election.short,
    #             'votes_count': self.ballots_count(),
    #         }
    #         candidates = {}
    #         for candidate in Candidate.objects.filter(sub_election=sub_election):
    #             candidates[candidate.name] = len(Ballot.objects.filter(choice=candidate))
    #
    #         sub_elections['results'] = candidates
    #         results.append(sub_elections)
    #     return results

    def ballots_count(self):
        if self.subelection_set.all().count() == 0:
            return 0
            raise ValueError('Election {} has no SubElections'.format(self))
        return int(len(set(Ballot.objects.filter(choice__sub_election__election=self).values_list(
            'choice__sub_election', 'user'))) / len(self.subelection_set.all()))

    def get_sub_elections_with_candidates(self):
        elections = []
        for sub_election in self.subelection_set.all():
            candidates = Candidate.objects.filter(sub_election=sub_election)
            if candidates:
                elections.append(candidates)
        return elections

    # def clone(self):
    #     election = Election()
    #     election.title = Election.get_next_title()
    #     election.save()
    #     for sub_election in self.subelection_set.all():
    #         new_sub_election = SubElection()
    #         new_sub_election.title = sub_election.title
    #         new_sub_election.election = election
    #         new_sub_election.save()
    #         for candidate in sub_election.candidate_set.all():
    #             new_candidate = Candidate()
    #             new_candidate.name = candidate.name
    #             new_candidate.image = candidate.image
    #             new_candidate.sub_election = new_sub_election
    #             new_candidate.save()
    #
    #     election.create_users(self.electionuser_set.all().count())

    def candidates_sorted(self):
        result = ''
        for sub_election in self.subelection_set.all():
            result += '<b>{}</b>: {}; '.format(
                sub_election.title,
                ', '.join(sub_election.candidate_set.all().values_list('name', flat=True)))
        return result

    def sub_election_sorted(self):
        return ', '.join(self.subelection_set.all().values_list('title', flat=True))

    def create_users(self, number):
        i = 0
        while i < number:
            username = generate_random_string(4)
            user = auth.authenticate(username=username, password=settings.PASSWORD)
            if user is None:
                user = User.objects.create_user(username=username, password=settings.PASSWORD)
                election_user = user.electionuser  # ElectionUser.objects.get(user=user)
                election_user.election = self
                election_user.save()
                user.save()
                i += 1

    def get_plain_codes(self):
        self.electionuser_set.all().values_list('user__username', flat=True)
        return '</br>'.join(self.electionuser_set.all().values_list('user__username', flat=True))
