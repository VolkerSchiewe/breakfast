from django.shortcuts import render


def react(request, id=None):
    return render(request, 'react.html')
