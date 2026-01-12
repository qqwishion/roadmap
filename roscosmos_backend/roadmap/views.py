# roadmap/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CareerPath
from .serializers import CareerPathSerializer


class CareerPathViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        CareerPath.objects
        .prefetch_related(
            "steps",
            "steps__universities",
            "steps__colleges",
            "steps__companies",
            "steps__positions",
        )
        .filter(is_active=True)
    )
    serializer_class = CareerPathSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = ["title", "description"]
    ordering_fields = ["title", "created_at"]
    ordering = ["title"]

    filterset_fields = {
        "direction_id": ["exact"],
        "education_level": ["exact"],
        "institution_type": ["exact"],
    }
