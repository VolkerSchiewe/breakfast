from rest_framework import serializers

from election.models import SubElection
from api.serializers.candidate import CandidateSerializer


class SubElectionSerializer(serializers.ModelSerializer):
    isMultiSelect = serializers.BooleanField(source='is_multi_selectable')
    candidates = CandidateSerializer(source='candidate_set', many=True, read_only=True)

    class Meta:
        model = SubElection
        fields = ('id', 'election', 'title', 'isMultiSelect', 'candidates')
