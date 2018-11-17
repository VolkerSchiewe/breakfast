from rest_framework import serializers

from election.models import Election


class ElectionSerializer(serializers.ModelSerializer):
    voteCount = serializers.IntegerField(source='ballots_count', read_only=True)
    candidateNames = serializers.CharField(source='candidates_sorted', read_only=True)

    class Meta:
        model = Election
        fields = ('id', 'title', 'state', 'candidateNames', 'voteCount', 'codes')
