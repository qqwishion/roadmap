from django.db import models
from references.models import Direction, Position


class CareerPath(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    duration = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)

    education_level = models.CharField(max_length=100, blank=True)
    institution_type = models.CharField(max_length=100, blank=True)
    direction = models.ForeignKey(
        Direction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    career_goal = models.TextField(blank=True)
    achievements = models.JSONField(default=list, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    


class CareerPathStep(models.Model):
    career_path = models.ForeignKey(
        CareerPath,
        on_delete=models.CASCADE,
        related_name="steps",
    )

    step = models.PositiveIntegerField()

    STEP_TYPES = (
        ("school", "Школа"),
        ("education", "Образование"),
        ("internship", "Стажировка"),
        ("junior", "Начальная позиция"),
        ("career", "Карьерный рост"),
        ("result", "Итоги"),
    )

    step_type = models.CharField(
        max_length=20,
        choices=STEP_TYPES,
        default="education",
    )

    title = models.CharField(max_length=255)
    description = models.TextField()

    positions = models.ManyToManyField(
        Position,
        blank=True,
        related_name="steps"
    )

    universities = models.ManyToManyField("universities.University", blank=True)
    colleges = models.ManyToManyField("colleges.College", blank=True)
    companies = models.ManyToManyField("companies.Company", blank=True)

    class Meta:
        ordering = ["step"]
