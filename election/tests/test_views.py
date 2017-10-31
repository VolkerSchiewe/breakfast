from django.urls import reverse

from election.models import Candidate, Election, ElectionUser
from election.tests.test_case import ElectionTestCase, BallotsTestCase


class TestCandidateImage(ElectionTestCase):
    def test_candidate_image_view(self):
        candidate = Candidate.objects.get(pk=1)
        self.client.login(username='admin', password='admin')
        response = self.client.get(reverse('get_candidate_image', args={candidate.pk}))
        self.assertIs(response.status_code, 200)

    def test_candidate_without_image(self):
        candidate = Candidate.objects.get(pk=1)
        candidate.image = None
        candidate.save()
        self.client.login(username='admin', password='admin')
        response = self.client.get(reverse('get_candidate_image', args={candidate.pk}))
        self.assertIs(response.status_code, 200)


class TestResultsView(BallotsTestCase):
    def test_results_view(self):
        election = Election.objects.first()
        election.toggle_active()
        self.client.login(username='admin', password='admin')

        response = self.client.get(reverse('results', args={election.pk}))
        self.assertIs(response.status_code, 200)
        for sub_election in election.subelection_set.all():
            self.assertContains(response, sub_election.title)
            for candidate in sub_election.candidate_set.all():
                self.assertContains(response, candidate.name)


class TestLoginView(ElectionTestCase):
    def setUp(self):
        super().setUp()
        Election.objects.first().toggle_active()

    def test_login_get(self):
        response = self.client.get(reverse('login'))
        self.assertContains(response, 'Code')

    def test_login_post(self):
        election_user = ElectionUser.objects.filter(election__isnull=False).first()
        response = self.client.post(reverse('login'), data={'username': election_user.user.username})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, '/election')
