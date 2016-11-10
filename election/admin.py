from django.contrib import admin
from .models import Ballot, Candidate, SubElection

admin.site.register(Ballot)
admin.site.register(Candidate)
admin.site.register(SubElection)
