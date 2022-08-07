from django.urls import re_path

from . import views

urlpatterns = [
    # /elections
    re_path(r'^$', views.react),
    re_path(r'^elections/$', views.react),
    re_path(r'^login/$', views.react),
    re_path(r'^elections/(?P<id>\d+)/$', views.react),
    re_path(r'^elections/(?P<id>\d+)/codes/$', views.react),
]
