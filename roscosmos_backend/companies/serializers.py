from rest_framework import serializers
from .models import Company, Position

class PositionSerializer(serializers.ModelSerializer):
    supportMeasures = serializers.ListField(source='support_measures', read_only=True)

    class Meta:
        model = Position
        fields = ['title', 'supportMeasures']

class CompanySerializer(serializers.ModelSerializer):
    region = serializers.SlugRelatedField(slug_field='slug', read_only=True)
    specializations = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    partnerEducation = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', source='partner_education')
    internPositions = PositionSerializer(source='intern_positions', many=True)
    entryPositions = PositionSerializer(source='entry_positions', many=True)
    advancedPositions = PositionSerializer(source='advanced_positions', many=True)
    related_videos = serializers.SlugRelatedField(many=True, read_only=True, slug_field='id')

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'city', 'region', 'specializations',
            'partnerEducation', 'internPositions', 'entryPositions',
            'advancedPositions', 'site', 'description',
            'has_base_department', 'base_department_name',
            'video_url', 'video_title', 'video_description', 'related_videos',
            'contacts'
        ]
