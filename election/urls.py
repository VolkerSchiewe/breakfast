from django.conf.urls import url

from . import views

urlpatterns = [
    # /elections
    url(r'^$', views.react),
    url(r'^elections/$', views.react),
    url(r'^login/$', views.react),
    url(r'^elections/(?P<id>\d+)/$', views.react),
    url(r'^elections/(?P<id>\d+)/codes/$', views.react),
]
