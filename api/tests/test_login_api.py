from django.conf import settings
from django.utils.translation import gettext as _

from election.models import Election
from election.models.state import ElectionState
from election.tests.test_case import ElectionTestCase, BallotsTestCase


class LoginApiTest(ElectionTestCase):
    def test_successful_login(self):
        election = Election.objects.first()
        election.state = ElectionState.ACTIVE
        election.save()
        dataset = [
            {'username': 'admin', 'password': 'admin'},
            {'username': 'OaIE', 'password': settings.PASSWORD},
        ]
        for data in dataset:
            print('login test for {}'.format(data.get('username')))
            response = self.client.post('/api/login/', data)
            self.assertEqual(response.status_code, 200)
            user = response.data.get('user')
            self.assertIsNotNone(user)
            self.assertIsNotNone(user.get('username'))
            self.assertIsNotNone(user.get('isAdmin'))
            self.assertIsNotNone(response.data.get('token'))

    def test_failed_admin_login(self):
        response = self.client.post('/api/login/', {'username': 'admin', 'password': 'wrong passowrd'})
        self.assertEqual(response.status_code, 401)

    def test_no_active_election(self):
        response = self.client.post('/api/login/', {'username': 'OaIE', 'password': settings.PASSWORD})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, _('No active Election!'))

    def test_wrong_code(self):
        election = Election.objects.first()
        election.state = ElectionState.ACTIVE
        election.save()
        election = Election.objects.create(title='New Election')
        election.create_users(10)
        code = election.electionuser_set.first().user.username
        response = self.client.post('/api/login/', {'username': code, 'password': settings.PASSWORD})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data, _('Wrong Code!'))


class LoginTestApiAlreadyVoted(BallotsTestCase):
    def test_already_voted(self):
        response = self.client.post('/api/login/', {'username': 'WQky', 'password': settings.PASSWORD})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, _('Already voted!'))
