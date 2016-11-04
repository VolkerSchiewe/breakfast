from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.template.context_processors import csrf

from .models import Ballot, Candidate
from breakfast.settings import BASE_DIR


def login_view(request):
    # user try to log in
    if request.POST:
        username = request.POST.get('username', '')
        password = 'ebujugend'
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return HttpResponseRedirect('/election')
        else:
            return render(request, 'login.html', context=None)
    # user is first time on login page - csrf token has to be created
    else:
        c = {}
        c.update(csrf(request))
        return render(request, 'login.html', context=None)


def election(request):
    # only reachable if user is logged in
    if not request.user.is_authenticated:
        return redirect('./', request)
    # User finished election
    if request.POST:
        pt_sel = request.POST['pt']
        aej_sel = request.POST['aej']

        person_code = request.user
        b = Ballot(personCode=person_code, ptChoose=pt_sel, aejChoose=aej_sel)
        b.save()
        auth.logout(request)
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


def results(request):
    # only reachable for admins
    if not request.user.is_superuser:
        return redirect('./admin', request)

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


def create_users(request):
    # only reachable for admins
    if not request.user.is_superuser:
        return redirect('./admin', request)

    if request.POST:
        new_users = int(request.POST['length'])
        with open(BASE_DIR + '/election/static/users.txt') as f:
            lines = f.read().splitlines()
        for i in range(0, new_users):
            # get list from file
            username = lines[i]
            user = User.objects.create_user(username=username, password='ebujugend')
            user.save()

    user_count = len(User.objects.filter(is_superuser=False))
    return render(request, 'users.html', context={'user_count': user_count})


def votes(request):
    all_ballots = Ballot.objects.all()
    election_count = len(all_ballots)
    context = {
       'election_count': election_count,
    }
    return render(request, 'votes.html', context)
