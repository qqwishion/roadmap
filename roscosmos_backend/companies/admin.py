from django.contrib import admin
from .models import Company
from videos.models import MotivationalVideo

class MotivationalVideoInline(admin.TabularInline):
    model = Company.related_videos.through
    extra = 1
    verbose_name = "Related Video"
    verbose_name_plural = "Related Videos"

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "region",
        "region_slug",
        "has_base_department",
    )
    list_filter = ("region", "has_base_department")
    search_fields = ("name", "city")
    autocomplete_fields = ("region",)

    filter_horizontal = (
        "specializations",
        "partner_education",
        "intern_positions",
        "entry_positions",
        "advanced_positions",
        "related_videos",
    )

    inlines = [MotivationalVideoInline]

    @admin.display(description="Region slug")
    def region_slug(self, obj):
        return obj.region.slug if obj.region else "—"