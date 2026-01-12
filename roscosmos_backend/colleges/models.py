from django.db import models
from references.models import Region, Specialization, Position




class College(models.Model):
    name = models.CharField(max_length=255)

    city = models.CharField(max_length=255)
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        related_name="colleges",
    )

    specializations = models.ManyToManyField(
        Specialization,
        blank=True,
        related_name="colleges",
    )

    partner_companies = models.ManyToManyField(
        "companies.Company",
        blank=True,
        related_name="partner_colleges",
    )

    intern_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="college_intern_positions",
    )
    entry_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="college_entry_positions",
    )
    advanced_positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="college_advanced_positions",
    )

    path_after_9 = models.TextField()
    path_after_11 = models.TextField()

    participates_in_professionalism = models.BooleanField(default=False)
    professionalism_info = models.TextField(blank=True)

    site = models.URLField()
    description = models.TextField(blank=True)

    video_url = models.URLField(blank=True)
    video_title = models.CharField(max_length=255, blank=True)
    video_description = models.TextField(blank=True)

    related_videos = models.ManyToManyField(
        "videos.MotivationalVideo",
        blank=True,
        related_name="colleges",
    )

    contacts = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
