from rest_framework.test import APIClient

from election.tests.test_case import BallotsTestCase


class BallotsApiTestCase(BallotsTestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.client.login(username='admin', password='admin')
