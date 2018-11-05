from rest_framework import serializers

from election.models import Election


class ElectionSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source='active')
    voteCount = serializers.IntegerField(source='ballots_count', read_only=True)
    candidateNames = serializers.CharField(source='candidates_sorted', read_only=True)

    class Meta:
        model = Election
        fields = ('id', 'title', 'isActive', 'candidateNames', 'voteCount', 'codes')
