from django.utils.translation import ugettext as _
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.serializers.election import ElectionSerializer
from election.models import Election, Candidate
from election.models.state import ElectionState


class ElectionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ('pk',)

    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAdminUser])
    def create_election(self, request):
        title = request.data.get('title')
        number_of_codes = request.data.get('number')
        if not number_of_codes or not title:
            return Response(_('Title or Number missing'), status.HTTP_400_BAD_REQUEST)
        try:
            number_of_codes = int(number_of_codes)
        except ValueError:
            return Response(_('Number must be integer'), status.HTTP_400_BAD_REQUEST)

        election = Election.objects.create(title=title)
        election.create_users(int(number_of_codes))
        return Response("")

    @action(methods=['post'], detail=True, permission_classes=[permissions.IsAdminUser])
    def set_active(self, request, pk):
        election = Election.objects.get(pk=pk)
        if election.state == ElectionState.ACTIVE:
            election.state = ElectionState.NOT_ACTIVE
            election.save()
        else:
            Election.objects.filter(state=ElectionState.ACTIVE).update(state=ElectionState.NOT_ACTIVE)
            election.state = ElectionState.CLOSED if election.state == ElectionState.CLOSED else ElectionState.ACTIVE
            election.save()
        return Response("")

    @action(methods=['post'], detail=True, permission_classes=[permissions.IsAdminUser])
    def close(self, request, pk):
        election = Election.objects.get(pk=pk)
        for candidate in Candidate.objects.filter(sub_election__election=election):
            candidate.saved_votes = candidate.ballot_set.count()
            candidate.save()
        election.electionuser_set.all().delete()
        election.state = ElectionState.CLOSED
        election.save()
        return Response('')

    @action(methods=['get'], detail=True, permission_classes=[permissions.IsAdminUser])
    def codes(self, request, pk):
        election = Election.objects.get(pk=pk)
        return Response({
            "title": election.title,
            "codes": election.electionuser_set.values_list('user__username', flat=True),
        })
