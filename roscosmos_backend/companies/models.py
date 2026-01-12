from django.db import models
from references.models import Region, Specialization, Position
from universities.models import University



class Company(models.Model):
    name = models.CharField(max_length=255)

    city = models.CharField(max_length=255)
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        related_name="companies",
    )

    specializations = models.ManyToManyField(
        Specialization,
        blank=True,
        related_name="companies",
    )

    partner_education = models.ManyToManyField(
        University,
        blank=True,
        related_name="partnered_companies",
    )

    intern_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="company_intern_positions",
    )
    entry_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="company_entry_positions",
    )
    advanced_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="company_advanced_positions",
    )

    site = models.URLField()
    description = models.TextField(blank=True)

    has_base_department = models.BooleanField(default=False)
    base_department_name = models.CharField(max_length=255, blank=True)

    video_url = models.URLField(blank=True)
    video_title = models.CharField(max_length=255, blank=True)
    video_description = models.TextField(blank=True)

    related_videos = models.ManyToManyField(
        "videos.MotivationalVideo",
        blank=True,
        related_name="companies",
    )

    contacts = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name