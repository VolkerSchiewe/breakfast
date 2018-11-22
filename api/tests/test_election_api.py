import json

from api.tests.test_cases import BallotsApiTestCase
from election.models import Ballot, Election, ElectionUser
from election.models.state import ElectionState


class ElectionApiTest(BallotsApiTestCase):
    def test_election_api(self):
        response = self.client.get('/api/elections/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data, [
            {'id': 1,
             'title': '1. Durchgang',
             'state': 2,
             'candidateNames': [
                 {'title': 'AeJ', 'names': ['Max', 'Moritz']},
                 {'title': 'Planungsteam', 'names': ['Maria Muster', 'Max Muster']}
             ],
             'voteCount': 3,
             'codes': ['OaIE', 'WQky', 'pgmB', 'wumN', 'hnwA']}
        ])

    def test_close_election(self):
        self.assertEqual(6, Ballot.objects.filter(choice__sub_election__election_id=1).count())
        response = self.client.post('/api/elections/1/close/')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/elections/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data, [
            {'id': 1,
             'title': '1. Durchgang',
             'state': 3,
             'candidateNames': [
                 {'title': 'AeJ', 'names': ['Max', 'Moritz']},
                 {'title': 'Planungsteam', 'names': ['Maria Muster', 'Max Muster']}
             ], 'voteCount': 3,
             'codes': []}
        ])
        self.assertEqual(0, Ballot.objects.filter(choice__sub_election__election_id=1).count())
        self.assertEqual(Election.objects.get(pk=1).state, ElectionState.CLOSED)

    def test_get_codes(self):
        response = self.client.get('/api/elections/1/codes/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'title')
        self.assertContains(response, 'codes')

    def test_create_election(self):
        self.assertEqual(1, Election.objects.count())
        response = self.client.post('/api/elections/create_election/', {'title': 'New', 'number': 10})
        self.assertEqual(200, response.status_code)
        self.assertEqual(2, Election.objects.count())
        election = Election.objects.last()
        self.assertEqual(10, ElectionUser.objects.filter(election=election).count())

    def test_create_election_fails(self):
        data_set = [
            {},
            {'title': 'Bla'},
            {'number': 1},
            {'title': 'test', 'number': 'test'},
            {'test': 'test'},
        ]
        for data in data_set:
            response = self.client.post('/api/elections/create_election/', data)
            self.assertEqual(response.status_code, 400)

    def test_vote_count(self):
        response = self.client.get('/api/elections/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('voteCount'), 3)

    def test_vote_count_closed(self):
        response = self.client.post('/api/elections/1/close/')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/elections/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('voteCount'), 3)


class ActiveElectionTest(BallotsApiTestCase):
    def setUp(self):
        super(ActiveElectionTest, self).setUp()
        self.client.post('/api/elections/create_election/', {'title': 'Second', 'number': 5})

    def test_set_active(self):
        response = self.client.post('/api/elections/1/set_active/')
        self.assertEqual(response.status_code, 200)
        election = Election.objects.get(pk=1)
        self.assertTrue(election.state, ElectionState.ACTIVE)
        response = self.client.post('/api/elections/2/set_active/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(election.state, ElectionState.NOT_ACTIVE)

    def test_set_closed_to_active(self):
        response = self.client.post('/api/elections/1/close/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Election.objects.get(pk=1).state, ElectionState.CLOSED)
        self.client.post('/api/elections/1/set_active/')
        self.assertEqual(Election.objects.get(pk=1).state, ElectionState.CLOSED)

    def test_set_multiple_active(self):
        response = self.client.post('/api/elections/1/set_active/')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/api/elections/2/set_active/')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/api/elections/1/set_active/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Election.objects.filter(state=ElectionState.ACTIVE).count(), 1)
