from rest_framework import serializers

from api.serializers.subelection import SubElectionListSerializer
from election.models import Election


class ElectionSerializer(serializers.ModelSerializer):
    voteCount = serializers.IntegerField(source='votes_count', read_only=True)
    candidateNames = SubElectionListSerializer(source='subelection_set', read_only=True, many=True)

    class Meta:
        model = Election
        fields = ('id', 'title', 'state', 'candidateNames', 'voteCount', 'codes')
