from rest_framework import serializers
from .models import University, Position
from videos.models import MotivationalVideo

class PositionSerializer(serializers.ModelSerializer):
    supportMeasures = serializers.ListField(source='support_measures', read_only=True)

    class Meta:
        model = Position
        fields = ['title', 'supportMeasures']

class UniversitySerializer(serializers.ModelSerializer):
    region = serializers.SlugRelatedField(slug_field='slug', read_only=True)
    specializations = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    partnerCompanies = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', source='partner_companies')
    internPositions = PositionSerializer(source='intern_positions', many=True)
    entryPositions = PositionSerializer(source='entry_positions', many=True)
    advancedPositions = PositionSerializer(source='advanced_positions', many=True)
    related_videos = serializers.SlugRelatedField(many=True, read_only=True, slug_field='id')
    pathAfter9 = serializers.CharField(source='path_after_9')
    pathAfter11 = serializers.CharField(source='path_after_11')

    class Meta:
        model = University
        fields = (
            "id", "name", "city", "region", "specializations",
            "pathAfter9", "pathAfter11", "partnerCompanies",
            "internPositions", "entryPositions", "advancedPositions",
            "site", "description", "has_advanced_engineering_school",
            "advanced_engineering_school_info", "video_url",
            "video_title", "video_description", "related_videos",
            "contacts"
        )
