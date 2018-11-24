from django.test import TestCase


class ViewTestCase(TestCase):
    def test_react_view(self):
        response = self.client.get('')
        self.assertTemplateUsed(response, 'react.html')
