import json

from PIL import Image as PILImage
from channels import Group
from django.conf import settings
from django.contrib import auth
from django.contrib.auth.models import User
from django.db import models, transaction
from django.db.models.signals import post_save

from election.util import generate_random_string, normalize_string


class Image(models.Model):
    name = models.CharField(max_length=128)
    file = models.ImageField(upload_to='uploads/')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super(Image, self).save(*args, **kwargs)
        if self.file:
            image = PILImage.open(self.file)
            width = 160
            ratio = (width / float(image.size[0]))
            height = int((float(image.size[1]) * float(ratio)))
            image = image.resize((width, height), PILImage.ANTIALIAS)
            image.save(self.file.path)


class Election(models.Model):
    title = models.CharField(max_length=128)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    @property
    def websocket_group(self):
        return Group("election-%s" % self.id)

    def send_results(self, msg_type=0):
        message = {'message': self.get_results(), 'msg_type': msg_type}
        self.websocket_group.send(
            {"text": json.dumps(message)}
        )

    @staticmethod
    def get_next_title():
        return str(len(Election.objects.all()) + 1) + '. Durchgang'

    def toggle_active(self):
        if len(Election.objects.filter(active=True)) >= 1 and not self.active:
            raise AttributeError('Only on active election is allowed')

        self.active = not self.active
        self.save()

    def get_results(self):
        results = []
        for sub_election in self.subelection_set.all():
            sub_elections = {
                'title': sub_election.title,
                'short': sub_election.short,
                'votes_count': self.ballots_count(),
            }
            candidates = {}
            for candidate in Candidate.objects.filter(sub_election=sub_election):
                candidates[candidate.name] = len(Ballot.objects.filter(choice=candidate))

            sub_elections['results'] = candidates
            results.append(sub_elections)
        return results

    def ballots_count(self):
        if self.subelection_set.all().count() == 0:
            raise ValueError('Election {} has no SubElections'.format(self))
        return int(len(set(Ballot.objects.filter(choice__sub_election__election=self).values_list(
            'choice__sub_election', 'user'))) / len(self.subelection_set.all()))

    def get_sub_elections_with_candidates(self):
        elections = []
        for sub_election in SubElection.objects.filter(election=self):
            candidates = Candidate.objects.filter(sub_election=sub_election)
            if candidates:
                elections.append(candidates)
        return elections

    def clone(self):
        election = Election()
        election.title = Election.get_next_title()
        election.save()
        for sub_election in self.subelection_set.all():
            new_sub_election = SubElection()
            new_sub_election.title = sub_election.title
            new_sub_election.election = election
            new_sub_election.save()
            for candidate in sub_election.candidate_set.all():
                new_candidate = Candidate()
                new_candidate.name = candidate.name
                new_candidate.image = candidate.image
                new_candidate.sub_election = new_sub_election
                new_candidate.save()

        election.create_users(self.electionuser_set.all().count())

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
                election_user = ElectionUser.objects.get(user=user)
                election_user.election = self
                election_user.save()
                user.save()
                i += 1

    def get_plain_codes(self):
        self.electionuser_set.all().values_list('user__username', flat=True)
        return '</br>'.join(self.electionuser_set.all().values_list('user__username', flat=True))


class ElectionUser(models.Model):
    user = models.OneToOneField(User)
    election = models.ForeignKey(Election, null=True, blank=True)

    def __str__(self):
        return '{} - {}'.format(self.user.username, self.election)

    @transaction.atomic
    def select_candidate(self, candidate):
        sub_elections_in_ballots = Ballot.objects.filter(user=self).values_list('choice__sub_election', flat=True)
        if candidate.sub_election.pk in sub_elections_in_ballots:
            print(
                '----> ERROR: Ballot for sub_election {} already exists. User: {}'.format(candidate.sub_election, self))
            raise ValueError('Es existiert schon eine Stimme für diese Wahl. Bitte melde Dich beim Wahlausschuss')
        ballot, created = Ballot.objects.get_or_create(user=self, choice=candidate)
        if not created:
            print('----> ERROR: Ballot already exits. Candidate: {}, User: {}'.format(candidate, self))
            raise ValueError('Deine Stimme existierte bereits. Bitte melde Dich beim Wahlausschuss!')

    @transaction.atomic
    def select_candidates(self, candidates):
        for candidate in candidates:
            ballot, created = Ballot.objects.get_or_create(user=self, choice=candidate)
            if not created:
                print('----> ERROR: Ballot already exits. Candidate: {}, User: {}'.format(candidate, self))
                raise ValueError('Deine Stimme existierte bereits. Bitte melde Dich beim Wahlausschuss!')

    def already_elected(self):
        ballots = len(Ballot.objects.filter(user=self))
        sub_elections = len(SubElection.objects.filter(election=self.election))
        if ballots > sub_elections:
            raise Exception('Etwas ist schief gelaufen. Bitte melde Dich beim Wahlausschuss!')
        else:
            return ballots == sub_elections


def create_election_user(sender, **kwargs):
    user = kwargs["instance"]
    if kwargs["created"]:
        ElectionUser.objects.get_or_create(user=user)


post_save.connect(create_election_user, sender=User)


class SubElection(models.Model):
    election = models.ForeignKey(Election)
    title = models.CharField(max_length=100)
    is_multi_selectable = models.BooleanField(default=False)

    class Meta:
        ordering = ['title']

    @property
    def short(self):
        return normalize_string(self.title)

    def __str__(self):
        return '{} - {}'.format(self.title, self.election)


class Candidate(models.Model):
    sub_election = models.ForeignKey(SubElection, on_delete=models.CASCADE, default=0)
    name = models.CharField(max_length=250)
    image = models.ForeignKey(Image, blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return str(self.sub_election) + ' - ' + str(self.name)

    def edit(self, name=None, image=None, set_default_image=False):
        if name:
            self.name = name
        if image:
            self.image = image
        if set_default_image:
            self.image = None
        self.save()


class Ballot(models.Model):
    user = models.ForeignKey(ElectionUser)
    choice = models.ForeignKey(Candidate, on_delete=models.CASCADE, default=0)

    def __str__(self):
        return self.user.user.username
