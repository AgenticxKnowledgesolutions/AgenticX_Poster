from django.db import models

class StudentPlacement(models.Model):
    PLACEMENT_TYPE_CHOICES = [
        ('DATA_ANALYTICS', 'Data Analytics & Science'),
        ('SOFTWARE_ENG', 'Software Engineering & SDE'),
        ('AI_ML', 'AI, ML & Data Intelligence'),
        ('CLOUD_DEVOPS', 'Cloud, DevOps & Infrastructure'),
        ('CYBER_SECURITY', 'Cyber Security & InfoSec'),
        ('PRODUCT_MGMT', 'Product & Business Operations'),
        ('INTERN_PPO', 'Internship with PPO Offer'),
    ]

    THEME_CHOICES = [
        ('royal', 'Royal Navy & White'),
    ]

    STYLE_CHOICES = [
        ('stacked', 'AgenticX Blue & White Placement'),
        ('classic', 'Classic Studio Banner'),
    ]

    name = models.CharField(max_length=150, default="ANJANA K S")
    placement_type = models.CharField(max_length=50, choices=PLACEMENT_TYPE_CHOICES, default="DATA_ANALYTICS")
    company = models.CharField(max_length=150, default="Big 6 Company")
    designation = models.CharField(max_length=150, default="Data Analyst", blank=True)
    qual1 = models.CharField(max_length=200, default="B.Tech CS with AI & ML", blank=True)
    qual2 = models.CharField(max_length=100, default="(2026 Batch)", blank=True)
    college1 = models.CharField(max_length=200, default="College of Engineering", blank=True)
    college2 = models.CharField(max_length=100, default="Attingal", blank=True)
    training = models.CharField(max_length=150, default="Data Analytics", blank=True)
    highlight_text = models.CharField(max_length=50, default="PLACED")
    color_theme = models.CharField(max_length=30, choices=THEME_CHOICES, default="royal")
    poster_style = models.CharField(max_length=30, choices=STYLE_CHOICES, default="stacked")
    photo = models.ImageField(upload_to='students/', blank=True, null=True)
    photo_url = models.CharField(max_length=300, blank=True, null=True)
    photo_scale = models.IntegerField(default=100)
    photo_pos_x = models.IntegerField(default=0)
    photo_pos_y = models.IntegerField(default=0)
    is_draft = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_photo_url(self):
        if self.photo:
            return self.photo.url
        if self.photo_url:
            return self.photo_url
        return '/static/assets/student_1.jpg'

    def __str__(self):
        return f"{self.name} - {self.get_placement_type_display()} ({self.company})"
