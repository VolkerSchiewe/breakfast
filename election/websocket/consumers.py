import logging

from channels.auth import channel_session_user_from_http, channel_session_user

from election.models import Election

log = logging.getLogger(__name__)


@channel_session_user_from_http
def ws_connect(message):
    log.debug(message)
    if not message.user.is_staff:
        message.reply_channel.send({'accept': False})
    message.reply_channel.send({'accept': True})
    message.channel_session['elections'] = []

    election = Election.objects.get(active=True)
    election.websocket_group.add(message.reply_channel)
    election.send_results()


def ws_receive(message):
    log.debug(message)


@channel_session_user
def ws_disconnect(message):
    for election_id in message.channel_session.get("elections", set()):
        try:
            room = Election.objects.get(pk=election_id)
            room.websocket_group.discard(message.reply_channel)
        except Election.DoesNotExist:
            pass
