from rest_framework.test import APIClient

from election.tests.test_case import BallotsTestCase


class BallotsApiTestCase(BallotsTestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        response = self.client.post('/api/login/', {'username': 'admin', 'password': 'admin'})
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data.get('token'))
