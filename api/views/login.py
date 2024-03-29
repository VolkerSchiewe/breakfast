from django.contrib.auth import login, logout
from django.utils.translation import gettext as _
from rest_framework import permissions, status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

from election.models import Election
from election.models.state import ElectionState


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = AuthTokenSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            if not user.is_staff:
                # check if user can login or not
                if not Election.objects.filter(state=ElectionState.ACTIVE).exists():
                    return Response(_('No active Election!'), status.HTTP_400_BAD_REQUEST)
                if user.electionuser.election != Election.objects.get(state=ElectionState.ACTIVE):
                    return Response(_('Wrong Code!'), status.HTTP_401_UNAUTHORIZED)
                if user.electionuser.already_elected():
                    return Response(_('Already voted!'), status.HTTP_400_BAD_REQUEST)
            login(request, user)
            return Response({"user": {"id": user.id, "username": user.username, "isAdmin": user.is_staff}})
        else:
            return Response(_('Wrong credentials'), status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logout(request)
        return Response()
