from django.db import models
from django.db import models
import uuid


class MotivationalVideo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)

    # URL видео
    url = models.URLField()

    # Превью
    preview_url = models.URLField(blank=True)

    # Категория
    category = models.CharField(max_length=100, blank=True)

    # Теги
    tags = models.JSONField(default=list, blank=True)


    order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title
