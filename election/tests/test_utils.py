from django.test import TestCase

from election.util import generate_random_string


class UtilTest(TestCase):
    def test_random_list(self):
        string_list = generate_random_string(10, 100)
        self.assertIs(len(string_list), 100)
        for string in string_list:
            self.assertIs(len(string), 10)
            self.assertNotIn('l', string)
            self.assertNotIn('I', string)
