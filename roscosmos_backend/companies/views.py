from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company
from .serializers import CompanySerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.select_related("region").prefetch_related(
        'specializations', 'partner_education',
        'intern_positions', 'entry_positions',
        'advanced_positions', 'related_videos'
    )
    serializer_class = CompanySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'description']
    ordering_fields = ['name', 'city']
    ordering = ['name']

    def get_queryset(self):
        queryset = super().get_queryset()
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__slug=region)

        specialization = self.request.query_params.get('specialization')
        if specialization:
            queryset = queryset.filter(specializations__slug=specialization)

        has_base_department = self.request.query_params.get('has_base_department')
        if has_base_department == 'true':
            queryset = queryset.filter(has_base_department=True)

        return queryset
