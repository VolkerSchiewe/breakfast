from django.conf.urls import url
from . import views

urlpatterns = [
    # /elections
    url(r'^$', views.login_view, name='login'),
    url(r'^election$', views.election, name='election'),
    url(r'^votes$', views.votes, name='votes'),
    url(r'^results$', views.results, name='results'),
    # creating users
    url(r'^users$', views.create_users, name='users'),
]
