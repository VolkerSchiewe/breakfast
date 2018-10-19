from django.db import models


class Ballot(models.Model):
    user = models.ForeignKey('ElectionUser', on_delete=models.CASCADE)
    choice = models.ForeignKey('Candidate', on_delete=models.CASCADE, default=0)

    def __str__(self):
        return self.user.user.username
