from django.conf.urls import url

from . import views

urlpatterns = [
    # /elections
    url(r'^get_candidate_image/(?P<candidate_id>\d+)$', views.get_candidate_image, name='get_candidate_image'),
    url(r'^$', views.home, name='home'),
    url(r'^login/$', views.home, name='home'),
    url(r'^elections/(?P<id>\d+)$', views.home, name='home'),
]
