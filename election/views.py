import random
import string

from django.contrib import auth
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views import View

from breakfast import settings
from election.forms import LoginForm, CreateElectionForm, CreateSubElectionForm
from election.util import serve_file
from .models import Ballot, Candidate, SubElection, User, Election


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


def check_input(request):
    error = None
    elections = SubElection.objects.filter(election=request.user.election)
    selections = list()
    for election in elections:
        if request.POST.get(election.short, False):
            selections.append(request.POST.get(election.short))

    if not len(selections) is len(elections):
        messages.error(request, "Das müssen wir noch üben. Da fehlte was!")
        error = True

    names = list()
    for selection in selections:
        c = Candidate.objects.get(pk=selection)
        if c.name in names:
            messages.error(request, "Wolltest Du jemanden doppelt wählen? Das grenzt an Wahlbetrug!")
            error = True
        else:
            names.append(c.name)

    if not error:
        return False

    elections = []
    for election in SubElection.objects.filter(active=True):
        c_list = Candidate.objects.filter(sub_election=election)
        elections.append(c_list)

    context = {
        'selected': selections,
        'list': elections,
    }
    return render(request, 'election.html', context)


@method_decorator(login_required, name='get')
class ElectionView(View):
    def get(self, request):
        if not Election.objects.filter(active=True).exists():
            return render(request, "closed.html")
        election = Election.objects.filter(active=True).first()
        if request.user.electionuser.already_elected():
            messages.error(request, 'Du hast schon gewählt')
            return redirect('login')

        context = {
            'sub_elections': election.get_sub_elections_with_candidates(),
            # 'img_dir': 'static/images/upload/photo.jpg',
        }
        return render(request, 'election.html', context)

    def post(self, request):
        response = check_input(request)
        if response:
            return response

        for election in SubElection.objects.filter(election=request.user.election):
            selection = request.POST.get(election.short)
            c = Candidate.objects.get(pk=selection)
            b, created = Ballot.objects.get_or_create(user=request.user, choice=c)
            if created:
                b.save()
            else:
                messages.error(request, "Deine Stimme existiert schon, bitte melde dich beim PT")

        messages.success(request, 'Deine Stimme wurde gespeichert')
        return redirect('login')


# Results View
# -------------------------------------
@staff_member_required
def results(request, election_id):
    election = Election.objects.get(id=election_id)

    election_count = int(len(Ballot.objects.filter(choice__sub_election__election=election)) / len(
        SubElection.objects.filter(election=election)))
    context = {
        'election_count': election_count,
        'result_list': election.get_results()
    }
    return render(request, 'results.html', context)


# Create new users view
# -------------------------------------
@staff_member_required
def create_election(request):
    if request.GET.get('copy'):
        election = Election()
        election.title = Election.get_next_title()
        election.save()
        last_election = Election.objects.get(title__contains=str(len(Election.objects.all())) + '.')
        for sub in last_election.subelection_set.all():
            sub_election = sub
            sub_election.election = election
            sub_election.save()
        return redirect('election_list')

    if request.POST:
        election_form = CreateElectionForm(request.POST)
        if election_form.is_valid():
            user_number = election_form.cleaned_data.get('user_number')
            election = Election.objects.create(title=Election.get_next_title())
            # Todo create subelections and candiates

            i = 0
            while i < user_number:
                username = random_gen(1)[0]
                user = auth.authenticate(username=username, password=settings.PASSWORD)
                if user is None:
                    user = User.objects.create_user(username=username, password=settings.PASSWORD, election=election)
                    user.save()
                    i += 1
            return redirect('election_list')
    else:
        election_form = CreateElectionForm()
        sub_election_form = CreateSubElectionForm()

    context = {
        'election_form': election_form,
        'sub_election_form': sub_election_form,
    }
    return render(request, 'create_elections.html', context)


@staff_member_required
def election_list(request):
    elections = Election.objects.all()
    for election in elections:
        election.sub_elections = ', '.join(str(subelection) for subelection in election.subelection_set.all())
        election.candidates = ', '.join(
            str(candidate) for candidate in Candidate.objects.filter(sub_election__election=election))
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


def get_image(request, user_id):
    candidate = Candidate.objects.get(pk=user_id)
    if candidate.img:
        return serve_file(candidate.img)
    else:
        return serve_file(open(settings.BASE_DIR + "/election/static/images/placeholder.png"))


def random_gen(n):
    codes = []
    for i in range(0, n):
        item = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(4))
        codes.append(item)

    return codes
