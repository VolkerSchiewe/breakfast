from django.urls import include, re_path
from rest_framework.routers import DefaultRouter

from api.views.candidate import CandidateViewSet
from api.views.election import ElectionViewSet
from api.views.login import LoginView, LogoutView
from api.views.subelection import SubElectionViewSet

router = DefaultRouter()
router.register(r'elections', ElectionViewSet)
router.register(r'subelections', SubElectionViewSet)
router.register(r'candidates', CandidateViewSet)

urlpatterns = [
    # /api
    re_path('^', include(router.urls)),
    re_path('^login/$', LoginView.as_view()),
    re_path('^logout/$', LogoutView.as_view()),
]
