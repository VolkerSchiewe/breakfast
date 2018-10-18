from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^elections/(?P<election_id>[^/]+)$', consumers.ElectionConsumer),
    url(r'^elections$', consumers.ElectionListConsumer),
]
