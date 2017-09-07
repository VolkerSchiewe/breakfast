from django.conf import settings
from django.contrib import auth
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.views import View

from election.forms import LoginForm, CreateElectionForm, CreateSubElectionForm
from election.util import serve_file
from .models import Ballot, Candidate, SubElection, User, Election, Image


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
    elections = SubElection.objects.filter(election=request.user.electionuser.election)
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


class ElectionView(View):
    def get(self, request):
        if not Election.objects.filter(active=True).exists():
            return render(request, "closed.html")
        election = Election.objects.filter(active=True).first()
        if request.user.electionuser.already_elected():
            messages.error(request, 'Du hast schon gewählt')
            logout(request)
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

        for election in SubElection.objects.filter(election=request.user.electionuser.election):
            selection = request.POST.get(election.short)
            c = Candidate.objects.get(pk=selection)
            b, created = Ballot.objects.get_or_create(user=request.user.electionuser, choice=c)
            if created:
                b.save()
                logout(request)
            else:
                messages.error(request, "Deine Stimme existiert schon, bitte melde dich beim PT")

        messages.success(request, 'Deine Stimme wurde gespeichert')
        return redirect('election')


# Results View
# -------------------------------------
@staff_member_required
def results(request, election_id):
    election = Election.objects.get(id=election_id)
    election_count = 0
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
        last_election = Election.objects.get(title__contains=str(len(Election.objects.all())) + '.')
        last_election.clone()
        return redirect('elections_list')

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
def election_list(request):
    elections = Election.objects.all().order_by('title')
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


def get_image(request, image_id):
    image = Image.objects.get(pk=image_id)
    if image.file:
        return serve_file(image.file)
    else:
        return serve_file(open(settings.BASE_DIR + "/election/static/images/placeholder.png"))


def home(request):
    if request.user.is_superuser:
        return redirect('elections_list')
    else:
        return redirect('election')


def edit_election(request, election_id):
    election = Election.objects.get(pk=election_id)

    return render(request, 'edit_election.html', {'election': election, })
