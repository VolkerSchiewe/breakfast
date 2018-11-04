from asgiref.sync import async_to_sync
from channels import layers
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from rest_framework.renderers import JSONRenderer

from api.serializers.subelection import SubElectionSerializer
from election.models import SubElection, Candidate, Ballot


class SubElectionConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = ""
        self.election_id = ""

    async def connect(self):
        self.election_id = self.scope['url_route']['kwargs']['election_id']
        self.room_group_name = "elections_%s" % self.election_id

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        if not self.scope.get('user').is_staff:
            await self.close()
            return

        # accept connection
        await self.accept()

        # send initial data
        await self.channel_layer.group_send("elections_%s" % self.election_id, {
            'type': 'sub_election_list',
        })

    async def receive(self, text_data=None, bytes_data=None):
        await self.channel_layer.group_send("elections_%s" % self.election_id, {
            'type': 'sub_election_list',
        })

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from room group
    async def sub_election_list(self, event):
        serializer = SubElectionSerializer(SubElection.objects.filter(election__pk=self.election_id).order_by('pk'),
                                           many=True)
        data = JSONRenderer().render(serializer.data)

        # send data to subscribers
        await self.send(text_data=data.decode('utf-8'))


@receiver(post_save, sender=Ballot)
@receiver(post_save, sender=SubElection)
@receiver(post_delete, sender=SubElection)
@receiver(post_delete, sender=Candidate)
@receiver(post_save, sender=Candidate)
def on_sub_election_save(sender, instance, **kwargs):
    if isinstance(instance, SubElection):
        election_id = instance.election.id
    elif isinstance(instance, Candidate):
        election_id = instance.sub_election.election.id
    elif isinstance(instance, Ballot):
        election_id = instance.user.election.id
    else:
        raise Exception('Wrong instance type')

    channel_layer = layers.get_channel_layer()
    async_to_sync(channel_layer.group_send)("elections_%s" % election_id, {
        'type': 'sub_election_list',
    })
