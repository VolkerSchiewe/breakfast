from django.conf import settings
from django.contrib import auth
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import logout
from django.core.files import File
from django.shortcuts import render, redirect
from django.views import View

from election.forms import LoginForm, CreateElectionForm, CreateSubElectionForm, ElectionForm
from election.util import serve_file
from .models import Candidate, SubElection, User, Election


def home(request):
    if request.user.is_superuser:
        return redirect('elections_list')
    else:
        return redirect('election')


def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = User.objects.get(username=form.cleaned_data.get('username'))
            auth.login(request, user)
            return redirect('election')
    else:
        form = LoginForm()

    return render(request, 'login.html', context={'form': form, })


class ElectionView(View):
    def get(self, request):
        election = request.user.electionuser.election
        if not election.active:
            return render(request, "closed.html")
        if request.user.electionuser.already_elected():
            messages.error(request, 'Du hast schon gewählt')
            logout(request)
            return redirect('election')

        form = ElectionForm(election)
        return render(request, 'election.html', {'form': form, })

    def post(self, request):
        election = request.user.electionuser.election

        form = ElectionForm(election, request.POST)
        if form.is_valid():
            election_user = request.user.electionuser
            logout(request)
            for sub_election in form.cleaned_data:
                candidate = form.cleaned_data.get(sub_election)
                try:
                    election_user.select_candidate(candidate)
                except ValueError as e:
                    messages.error(request, e)
                    return redirect('election')

            messages.success(request, 'Deine Stimme wurde gespeichert')
            return redirect('election')

        return render(request, 'election.html', {'form': form, })


# Results View
# -------------------------------------
@staff_member_required
def results(request, election_id):
    election = Election.objects.get(id=election_id)

    context = {
        'election_count': election.ballots_count(),
        'result_list': election.get_results()
    }
    return render(request, 'results.html', context)


# Create new users view
# -------------------------------------
@staff_member_required
def create_election(request):
    if request.POST:
        election_form = CreateElectionForm(request.POST)
        sub_election_form = CreateSubElectionForm(prefix='pre-1', data=request.POST)

        if election_form.is_valid() and sub_election_form.is_valid():
            user_number = election_form.cleaned_data.get('user_number')
            election = Election.objects.create(title=Election.get_next_title())
            counter = 0
            while 'pre-{}-title'.format(counter) in request.POST:
                sub_election = SubElection.objects.create(title=request.POST.get('pre-{}-title'.format(counter)),
                                                          short=request.POST.get('pre-{}-short'.format(counter)),
                                                          election=election)
                for name in request.POST.get('pre-{}-candidates'.format(counter)).split(','):
                    Candidate.objects.create(name=name, sub_election=sub_election)
                counter += 1
            election.create_users(user_number)
            return redirect('elections_list')
    else:
        election_form = CreateElectionForm()
        sub_election_form = CreateSubElectionForm()

    context = {
        'election_form': election_form,
        'sub_election_form': sub_election_form,
    }
    return render(request, 'create_election.html', context)


@staff_member_required
def clone_election(request):
    last_election = Election.objects.get(title__contains=str(len(Election.objects.all())) + '.')
    last_election.clone()
    return redirect('elections_list')


@staff_member_required
def election_list(request):
    elections = Election.objects.all().order_by('title')

    context = {
        'elections': elections,
    }
    return render(request, 'elections.html', context)


@staff_member_required
def toggle_active_election(request, election_id):
    try:
        election = Election.objects.get(id=election_id)
        election.toggle_active()
    except AttributeError as e:
        messages.error(request, str(e))

    return redirect('elections_list')


def get_candidate_image(request, candidate_id):
    candidate = Candidate.objects.get(pk=candidate_id)

    if candidate.image:
        return serve_file(candidate.image.file.file)
    else:
        return serve_file(File(open(settings.BASE_DIR + "/election/static/images/placeholder.png", mode='rb')))


@staff_member_required
def edit_election(request, election_id):
    election = Election.objects.get(pk=election_id)

    return render(request, 'edit_election.html', {'election': election, })
