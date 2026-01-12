from django.db import models
from references.models import Region, Specialization, Position


class University(models.Model):
    name = models.CharField(max_length=255)

    city = models.CharField(max_length=255)
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        related_name="universities",
    )

    specializations = models.ManyToManyField(
        Specialization,
        blank=True,
        related_name="universities",
    )

    partner_companies = models.ManyToManyField(
        "companies.Company",
        blank=True,
        related_name="partner_universities",
    )

    intern_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="university_intern_positions",
    )
    entry_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="university_entry_positions",
    )
    advanced_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="university_advanced_positions",
    )

    path_after_9 = models.TextField()
    path_after_11 = models.TextField()

    site = models.URLField()
    description = models.TextField(blank=True)

    has_advanced_engineering_school = models.BooleanField(default=False)
    advanced_engineering_school_info = models.TextField(blank=True)

    video_url = models.URLField(blank=True)
    video_title = models.CharField(max_length=255, blank=True)
    video_description = models.TextField(blank=True)

    related_videos = models.ManyToManyField(
        "videos.MotivationalVideo",
        blank=True,
        related_name="universities",
    )

    contacts = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


