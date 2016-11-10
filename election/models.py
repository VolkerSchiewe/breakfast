from django.db import models


class SubElection(models.Model):
    title = models.CharField(max_length=100)
    short = models.CharField(max_length=10, default="")

    # toString method
    def __str__(self):
        return self.title


class Candidate(models.Model):
    sub_election = models.ForeignKey(SubElection, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)
    result = models.IntegerField(default=0)

    # toString method
    def __str__(self):
        return str(self.sub_election) + ' - ' + str(self.name)


class Ballot(models.Model):
    personCode = models.CharField(max_length=100)
    choice = models.ForeignKey(Candidate, on_delete=models.CASCADE, default=0)

    # toString method
    def __str__(self):
        return self.personCode
