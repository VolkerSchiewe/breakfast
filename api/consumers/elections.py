from asgiref.sync import async_to_sync
from channels import layers
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.renderers import JSONRenderer

from api.serializers.election import ElectionSerializer
from election.models import Election

ROOM_NAME = 'elections'


class ElectionConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = ""

    async def connect(self):
        self.room_group_name = ROOM_NAME

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(ROOM_NAME, {
            'type': 'election_list',
        })

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from room group
    async def election_list(self, event):
        serializer = ElectionSerializer(Election.objects.all().order_by('pk'), many=True)
        data = JSONRenderer().render(serializer.data)
        await self.send(text_data=data.decode('utf-8'))


@receiver(post_save, sender=Election)
def on_election_save(sender, instance, **kwargs):
    channel_layer = layers.get_channel_layer()
    async_to_sync(channel_layer.group_send)(ROOM_NAME, {
        'type': 'election_list',
    })
