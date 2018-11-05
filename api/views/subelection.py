from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import ugettext as _

from election.models import SubElection, Ballot, Candidate, Election
from api.serializers.subelection import SubElectionSerializer


class SubElectionViewSet(viewsets.ModelViewSet):
    queryset = SubElection.objects.all()
    serializer_class = SubElectionSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('election',)

    def get_queryset(self):
        if self.request.user.is_staff:
            return SubElection.objects.all()
        else:
            return SubElection.objects.filter(election__active=True)

    @transaction.atomic
    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def vote(self, request):
        active_election = Election.objects.get(active=True)
        election_user = request.user.electionuser

        validate_data(election_user, active_election, request.data)

        for key in request.data:
            candidate = Candidate.objects.get(pk=request.data[key])
            ballot, created = Ballot.objects.get_or_create(user=election_user, choice=candidate)
            if not created:
                raise Exception(_("This ballot already exists. Please contact the election board."))
        return Response('')


def validate_data(user, active_election, data):
    if active_election != user.election:
        raise AttributeError(_('User is not part of the active election'))
    if active_election.subelection_set.count() != len(data.keys()):
        raise AttributeError(_('Number of votes must match the number of sub_elections'))
