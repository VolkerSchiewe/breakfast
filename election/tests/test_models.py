import time

from election.models import Election, Candidate, Ballot, ElectionUser
from election.models.state import ElectionState
from election.tests.test_case import ElectionTestCase


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


class SelectionTest(ElectionTestCase):
    def test_select_candidate(self):
        election_user = ElectionUser.objects.filter(election__isnull=False).first()
        candidate = Candidate.objects.get(pk=1)
        election_user.select_candidate(candidate)
        user_ballots = Ballot.objects.filter(user=election_user)
        self.assertIs(user_ballots.count(), 1)
        ballot = user_ballots.first()
        self.assertEqual(ballot.user, election_user)
        self.assertEqual(ballot.choice, candidate)

    def test_second_ballot(self):
        election_user = ElectionUser.objects.filter(election__isnull=False).first()
        candidate = Candidate.objects.get(pk=1)
        election_user.select_candidate(candidate)
        with self.assertRaises(ValueError):
            election_user.select_candidate(candidate)

    def test_second_ballot_for_sub_election(self):
        election_user = ElectionUser.objects.filter(election__isnull=False).first()
        candidate_1 = Candidate.objects.get(pk=1)
        candidate_2 = Candidate.objects.get(pk=2)
        election_user.select_candidate(candidate_1)
        with self.assertRaises(ValueError):
            election_user.select_candidate(candidate_2)
