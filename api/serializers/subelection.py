from rest_framework import serializers

from api.serializers.candidate import CandidateSerializer
from election.models import SubElection


class SubElectionSerializer(serializers.ModelSerializer):
    isMultiSelect = serializers.BooleanField(source='is_multi_selectable', read_only=True)
    candidates = CandidateSerializer(source='candidate_set', many=True, read_only=True)

    class Meta:
        model = SubElection
        fields = ('id', 'election', 'title', 'isMultiSelect', 'candidates')


class SubElectionListSerializer(serializers.ModelSerializer):
    names = serializers.SlugRelatedField(source='candidate_set', slug_field='name', many=True, read_only=True)

    class Meta:
        model = SubElection
        fields = ('title', 'names')
