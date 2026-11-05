from django.urls import path
from . import views

urlpatterns = [
    path('', views.poster_studio, name='poster_studio'),
    path('manage/', views.manage_posters, name='manage_posters'),
    path('api/students/', views.api_get_students, name='api_students'),
    path('api/students/create/', views.api_create_student, name='api_create_student'),
    path('api/students/update/<int:student_id>/', views.api_update_student, name='api_update_student'),
    path('api/students/delete/<int:student_id>/', views.api_delete_student, name='api_delete_student'),
    path('download/<int:student_id>/', views.download_poster_backend, name='download_poster_backend'),
]
