from django.db import transaction
from django.utils.translation import ugettext as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from api.serializers.subelection import SubElectionSerializer
from election.models import SubElection, Ballot, Candidate, Election
from election.models.state import ElectionState


class SubElectionViewSet(viewsets.ModelViewSet):
    queryset = SubElection.objects.all()
    serializer_class = SubElectionSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('election',)
    ordering = ('pk',)

    def get_queryset(self):
        if self.request.user.is_staff:
            return SubElection.objects.all()
        else:
            return SubElection.objects.filter(election__state=ElectionState.ACTIVE)

    @transaction.atomic
    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def vote(self, request):
        active_election = Election.objects.filter(state=ElectionState.ACTIVE).first()
        election_user = request.user.electionuser

        if not active_election:
            return Response(_('This election is not active anymore.'), status.HTTP_400_BAD_REQUEST)
        if active_election != election_user.election:
            return Response(_('User is not part of the active election'), status.HTTP_400_BAD_REQUEST)
        if active_election.subelection_set.count() != len(request.data.keys()):
            return Response(_('Number of votes must match the number of sub_elections'), status.HTTP_400_BAD_REQUEST)

        for key in request.data:
            candidate = Candidate.objects.get(pk=request.data[key])
            ballot, created = Ballot.objects.get_or_create(user=election_user, choice=candidate)
            if not created:
                return Response(_("This ballot already exists. Please contact the election board."),
                                status.HTTP_400_BAD_REQUEST)
        return Response('')
