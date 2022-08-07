from django.urls import re_path

from api.consumers.elections_sync import ElectionConsumer
from api.consumers.sub_elections_sync import SubElectionConsumer

websocket_urlpatterns = [
    re_path(r'^elections$', ElectionConsumer.as_asgi()),
    re_path(r'^elections/(?P<election_id>[^/]+)$', SubElectionConsumer.as_asgi()),
]
