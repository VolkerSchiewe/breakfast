from django.contrib import admin

from .models import Ballot, Candidate, SubElection, Election, Image, ElectionUser


class CandidateAdmin(admin.StackedInline):
    model = Candidate
    extra = 0


class SubElectionAdmin(admin.ModelAdmin):
    model = SubElection
    inlines = [
        CandidateAdmin,
    ]
    list_filter = ('election',)


admin.site.register(Ballot)
admin.site.register(SubElection, SubElectionAdmin)
admin.site.register(Election)
admin.site.register(Image)
admin.site.register(ElectionUser)
