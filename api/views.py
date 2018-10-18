from knox.models import AuthToken

from rest_framework import generics

from rest_framework.response import Response

from api.serializers.user import LoginUserSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": {"username": user.username},
            "token": AuthToken.objects.create(user)
        })
