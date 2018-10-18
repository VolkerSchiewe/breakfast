from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from election.models import Election
from api.serializers.election import ElectionSerializer


class ElectionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAdminUser])
    def create_election(self, request):
        title = request.data.get('title')
        number_of_codes = int(request.data.get('number'))
        if not number_of_codes:
            raise ValidationError('Title or Number missing')
        election = Election.objects.create(title=title)
        election.create_users(number_of_codes)
        return Response('Created!')
