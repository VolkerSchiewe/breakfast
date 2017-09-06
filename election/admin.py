from PIL import Image as PilImage
from django.contrib import admin

from .models import Ballot, Candidate, SubElection, Election, Image, ElectionUser


def resize_images(modeladmin, request, queryset):
    basewidth = 160
    for election in queryset:
        for candidate in election.candidate_set.all():
            path = candidate.img.file.name
            img = PilImage.open(path)
            if basewidth in img.size:
                print("Already resized")
                continue
            wpercent = (basewidth / float(img.size[0]))
            hsize = int((float(img.size[1]) * float(wpercent)))
            img = img.resize((basewidth, hsize), PilImage.ANTIALIAS)
            img.save(path)


class CandidateAdmin(admin.StackedInline):
    model = Candidate
    extra = 0


class SubElectionAdmin(admin.ModelAdmin):
    model = SubElection
    inlines = [
        CandidateAdmin,
    ]
    actions = [resize_images]
    list_filter = ('election',)


admin.site.register(Ballot)
admin.site.register(SubElection, SubElectionAdmin)
admin.site.register(Election)
admin.site.register(Image)
admin.site.register(ElectionUser)
