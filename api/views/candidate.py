from rest_framework import viewsets

from election.models import Candidate
from api.serializers.candidate import CandidateSerializer


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
