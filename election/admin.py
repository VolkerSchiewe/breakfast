from django.contrib import admin

from .models import Ballot, Candidate, SubElection


class CandidateAdmin(admin.StackedInline):
    model = Candidate
    extra = 0


class SubElectionAdmin(admin.ModelAdmin):
    model = SubElection
    inlines = [
        CandidateAdmin,
    ]


admin.site.register(Ballot)
admin.site.register(SubElection, SubElectionAdmin)
