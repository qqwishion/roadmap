from django.contrib import admin
from .models import MotivationalVideo

@admin.register(MotivationalVideo)
class VideoAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "order",
        "updated_at",
    )
    list_editable = ("order",)  # можно менять порядок прямо в списке
    search_fields = (
        "title",
        "description",
        "category",
        "tags",
    )
    list_filter = (
        "category",
    )
    ordering = ("order", "-updated_at")
