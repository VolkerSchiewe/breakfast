import PIL
from PIL import Image
from django.contrib import admin

from .models import Ballot, Candidate, SubElection


def resize_images(modeladmin, request, queryset):
    basewidth = 160
    for election in queryset:
        for candidate in election.candidate_set.all():
            path = candidate.img.file.name
            img = Image.open(path)
            if basewidth in img.size:
                print("Already resized")
                continue
            wpercent = (basewidth / float(img.size[0]))
            hsize = int((float(img.size[1]) * float(wpercent)))
            img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)
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


admin.site.register(Ballot)
admin.site.register(SubElection, SubElectionAdmin)
