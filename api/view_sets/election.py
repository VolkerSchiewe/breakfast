from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from election.models import Election
from api.serializers.election import ElectionSerializer


class ElectionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ('pk',)

    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAdminUser])
    def create_election(self, request):
        title = request.data.get('title')
        number_of_codes = int(request.data.get('number'))
        if not number_of_codes:
            raise ValidationError('Title or Number missing')
        election = Election.objects.create(title=title)
        election.create_users(number_of_codes)
        return Response('Created!')

    @action(methods=['post'], detail=True, permission_classes=[permissions.IsAdminUser])
    def set_active(self, request, pk):
        election = Election.objects.get(pk=pk)
        if election.active:
            election.active = False
            election.save()
        else:
            Election.objects.filter(active=True).update(active=False)
            Election.objects.filter(pk=pk).update(active=True)
        return Response('done')
