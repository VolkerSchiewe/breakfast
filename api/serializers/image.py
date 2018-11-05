from rest_framework import serializers

from api.fields import Base64StringField
from election.models import Image


class ImageSerializer(serializers.ModelSerializer):
    base64Image = Base64StringField(source='file', allow_null=True)

    class Meta:
        model = Image
        fields = ('id', 'base64Image', 'name')
