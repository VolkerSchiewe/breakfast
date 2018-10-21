from knox.views import LoginView as KnoxLoginView
from rest_framework.authentication import BasicAuthentication


class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
#
# class LoginView(generics.GenericAPIView):
#     serializer_class = LoginUserSerializer
#
#     def post(self, request, format=None):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data
#         return Response({
#             "user": {"username": user.username, "isAdmin": user.is_staff},
#             "token": AuthToken.objects.create(user)
#         })
