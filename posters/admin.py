from django.contrib import admin
from .models import StudentPlacement

@admin.register(StudentPlacement)
class StudentPlacementAdmin(admin.ModelAdmin):
    list_display = ('name', 'placement_type', 'company', 'designation', 'training', 'created_at')
    list_filter = ('placement_type', 'color_theme', 'poster_style')
    search_fields = ('name', 'company', 'designation', 'college1')
