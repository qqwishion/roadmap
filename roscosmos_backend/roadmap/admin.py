from django.contrib import admin
from .models import CareerPath, CareerPathStep


class CareerPathStepInline(admin.StackedInline):
    model = CareerPathStep
    extra = 0
    ordering = ("step",)

    fieldsets = (
        ("Шаг траектории", {
            "fields": ("step", "step_type", "title", "description"),
        }),
        ("Образование (только для типа «Образование»)", {
            "fields": ("universities", "colleges"),
            "classes": ("collapse",),
        }),
        ("Работа / стажировка", {
            "fields": ("companies", "positions"),
            "classes": ("collapse",),
        }),
    )

    filter_horizontal = (
        "universities",
        "colleges",
        "companies",
        "positions",
    )


@admin.register(CareerPath)
class CareerPathAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "direction",
        "education_level",
        "is_active",
    )

    list_filter = (
        "direction",
        "education_level",
        "is_active",
    )

    search_fields = (
        "title",
        "description",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    inlines = [CareerPathStepInline]
