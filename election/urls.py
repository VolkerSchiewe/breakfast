from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    # /elections
    url(r'^$', login_required(views.ElectionView.as_view()), name='election'),
    url(r'^login$', views.LoginView.as_view(), name='login'),
    # url(r'^election$', views.election, name='election'),
    url(r'^votes$', views.votes, name='votes'),
    url(r'^results$', views.results, name='results'),
    # creating users
    url(r'^users$', views.create_users, name='users'),
    url(r'^get_image/(?P<user_id>\d+)$', views.get_image, name='get_image')
]
