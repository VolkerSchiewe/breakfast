from election.models import Election, SubElection, Candidate, Ballot, ElectionUser
from election.tests.test_case import ElectionTestCase, BallotsTestCase


class ActiveElectionTests(ElectionTestCase):
    def setUp(self):
        super().setUp()
        Election.objects.create(title='ActiveElection', active=True)

    def test_toggle_active(self):
        active = Election.objects.get(title='ActiveElection')
        not_active = Election.objects.get(pk=1)
        active.toggle_active()
        not_active.toggle_active()
        self.assertIs(active.active, False)
        self.assertIs(not_active.active, True)

    def test_only_one_active_election(self):
        not_active = Election.objects.get(pk=1)
        with self.assertRaises(AttributeError):
            not_active.toggle_active()


class CreateElectionTest(ElectionTestCase):
    def test_create_users(self):
        election = Election.objects.get(pk=1)
        election.create_users(20)
        self.assertIs(election.electionuser_set.count(), 25)
        election.create_users(10)
        self.assertIs(election.electionuser_set.count(), 35)

    def test_plain_codes(self):
        election = Election.objects.get(pk=1)
        election.create_users(25)
        self.assertIs(election.get_plain_codes().count('</br>'), election.electionuser_set.count() - 1)


class ElectionUtilsTest(ElectionTestCase):
    def test_next_title(self):
        election = Election.objects.get(pk=1)
        next_title = election.get_next_title()
        self.assertEqual(next_title, '{}. Durchgang'.format(Election.objects.all().count() + 1))

    def test_candidates_sorted(self):
        election = Election.objects.get(pk=1)
        candidates_sorted = election.candidates_sorted()
        self.assertIs('Max' in candidates_sorted, True)
        self.assertIs('Maria Muster' in candidates_sorted, True)
        self.assertIs('Planungsteam' in candidates_sorted, True)
        count = 0
        for sub_election in election.subelection_set.all():
            count += sub_election.candidate_set.count() - 1
        self.assertIs(candidates_sorted.count(','), count)

    def test_sub_election_sorted(self):
        election = Election.objects.get(pk=1)
        sub_election_sorted = election.sub_election_sorted()
        self.assertIs('AeJ' in sub_election_sorted, True)
        self.assertIs(sub_election_sorted.count(','), SubElection.objects.count() - 1)


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


class ElectionResultsTest(BallotsTestCase):
    def test_results(self):
        election = Election.objects.first()  # type: Election
        results = election.get_results()
        self.assertEqual(election.subelection_set.count(), len(results))
        for sub_election in results:
            self.assertIn(sub_election.get('title'), election.subelection_set.all().values_list('title', flat=True))

