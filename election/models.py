from django.db import models


class Ballot(models.Model):
    personCode = models.CharField(max_length=100)
    ptChoose = models.IntegerField()
    aejChoose = models.IntegerField()

    # toString method
    def __str__(self):
        return self.personCode


class Candidate(models.Model):
    name = models.CharField(max_length=250)
    election_type = models.IntegerField()
    result = models.IntegerField(default=0)

    # toString method
    def __str__(self):
        return self.name
