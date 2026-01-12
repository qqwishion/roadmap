from django.contrib import admin
from .models import University
from videos.models import MotivationalVideo

class MotivationalVideoInline(admin.TabularInline):
    model = University.related_videos.through
    extra = 1
    verbose_name = "Related Video"
    verbose_name_plural = "Related Videos"

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "region", "region_slug")
    list_filter = ("region",)
    search_fields = ("name", "city")
    autocomplete_fields = ("region",)

    filter_horizontal = (
        "specializations",
        "partner_companies",
        "intern_positions",
        "entry_positions",
        "advanced_positions",
        "related_videos",  # <-- теперь видно
    )

    inlines = [MotivationalVideoInline]

    @admin.display(description="Region slug")
    def region_slug(self, obj):
        return obj.region.slug if obj.region else "-"
