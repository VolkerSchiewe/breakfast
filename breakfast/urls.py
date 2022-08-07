from django.conf.urls import include
from django.contrib import admin
from django.urls import re_path

urlpatterns = [
    # open elections on index site
    re_path(r'^api/', include('api.urls')),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^', include('election.urls')),
]
