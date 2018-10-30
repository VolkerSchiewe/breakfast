from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

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

    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def vote(self, request):
        election = Election.objects.get(active=True)
        election_user = request.user.electionuser
        if election.subelection_set.count() != len(request.data.keys()):
            raise Exception('Not all selected')
        for key in request.data:
            candidate = Candidate.objects.get(pk=request.data[key])
            Ballot.objects.create(user=election_user, choice=candidate)

        return Response('')
