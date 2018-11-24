from django.conf import settings
from rest_framework.test import APIClient

from api.tests.test_cases import BallotsApiTestCase
from election.models import SubElection, Election
from election.models.state import ElectionState
from election.tests.test_case import BallotsTestCase


class SubElectionAdminApiTest(BallotsApiTestCase):
    def test_get_sub_elections(self):
        response = self.client.get('/api/subelections/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), SubElection.objects.count())


class SubElectionUserApiTest(BallotsTestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        response = self.client.post('/api/login/', {'username': 'OaIE', 'password': settings.PASSWORD})
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data.get('token'))

    def test_get_active_subelection(self):
        response = self.client.get('/api/subelections/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), Election.objects.get(state=ElectionState.ACTIVE).subelection_set.count())

    def test_get_without_active_election(self):
        Election.objects.filter(state=ElectionState.ACTIVE).update(state=ElectionState.NOT_ACTIVE)
        response = self.client.get('/api/subelections/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_vote(self):
        response = self.client.post('/api/subelections/vote/', {'1': 2, '2': 3})
        self.assertEqual(response.status_code, 200)

    def test_not_active_fails(self):
        Election.objects.filter(state=ElectionState.ACTIVE).update(state=ElectionState.NOT_ACTIVE)
        with self.assertRaises(Election.DoesNotExist):
            self.client.post('/api/subelections/vote/', {'1': 2, '2': 3})

    def test_wrong_user(self):
        first_election = Election.objects.get(pk=1)
        first_election.state = ElectionState.NOT_ACTIVE
        first_election.save()
        election = Election.objects.create(title='New', state=ElectionState.ACTIVE)
        election.create_users(5)
        response = self.client.post('/api/login/', {'username': election.electionuser_set.first().user.username,
                                                    'password': settings.PASSWORD})
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data.get('token'))
        election.state = ElectionState.NOT_ACTIVE
        first_election.state = ElectionState.ACTIVE
        election.save()
        first_election.save()
        response = self.client.post('/api/subelections/vote/', {'1': 2, '2': 3})
        self.assertEqual(response.status_code, 400)

    def test_wrong_request_data(self):
        response = self.client.post('/api/subelections/vote/', {'1': 2})
        self.assertEqual(response.status_code, 400)

    def test_duplicate_election(self):
        response = self.client.post('/api/subelections/vote/', {'1': 2, '2': 3})
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/api/subelections/vote/', {'1': 2, '2': 3})
        self.assertEqual(response.status_code, 400)
