from django.contrib import admin
from .models import College
from videos.models import MotivationalVideo

class MotivationalVideoInline(admin.TabularInline):
    model = College.related_videos.through
    extra = 1
    verbose_name = "Related Video"
    verbose_name_plural = "Related Videos"

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "region",
        "region_slug",
        "participates_in_professionalism",
    )
    list_filter = ("region", "participates_in_professionalism")
    search_fields = ("name", "city")
    autocomplete_fields = ("region",)

    filter_horizontal = (
        "specializations",
        "partner_companies",
        "intern_positions",
        "entry_positions",
        "advanced_positions",
        "related_videos",
    )

    inlines = [MotivationalVideoInline]

    @admin.display(description="Region slug")
    def region_slug(self, obj):
        return obj.region.slug if obj.region else "-"