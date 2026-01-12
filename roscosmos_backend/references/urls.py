from django.urls import path
from .views import StatisticsOverviewView

urlpatterns = [
    path("statistics/overview/", StatisticsOverviewView.as_view()),
]