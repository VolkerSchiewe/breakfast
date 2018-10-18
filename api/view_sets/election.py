from rest_framework import viewsets, permissions

from election.models import Election
from api.serializers.election import ElectionSerializer


class ElectionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
