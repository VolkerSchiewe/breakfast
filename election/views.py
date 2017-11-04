from django.conf import settings
from django.contrib import auth
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.files import File
from django.db import transaction
from django.db.models import QuerySet
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views import View

from election.forms import LoginForm, CreateElectionForm, CreateSubElectionForm, ElectionForm, EditSubElectionForm, \
    CandidateForm
from election.util import serve_file
from .models import Candidate, SubElection, User, Election, Image


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
        if election and not election.active:
            return render(request, "closed.html")
        if request.user.electionuser.already_elected():
            messages.error(request, 'Du hast schon gewählt')
            logout(request)
            return redirect('election')

        form = ElectionForm(election)
        return render(request, 'election.html', {'form': form, })

    @transaction.atomic
    def post(self, request):
        election = request.user.electionuser.election

        form = ElectionForm(election, request.POST)
        if form.is_valid():
            election_user = request.user.electionuser
            logout(request)
            for sub_election in form.cleaned_data:
                selections = form.cleaned_data.get(sub_election)
                try:
                    if isinstance(selections, QuerySet):
                        election_user.select_candidates(selections)
                    else:
                        election_user.select_candidate(selections)
                except ValueError as e:
                    messages.error(request, e)
                    return redirect('election')
            election.send_results()
            messages.success(request, 'Deine Stimme wurde gespeichert')
            return redirect('election')

        return render(request, 'election.html', {'form': form, })


# Results View
# -------------------------------------
@staff_member_required
def results(request, election_id):
    election = Election.objects.get(id=election_id)
    context = {
        'result_list': election.get_results()
    }
    return render(request, 'results.html', context)


# Create new users view
# -------------------------------------
@staff_member_required
def create_election(request):
    if request.POST:
        election_form = CreateElectionForm(request.POST)
        sub_election_form = CreateSubElectionForm(prefix='pre-0', data=request.POST)

        if election_form.is_valid() and sub_election_form.is_valid():
            user_number = election_form.cleaned_data.get('user_number')
            election = Election.objects.create(title=Election.get_next_title())
            counter = 0
            while 'pre-{}-title'.format(counter) in request.POST:
                sub_election = SubElection.objects.create(title=request.POST.get('pre-{}-title'.format(counter)),
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


@login_required
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


@staff_member_required
def get_user_codes(request, election_id):
    return HttpResponse(Election.objects.get(pk=election_id).get_plain_codes())


@staff_member_required
def edit_subelection(request, election_id, subelection_id):
    sub_election = SubElection.objects.get(pk=subelection_id)
    if request.method == 'POST':
        form = EditSubElectionForm(request.POST)
        if form.is_valid():
            sub_election.title = form.cleaned_data.get('title')
            sub_election.save()
            return HttpResponse()
    form = EditSubElectionForm(initial={'title': sub_election.title})
    context = {
        'sub_election': sub_election,
        'form': form,
    }
    return render(request, 'edit_subelection.html', context)


@staff_member_required
def edit_candidate(request, candidate_id):
    candidate = Candidate.objects.get(pk=candidate_id)
    if request.method == 'POST':
        form = CandidateForm(request.POST, request.FILES)
        if form.is_valid():
            image_file = form.cleaned_data.get('new_image')
            name = form.cleaned_data.get('name')
            if image_file:
                image, created = Image.objects.get_or_create(name=name)
                image.file = image_file
                image.save()
            else:
                image = form.cleaned_data.get('image')
            candidate.edit(name, image, True if not image else False)
            return HttpResponse()
    form = CandidateForm(initial={'name': candidate.name, 'image': candidate.image})
    context = {
        'candidate': candidate,
        'form': form
    }
    return render(request, 'candidate_modal.html', context)
