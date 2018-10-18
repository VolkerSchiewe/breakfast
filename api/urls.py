from django.conf.urls import url
from django.urls import include
from rest_framework.routers import DefaultRouter

from api.view_sets.candidate import CandidateViewSet
from api.view_sets.election import ElectionViewSet
from api.view_sets.subelection import SubElectionViewSet
from api.views import LoginView

router = DefaultRouter()
router.register(r'elections', ElectionViewSet)
router.register(r'subelections', SubElectionViewSet)
router.register(r'candidates', CandidateViewSet)

urlpatterns = [
    # /api
    url('^', include(router.urls)),
    url('^login/$', LoginView.as_view()),
]
