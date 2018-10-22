from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView
from rest_framework import permissions, status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return super(LoginView, self).post(request, format=None)
        else:
            return Response('Wrong credentials', status.HTTP_401_UNAUTHORIZED)
