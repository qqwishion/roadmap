from rest_framework import serializers
from .models import MotivationalVideo

class VideoSerializer(serializers.ModelSerializer):
    video_url = serializers.URLField(source='url') 

    class Meta:
        model = MotivationalVideo
        fields = [
            "id",
            "title",
            "description",
            "video_url",
            "preview_url",
            "category",
            "tags",
            "order",
            "created_at",
            "updated_at",
        ]