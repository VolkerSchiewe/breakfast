import time

from election.models import Election, Candidate, Ballot, ElectionUser, SubElection, Image
from election.models.state import ElectionState
from election.tests.test_case import ElectionTestCase, BallotsTestCase


class ActiveElectionTests(ElectionTestCase):
    def setUp(self):
        super().setUp()
        Election.objects.create(title='ActiveElection', state=ElectionState.ACTIVE)

    def test_only_one_active_election(self):
        not_active = Election.objects.get(pk=1)
        with self.assertRaises(AttributeError):
            not_active.toggle_active()


class CreateElectionTest(ElectionTestCase):
    def test_create_users(self):
        start_time = time.time()
        election = Election.objects.get(pk=1)
        election.create_users(20)
        self.assertIs(election.electionuser_set.count(), 25)
        election.create_users(10)
        self.assertIs(election.electionuser_set.count(), 35)
        print("--- %s seconds ---" % (time.time() - start_time))

    def test_create_users_fails(self):
        election = Election.objects.first()
        election.create_users(0)
        self.assertEqual(election.electionuser_set.count(), 5)
        election.create_users(1)
        self.assertEqual(election.electionuser_set.count(), 6)

    def test_new_election(self):
        election = Election.objects.create(title='title')
        self.assertIs(election.votes_count, 0)


class StringRepresentationTests(BallotsTestCase):
    def test_string_representations(self):
        models = [Election, Ballot, SubElection, Candidate, Image, ElectionUser]
        for item in models:
            obj = item.objects.first()
            self.assertIsInstance(str(obj), str)
