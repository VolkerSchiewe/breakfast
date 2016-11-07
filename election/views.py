import random
import string

from django.contrib import auth
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.template.context_processors import csrf

from breakfast import settings
from breakfast.settings import BASE_DIR
from .models import Ballot, Candidate


# Login_View
# -------------------------------------
def login_view(request):
    if not request.POST:
        # user first login
        c = {}
        c.update(csrf(request))
        return render(request, 'login.html', context=None)

    else:
        # login submit button clicked
        username = request.POST.get('username', '')
        user = auth.authenticate(username=username, password=settings.PASSWORD)
        if user is not None:
            auth.login(request, user)
            print('login ' + str(user.username))
            return HttpResponseRedirect('/election')
        else:
            return render(request, 'login.html', context={'error_message': 'Code nicht registriert'})


# Election View
# -------------------------------------
@login_required
def election(request):
    # User finished election
    if request.POST:
        pt_sel = request.POST['pt']
        aej_sel = request.POST['aej']

        person_code = request.user
        b = Ballot(personCode=person_code, ptChoose=pt_sel, aejChoose=aej_sel)
        b.save()
        print('Vote saved for: ' + str(request.user))
        return redirect('./votes', request)

    # user gets to election view after login
    if len(Ballot.objects.filter(personCode=request.user)) != 0:
        return redirect('./votes', request)
    pt_list = Candidate.objects.filter(election_type=1)
    aej_list = Candidate.objects.filter(election_type=2)
    context = {
        'pt_list': pt_list,
        'aej_list': aej_list,
    }
    return render(request, 'election.html', context)


# Results View
# -------------------------------------
@staff_member_required
def results(request):
    # calculate the results
    pt_list = Candidate.objects.filter(election_type=1)
    aej_list = Candidate.objects.filter(election_type=2)
    for pt in pt_list:
        pt.result = len(Ballot.objects.filter(ptChoose=pt.pk))
    for aej in aej_list:
        aej.result = len(Ballot.objects.filter(aejChoose=aej.pk))

    election_count = len(Ballot.objects.all())
    context = {
        'election_count': election_count,
        'pt_list': pt_list,
        'aej_list': aej_list,

    }
    return render(request, 'results.html', context)


# Create new users view
# -------------------------------------
@staff_member_required
def create_users(request):
    f = open(BASE_DIR + '/election/static/users.txt', 'w')
    if request.POST:
        new_users = int(request.POST['length'])
        # lines = f.read().splitlines()

        # size = min([new_users, len(lines)])
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
    all_ballots = Ballot.objects.all()
    election_count = len(all_ballots)
    context = {
        'election_count': election_count,
    }
    return render(request, 'votes.html', context)


def random_gen(n):
    codes = []
    for i in range(0, n):
        item = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(4))
        codes.append(item)

    return codes
