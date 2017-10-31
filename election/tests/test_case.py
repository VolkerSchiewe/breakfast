from django.core.management import call_command
from django.test import TestCase


class ElectionTestCase(TestCase):
    def setUp(self):
        call_command('flush', interactive=False, verbosity=0)
        call_command('loaddata', 'elections.json', verbosity=0)


class BallotsTestCase(TestCase):
    def setUp(self):
        call_command('flush', interactive=False, verbosity=0)
        call_command('loaddata', 'ballots.json', verbosity=0)
