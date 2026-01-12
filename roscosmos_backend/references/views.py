from .models import Region, Specialization, Direction, Profession
from .serializers import (
    RegionSerializer,
    SpecializationSerializer,
    DirectionSerializer,
    ProfessionSerializer,
)
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response

from universities.models import University
from colleges.models import College
from companies.models import Company
from videos.models import MotivationalVideo


class BaseViewSet(viewsets.ModelViewSet):
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    ordering_fields = ["order", "name", "created_at"]
    ordering = ["order", "name"]
    search_fields = ["name", "description"]


class RegionViewSet(BaseViewSet):
    queryset = Region.objects.filter(is_active=True)
    serializer_class = RegionSerializer


class DirectionViewSet(BaseViewSet):
    queryset = Direction.objects.filter(is_active=True)
    serializer_class = DirectionSerializer


class SpecializationViewSet(BaseViewSet):
    queryset = Specialization.objects.filter(is_active=True).select_related("direction")
    serializer_class = SpecializationSerializer
    filterset_fields = ["direction"]


class ProfessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Profession.objects
        .filter(is_active=True)
        .select_related("direction")
    )
    serializer_class = ProfessionSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["name", "description"]
    ordering_fields = ["order", "name"]
    ordering = ["order", "name"]
    filterset_fields = {
        "direction_id": ["exact"],
    }


class StatisticsOverviewView(APIView):
    def get(self, request):
        return Response({
            "universities_count": University.objects.count(),
            "colleges_count": College.objects.count(),
            "companies_count": Company.objects.count(),
            "videos_count": MotivationalVideo.objects.count(),
            "directions_count": Direction.objects.count(),
        })
