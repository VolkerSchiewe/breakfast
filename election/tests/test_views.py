from django.urls import reverse

from election.models import Candidate, Election, ElectionUser, SubElection
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


class TestCreateElectionView(ElectionTestCase):
    def test_clone_election(self):
        self.client.login(username='admin', password='admin')

        old_election_count = Election.objects.count()
        old_election = Election.objects.last()
        response = self.client.get(reverse('clone_election'))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, '/elections')
        new_election = Election.objects.last()
        self.assertEqual(Election.objects.count(), old_election_count + 1)
        self.assertEqual(list(old_election.subelection_set.all().values_list('title', flat=True)),
                         list(new_election.subelection_set.all().values_list('title', flat=True)))
        self.assertEqual(old_election.electionuser_set.count(), new_election.electionuser_set.count())

    def test_create_election_get(self):
        self.client.login(username='admin', password='admin')
        response = self.client.get(reverse('create_election'))
        self.assertContains(response, 'Wahlgang erstellen')

    def test_create_election_post(self):
        self.client.login(username='admin', password='admin')
        response = self.client.post(reverse('create_election'), data={'user_number': 5,
                                                                      'pre-0-title': 'NewTitle',
                                                                      'pre-0-candidates': 'Max, Muster'})
        self.assertEqual(response.status_code, 302)
        sub_election = SubElection.objects.filter(title='NewTitle')
        self.assertIs(sub_election.exists(), True)
        self.assertIn('Max', sub_election.first().election.candidates_sorted())
        self.assertIn('Muster', sub_election.first().election.candidates_sorted())


class SubElectionTest(ElectionTestCase):
    def test_edit_subelection_get(self):
        self.client.login(username='admin', password='admin')
        sub_election = SubElection.objects.first()
        response = self.client.get(reverse('edit_subelection', args={sub_election.election.pk, sub_election.pk}))
        self.assertContains(response, sub_election.title)

    def test_edit_subelection_post(self):
        self.client.login(username='admin', password='admin')
        sub_election = SubElection.objects.first()
        response = self.client.post(reverse('edit_subelection', args={sub_election.election.pk, sub_election.pk}),
                                    data={'title': 'NewTitle'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(SubElection.objects.first().title, 'NewTitle')


class CandidateViewTest(ElectionTestCase):
    def test_edit_candidate_get(self):
        self.client.login(username='admin', password='admin')
        candidate = Candidate.objects.first()
        response = self.client.get(reverse('edit_candidate', args={candidate.pk}))
        self.assertContains(response, candidate.name)

    def test_edit_candidate_post(self):
        self.client.login(username='admin', password='admin')
        candidate = Candidate.objects.order_by('pk').first()
        response = self.client.post(reverse('edit_candidate', args={candidate.pk}), data={'name': 'NewName'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Candidate.objects.order_by('pk').first().name, 'NewName')


class ElectionTest(ElectionTestCase):
    def test_not_logged_in(self):
        response = self.client.get(reverse('election'))
        self.assertEqual(response.status_code, 302)

    def test_election_not_active(self):
        election_user = Election.objects.first().electionuser_set.first()
        self.client.login(username=election_user.user.username, password='ebujugend')
        response = self.client.get(reverse('election'))
        self.assertTemplateUsed(response, 'closed.html')

    def test_elect_get(self):
        election = Election.objects.first()  # type: Election
        election.toggle_active()
        election_user = election.electionuser_set.first()
        self.client.login(username=election_user.user.username, password='ebujugend')
        response = self.client.get(reverse('election'))
        self.assertContains(response, election.subelection_set.first().candidate_set.first().name)
        for sub_election in election.subelection_set.all():
            for candidate in sub_election.candidate_set.all():
                self.assertContains(response, candidate.name)

