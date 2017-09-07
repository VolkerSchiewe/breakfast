from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    # /elections
    url(r'^$', views.home, name='home'),
    url(r'^election$', login_required(views.ElectionView.as_view()), name='election'),
    url(r'^login$', views.login, name='login'),

    url(r'^results/(?P<election_id>\d+)$', views.results, name='results'),
    url(r'^elections$', views.election_list, name='elections_list'),
    url(r'^elections/create$', views.create_election, name='create_election'),
    url(r'^elections/(?P<election_id>\d+)', views.edit_election, name='edit_election'),
    url(r'^elections/(?P<election_id>\d+)/activate$', views.toggle_active_election, name='activate_election'),

    url(r'^get_image/(?P<image_id>\d+)$', views.get_image, name='get_image')
]
