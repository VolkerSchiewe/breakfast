from channels.generic.websocket import AsyncWebsocketConsumer
import json

from election.models import Election


class ElectionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.election_id = self.scope['url_route']['kwargs']['election_id']
        self.room_group_name = 'election_%s' % self.election_id

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        election = Election.objects.get(pk=self.election_id)
        await election.send_results()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from room group
    async def election_result(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
