from rest_framework import viewsets

from election.models import SubElection
from api.serializers.subelection import SubElectionSerializer


class SubElectionViewSet(viewsets.ModelViewSet):
    queryset = SubElection.objects.all()
    serializer_class = SubElectionSerializer
