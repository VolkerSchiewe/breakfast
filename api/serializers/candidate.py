from rest_framework import serializers

from election.models import Candidate


class CandidateSerializer(serializers.ModelSerializer):
    votes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Candidate
        fields = ('id', 'sub_election', 'name', 'votes')
