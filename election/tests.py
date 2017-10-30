from django.contrib.auth.models import User
from django.test import TestCase

from election.models import Election, SubElection, Candidate, Ballot, ElectionUser
from election.util import generate_random_string


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
    user = User.object.create_user(username='TestUser', password='TestPassword')
    return ElectionUser.objects.get_or_create(user=user, election=election)[0]


def create_ballots():
    election_user = create_election_users()
    sub_election, candidate_1, candidate_2 = create_sub_election_with_candidates()
    Ballot.objects.create()


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


class UtilTest(TestCase):
    def test_random_list(self):
        string_list = generate_random_string(10, 5)
        self.assertIs(len(string_list), 5)
        for string in string_list:
            self.assertIs(len(string), 10)

    def test_random_string(self):
        random_string = generate_random_string(5)
        self.assertIsInstance(random_string, str)
        self.assertIs(len(random_string), 5)
