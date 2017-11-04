release: python manage.py migrate
web: daphne breakfast.asgi:channel_layer
worker: python manage.py runworker