from django.contrib import admin
from .models import Ballot, Candidate

admin.site.register(Ballot)
admin.site.register(Candidate)
