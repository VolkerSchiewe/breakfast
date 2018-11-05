from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # open elections on index site
    url(r'^api/', include('api.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/auth/', include('knox.urls')),
    url(r'^', include('election.urls')),
]
