from rest_framework import serializers
from .models import CareerPath, CareerPathStep
from references.serializers import PositionSerializer


class CareerPathStepSerializer(serializers.ModelSerializer):
    stepType = serializers.CharField(source="step_type")
    positions = PositionSerializer(many=True, read_only=True)

    class Meta:
        model = CareerPathStep
        fields = (
            "step",
            "stepType",
            "title",
            "description",
            "positions",
        )


class CareerPathSerializer(serializers.ModelSerializer):
    # --- простые поля ---
    direction = serializers.CharField(
        source="direction.name",
        allow_null=True,
        required=False,
    )

    educationLevel = serializers.CharField(
        source="education_level",
        allow_blank=True,
        required=False,
    )

    institutionType = serializers.CharField(
        source="institution_type",
        allow_blank=True,
        required=False,
    )

    careerGoal = serializers.CharField(
        source="career_goal",
        allow_blank=True,
        required=False,
    )

    # --- шаги (на будущее, НЕ используются фронтом) ---
    steps = CareerPathStepSerializer(many=True, read_only=True)

    # --- АДАПТАЦИЯ ПОД UI ---
    university = serializers.SerializerMethodField()
    internship = serializers.SerializerMethodField()
    entryPositions = serializers.SerializerMethodField()
    advancedPositions = serializers.SerializerMethodField()

    class Meta:
        model = CareerPath
        fields = (
            "id",
            "title",
            "description",
            "duration",
            "difficulty",
            "educationLevel",
            "institutionType",
            "direction",
            "careerGoal",
            "achievements",

            # адаптированные поля
            "university",
            "internship",
            "entryPositions",
            "advancedPositions",

            # raw-данные
            "steps",

            "created_at",
            "updated_at",
            "is_active",
        )

    # ------------------------------------------------------------------
    # ОБРАЗОВАНИЕ
    # ------------------------------------------------------------------
    def get_university(self, obj):
        step = obj.steps.filter(step_type="education").first()
        if not step:
            return None

        university = step.universities.first()
        if not university:
            return None

        return {
            "name": university.name,
            "specializations": [
                s.name for s in university.specializations.all()
            ],
        }

    # ------------------------------------------------------------------
    # СТАЖИРОВКИ
    # ------------------------------------------------------------------
    def get_internship(self, obj):
        result = []

        steps = obj.steps.filter(step_type="internship")
        for step in steps:
            for company in step.companies.all():
                for position in step.positions.all():
                    result.append({
                        "company": company.name,
                        "position": position.title,
                        "supportMeasures": position.support_measures or [],
                    })

        return result

    # ------------------------------------------------------------------
    # НАЧАЛЬНЫЕ ПОЗИЦИИ
    # ------------------------------------------------------------------
    def get_entryPositions(self, obj):
        result = []

        steps = obj.steps.filter(step_type="junior")
        for step in steps:
            for company in step.companies.all():
                for position in step.positions.all():
                    result.append({
                        "company": company.name,
                        "position": position.title,
                        "supportMeasures": position.support_measures or [],
                    })

        return result

    # ------------------------------------------------------------------
    # КАРЬЕРНЫЙ РОСТ
    # ------------------------------------------------------------------
    def get_advancedPositions(self, obj):
        result = []

        steps = obj.steps.filter(step_type="career")
        for step in steps:
            for position in step.positions.all():
                result.append({
                    "position": position.title,
                    "supportMeasures": position.support_measures or [],
                })

        return result
