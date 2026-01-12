from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import MotivationalVideo
from .serializers import VideoSerializer

class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MotivationalVideo.objects.all()
    serializer_class = VideoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Поля для фильтрации через query params
    filterset_fields = ["category"]

    # Поля для поиска
    search_fields = ["title", "description", "tags"]

    # Сортировка
    ordering_fields = ["order", "created_at", "updated_at"]
    ordering = ["order", "-created_at"]