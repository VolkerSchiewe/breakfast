from django.conf.urls import url
from django.urls import include
from rest_framework.routers import DefaultRouter

from api.views.candidate import CandidateViewSet
from api.views.election import ElectionViewSet
from api.views.login import LoginView
from api.views.subelection import SubElectionViewSet

router = DefaultRouter()
router.register(r'elections', ElectionViewSet)
router.register(r'subelections', SubElectionViewSet)
router.register(r'candidates', CandidateViewSet)

urlpatterns = [
    # /api
    url('^', include(router.urls)),
    url('^login/$', LoginView.as_view()),
]
