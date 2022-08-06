from django.conf.urls import url

from api.consumers.elections_sync import ElectionConsumer
from api.consumers.sub_elections_sync import SubElectionConsumer

websocket_urlpatterns = [
    url(r'^elections$', ElectionConsumer.as_asgi()),
    url(r'^elections/(?P<election_id>[^/]+)$', SubElectionConsumer.as_asgi()),
]
