from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    isAdmin = serializers.BooleanField(source='is_staff')

    class Meta:
        model = User
        fields = ('id', 'username', 'isAdmin')
