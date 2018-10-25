from rest_framework import serializers

from api.serializers.image import ImageSerializer
from election.models import Candidate, SubElection, Image


class CandidateSerializer(serializers.ModelSerializer):
    votes = serializers.IntegerField(read_only=True)
    subElection = serializers.PrimaryKeyRelatedField(source='sub_election', queryset=SubElection.objects.all())
    image = ImageSerializer(allow_null=True)

    class Meta:
        model = Candidate
        fields = ('id', 'subElection', 'name', 'votes', 'image')

    def create(self, validated_data):
        image_dict = validated_data.get('image')
        image = Image.objects.create(name=image_dict.get('name'), file=image_dict.get('file')) if image_dict else None
        return Candidate.objects.create(sub_election=validated_data.get('sub_election'),
                                        name=validated_data.get('name'), image=image)

    def update(self, instance, validated_data):
        name = validated_data.get('name')
        if name:
            instance.name = name
        image_dict = validated_data.get('image')
        if image_dict:
            image_file = image_dict.get('file')
            image_name = image_dict.get('name')
            if not instance.image:
                image = Image.objects.create(name=image_name, file=image_file)
                instance.image = image
            else:
                if image_file:
                    instance.image.file = image_file
                if image_name:
                    instance.image.name = image_name
            instance.image.save()
        elif instance.image:
            instance.image.delete()
            instance.image = None
        instance.save()
        return instance
