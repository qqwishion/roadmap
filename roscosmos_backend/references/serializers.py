from rest_framework import serializers
from .models import Region, Specialization, Direction, Profession, Position


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = [
            "id", "name", "slug", "order", "is_active",
            "created_at", "updated_at"
        ]


class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = [
            "id", "name", "slug", "description",
            "icon_name", "subjects", "recommendation",
            "order", "is_active", "created_at", "updated_at"
        ]


class SpecializationSerializer(serializers.ModelSerializer):
    direction_id = serializers.IntegerField(source="direction.id", read_only=True)
    direction_name = serializers.CharField(source="direction.name", read_only=True)

    class Meta:
        model = Specialization
        fields = [
            "id", "name", "slug", "description",
            "direction_id", "direction_name",
            "order", "is_active", "created_at", "updated_at"
        ]


class ProfessionSerializer(serializers.ModelSerializer):
    direction_name = serializers.CharField(source="direction.name", read_only=True)

    class Meta:
        model = Profession
        fields = [
            "id", "name", "slug",
            "direction_id", "direction_name",
            "description", "requirements", "skills",
            "salary_range", "demand_level",
            "order", "is_active",
            "created_at", "updated_at"
        ]


class PositionSerializer(serializers.ModelSerializer):
    support_measures = serializers.ListField(read_only=True)

    class Meta:
        model = Position
        fields = ["id", "title", "support_measures"]
