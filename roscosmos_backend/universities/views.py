from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import University
from .serializers import UniversitySerializer

class UniversityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UniversitySerializer
    queryset = University.objects.select_related("region").prefetch_related(
        'specializations', 'partner_companies', 'intern_positions',
        'entry_positions', 'advanced_positions', 'related_videos',
    )

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "region__slug": ["exact"],
        "region__name": ["icontains"],
    }
    search_fields = ["name", "city"]
    ordering_fields = ["name", "city"]
    ordering = ["name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__slug=region)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) | models.Q(city__icontains=search)
            )
        return queryset
