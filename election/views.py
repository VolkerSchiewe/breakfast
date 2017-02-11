import random
import string

from django.contrib import auth
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.template.context_processors import csrf
from django.views.generic import View

from breakfast import settings
from breakfast.settings import BASE_DIR
from election.util import serve_file
from .models import Ballot, Candidate, SubElection


class LoginView(View):
    def get(self, request, *args, **kwargs):
        # user first login
        c = {}
        c.update(csrf(request))
        return render(request, 'login.html', context=None)

    def post(self, request, *args, **kwargs):
        # login submit button clicked
        username = request.POST.get('username', '')
        user = auth.authenticate(username=username, password=settings.PASSWORD)
        if user is not None:
            auth.login(request, user)
            print('login ' + str(user.username))
            return HttpResponseRedirect('./')
        else:
            print('failed login: ' + username)
            return render(request, 'login.html', {'error': 'Falscher Code'})


def check_input(request):
    elections = SubElection.objects.filter(visible=True)
    selections = list()
    for election in elections:
        if request.POST.get(election.short, False):
            selections.append(request.POST.get(election.short))

    if len(selections) is len(elections):
        return False

    elections = []
    for election in SubElection.objects.filter(visible=True):
        c_list = Candidate.objects.filter(sub_election=election)
        elections.append(c_list)

    context = {
        'selected': selections,
        'list': elections,
        'error': 'Du warst noch nicht fertig!'
    }
    print(selections)
    return render(request, 'election.html', context)


class ElectionView(View):
    def get(self, request, *args, **kwargs):
        elections = []
        if len(Ballot.objects.filter(personCode=request.user)) >= len(SubElection.objects.all()):
            # User hat bereits gewählt
            return redirect('./votes', request)
        for election in SubElection.objects.filter(visible=True):
            c_list = Candidate.objects.filter(sub_election=election)
            elections.append(c_list)

        context = {
            'list': elections,
            'img_dir': 'static/images/upload/photo.jpg',
        }
        return render(request, 'election.html', context)

    def post(self, request, *args, **kwargs):
        person_code = request.user
        response = check_input(request)
        if response:
            return response

        for election in SubElection.objects.filter(visible=True):
            selection = request.POST.get(election.short)
            c = Candidate.objects.get(pk=selection)
            b = Ballot(personCode=person_code, choice=c)
            b.save()

        print('Vote saved for: ' + str(request.user))
        return redirect('./votes', request)


# Results View
# -------------------------------------
@staff_member_required
def results(request):
    # calculate the results
    results = []
    for election in SubElection.objects.all():
        c_list = Candidate.objects.filter(sub_election=election)
        for c in c_list:
            c.result = len(Ballot.objects.filter(choice=c))
        results.append(c_list)

    election_count = int(len(Ballot.objects.all()) / len(SubElection.objects.all()))
    context = {
        'election_count': election_count,
        'list': results
    }
    return render(request, 'results.html', context)


# Create new users view
# -------------------------------------
@staff_member_required
def create_users(request):
    f = open(BASE_DIR + '/election/static/users.txt', 'w')
    if request.POST:
        new_users = int(request.POST['length'])

        i = 0
        while i < new_users:
            username = random_gen(1)[0]
            user = auth.authenticate(username=username, password=settings.PASSWORD)
            if user is None:
                user = User.objects.create_user(username=username, password=settings.PASSWORD)
                user.save()
                i += 1
                f.writelines(username + '\n')

    user_count = len(User.objects.filter(is_superuser=False))
    f.close()
    return render(request, 'users.html', context={'user_count': user_count})


# users result view
# -------------------------------------
def votes(request):
    print('logout ' + str(request.user))
    auth.logout(request)
    election_count = int(len(Ballot.objects.all()) / len(SubElection.objects.all()))
    context = {
        'election_count': election_count,
    }
    return render(request, 'votes.html', context)


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
