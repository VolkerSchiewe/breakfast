from django.contrib.auth.models import User
from django.test import TestCase

from election.models import Election, SubElection, Candidate, Ballot, ElectionUser


def create_election(title='election', active=False):
    return Election.objects.get_or_create(title=title, active=active)[0]


def create_sub_election_with_candidates():
    election = create_election()
    sub_election = SubElection.objects.create(election=election, title='SubElection', short='s')
    candidate_1 = Candidate.objects.create(sub_election=sub_election, name='John Doe')
    candidate_2 = Candidate.objects.create(sub_election=sub_election, name='James Smith')
    return sub_election, candidate_1, candidate_2


def create_election_users():
    election = create_election()
    user = User.objects.create_user(username='TestUser', password='TestPassword')
    election_user = ElectionUser.objects.get_or_create(user=user)[0]
    election_user.election = election
    election_user.save()
    return election_user


def create_ballots():
    election_user = create_election_users()
    sub_election, candidate_1, candidate_2 = create_sub_election_with_candidates()
    ballot_1 = Ballot.objects.create(user=election_user, choice=candidate_1)
    ballot_2 = Ballot.objects.create(user=election_user, choice=candidate_2)
    return ballot_1, ballot_2


class ActiveElectionTests(TestCase):
    def setUp(self):
        Election.objects.create(title='ActiveElection', active=True)
        Election.objects.create(title='NotActiveElection', active=False)

    def test_toggle_active(self):
        active = Election.objects.get(title='ActiveElection')
        not_active = Election.objects.get(title='NotActiveElection')
        active.toggle_active()
        not_active.toggle_active()
        self.assertIs(active.active, False)
        self.assertIs(not_active.active, True)

    def test_only_one_active_election(self):
        not_active = Election.objects.get(title='NotActiveElection')
        with self.assertRaises(AttributeError):
            not_active.toggle_active()


class CreateElectionTest(TestCase):
    def setUp(self):
        create_election()

    def test_create_users(self):
        election = Election.objects.get(title='election')
        election.create_users(20)
        self.assertIs(election.electionuser_set.count(), 20)
        election.create_users(10)
        self.assertIs(election.electionuser_set.count(), 30)

    def test_plain_codes(self):
        election = Election.objects.get(title='election')
        election.create_users(20)
        self.assertIs(election.get_plain_codes().count('</br>'), election.electionuser_set.count() - 1)


class ElectionUtilsTest(TestCase):
    def setUp(self):
        create_sub_election_with_candidates()

    def test_next_title(self):
        election = Election.objects.get(title='election')
        next_title = election.get_next_title()
        self.assertEqual(next_title, '{}. Durchgang'.format(Election.objects.all().count() + 1))

    def test_candidates_sorted(self):
        election = Election.objects.get(title='election')
        candidates_sorted = election.candidates_sorted()
        self.assertIs('John Doe' in candidates_sorted, True)
        self.assertIs('James Smith' in candidates_sorted, True)
        self.assertIs('SubElection' in candidates_sorted, True)
        self.assertIs(candidates_sorted.count(','), Candidate.objects.count() - 1)

    def test_sub_election_sorted(self):
        election = Election.objects.get(title='election')
        sub_election_sorted = election.sub_election_sorted()
        self.assertIs('SubElection' in sub_election_sorted, True)
        self.assertIs(sub_election_sorted.count(','), SubElection.objects.count() - 1)


class SelectionTest(TestCase):
    def setUp(self):
        create_sub_election_with_candidates()
        create_election_users()

    def test_select_candidate(self):
        election_user = ElectionUser.objects.get(user__username='TestUser')
        candidate = Candidate.objects.get(name='John Doe')
        election_user.select_candidate(candidate)
        user_ballots = Ballot.objects.filter(user=election_user)
        self.assertIs(user_ballots.count(), 1)
        ballot = user_ballots.first()
        self.assertEqual(ballot.user, election_user)
        self.assertEqual(ballot.choice, candidate)

    def test_second_ballot(self):
        election_user = ElectionUser.objects.get(user__username='TestUser')
        candidate = Candidate.objects.get(name='John Doe')
        election_user.select_candidate(candidate)
        with self.assertRaises(ValueError):
            election_user.select_candidate(candidate)

    def test_second_ballot_for_sub_election(self):
        election_user = ElectionUser.objects.get(user__username='TestUser')
        candidate_1 = Candidate.objects.get(name='John Doe')
        candidate_2 = Candidate.objects.get(name='James Smith')
        election_user.select_candidate(candidate_1)
        with self.assertRaises(ValueError):
            election_user.select_candidate(candidate_2)
