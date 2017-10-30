from django.test import TestCase

from election.util import generate_random_string


class UtilTest(TestCase):
    def test_random_list(self):
        string_list = generate_random_string(10, 5)
        self.assertIs(len(string_list), 5)
        for string in string_list:
            self.assertIs(len(string), 10)

    def test_random_string(self):
        random_string = generate_random_string(5)
        self.assertIsInstance(random_string, str)
        self.assertIs(len(random_string), 5)

