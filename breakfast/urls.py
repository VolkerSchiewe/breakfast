from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # open elections on index site
    url(r'^', include('election.urls')),
    # admin side
    url(r'^admin/', admin.site.urls),
]
