from django.test import TestCase

from election.models import Election


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
