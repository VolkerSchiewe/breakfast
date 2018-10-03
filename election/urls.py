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
    url(r'^elections/clone', views.clone_election, name='clone_election'),
    url(r'^elections/(?P<election_id>\d+)$', views.edit_election, name='edit_election'),
    url(r'^elections/(?P<election_id>\d+)/codes$', views.get_user_codes, name='get_user_codes'),
    url(r'^elections/(?P<election_id>\d+)/activate$', views.toggle_active_election, name='activate_election'),
    url(r'^elections/(?P<election_id>\d+)/subelection/(?P<subelection_id>\d+)/edit$', views.edit_subelection,
        name='edit_subelection'),
    url(r'^candidates/(?P<candidate_id>\d+)/edit$', views.edit_candidate, name='edit_candidate'),

    url(r'^get_candidate_image/(?P<candidate_id>\d+)$', views.get_candidate_image, name='get_candidate_image'),
]
