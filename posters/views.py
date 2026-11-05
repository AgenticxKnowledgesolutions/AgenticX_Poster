from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import json
import os
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from .models import StudentPlacement

def poster_studio(request):
    students = StudentPlacement.objects.all().order_by('-created_at')
    edit_id = request.GET.get('edit')
    is_new = ('new' in request.GET) or (request.GET.get('new') is not None)
    active_student = None
    if edit_id:
        active_student = StudentPlacement.objects.filter(pk=edit_id).first()
    elif is_new:
        active_student = None
    else:
        active_student = students.first() if students.exists() else None
    
    context = {
        'students': students,
        'active_student': active_student,
        'is_new': is_new,
    }
    return render(request, 'posters/index.html', context)

def manage_posters(request):
    students = StudentPlacement.objects.all().order_by('-created_at')
    published_count = students.filter(is_draft=False).count()
    drafts_count = students.filter(is_draft=True).count()
    context = {
        'students': students,
        'published_count': published_count,
        'drafts_count': drafts_count,
    }
    return render(request, 'posters/manage.html', context)

def api_get_students(request):
    qs = StudentPlacement.objects.all().order_by('-created_at')
    
    data = []
    for s in qs:
        data.append({
            'id': s.id,
            'name': s.name,
            'company': s.company,
            'designation': s.designation,
            'qual1': s.qual1,
            'qual2': s.qual2,
            'college1': s.college1,
            'college2': s.college2,
            'training': s.training,
            'highlight_text': s.highlight_text,
            'color_theme': s.color_theme,
            'poster_style': s.poster_style,
            'is_draft': s.is_draft,
            'photo_scale': s.photo_scale,
            'photo_pos_x': s.photo_pos_x,
            'photo_pos_y': s.photo_pos_y,
            'photo_url': s.get_photo_url(),
        })
    return JsonResponse({'students': data})

@csrf_exempt
def api_create_student(request):
    if request.method == 'POST':
        name = request.POST.get('name', 'STUDENT NAME')
        company = request.POST.get('company', 'Company')
        designation = request.POST.get('designation', '')
        qual1 = request.POST.get('qual1', '')
        qual2 = request.POST.get('qual2', '')
        college1 = request.POST.get('college1', '')
        college2 = request.POST.get('college2', '')
        training = request.POST.get('training', '')
        highlight_text = request.POST.get('highlight_text', 'PLACED')
        color_theme = request.POST.get('color_theme', 'royal')
        poster_style = request.POST.get('poster_style', 'stacked')
        is_draft = request.POST.get('is_draft', 'false').lower() == 'true'
        photo_scale = int(request.POST.get('photo_scale', 100))
        photo_pos_x = int(request.POST.get('photo_pos_x', 0))
        photo_pos_y = int(request.POST.get('photo_pos_y', 0))
        photo_file = request.FILES.get('photo')

        student = StudentPlacement(
            name=name,
            company=company,
            designation=designation,
            qual1=qual1,
            qual2=qual2,
            college1=college1,
            college2=college2,
            training=training,
            highlight_text=highlight_text,
            color_theme=color_theme,
            poster_style=poster_style,
            is_draft=is_draft,
            photo_scale=photo_scale,
            photo_pos_x=photo_pos_x,
            photo_pos_y=photo_pos_y,
        )

        if photo_file:
            student.photo = photo_file

        student.save()

        return JsonResponse({
            'status': 'success',
            'id': student.id,
            'name': student.name,
            'company': student.company,
            'designation': student.designation,
            'qual1': student.qual1,
            'qual2': student.qual2,
            'college1': student.college1,
            'college2': student.college2,
            'training': student.training,
            'highlight_text': student.highlight_text,
            'color_theme': student.color_theme,
            'is_draft': student.is_draft,
            'photo_scale': student.photo_scale,
            'photo_pos_x': student.photo_pos_x,
            'photo_pos_y': student.photo_pos_y,
            'photo_url': student.get_photo_url()
        })
    return JsonResponse({'error': 'POST required'}, status=400)

@csrf_exempt
def api_update_student(request, student_id):
    if request.method == 'POST':
        student = get_object_or_404(StudentPlacement, pk=student_id)
        student.name = request.POST.get('name', student.name)
        student.company = request.POST.get('company', student.company)
        student.designation = request.POST.get('designation', student.designation)
        student.qual1 = request.POST.get('qual1', student.qual1)
        student.qual2 = request.POST.get('qual2', student.qual2)
        student.college1 = request.POST.get('college1', student.college1)
        student.college2 = request.POST.get('college2', student.college2)
        if 'training' in request.POST:
            student.training = request.POST.get('training', '').strip()
        else:
            student.training = request.POST.get('training', student.training)
        student.highlight_text = request.POST.get('highlight_text', student.highlight_text)
        student.color_theme = request.POST.get('color_theme', student.color_theme)
        
        if 'is_draft' in request.POST:
            student.is_draft = request.POST.get('is_draft', 'false').lower() == 'true'
        if 'photo_scale' in request.POST:
            student.photo_scale = int(request.POST.get('photo_scale', student.photo_scale))
        if 'photo_pos_x' in request.POST:
            student.photo_pos_x = int(request.POST.get('photo_pos_x', student.photo_pos_x))
        if 'photo_pos_y' in request.POST:
            student.photo_pos_y = int(request.POST.get('photo_pos_y', student.photo_pos_y))
        
        photo_file = request.FILES.get('photo')
        if photo_file:
            student.photo = photo_file

        student.save()

        return JsonResponse({
            'status': 'success',
            'id': student.id,
            'name': student.name,
            'company': student.company,
            'designation': student.designation,
            'qual1': student.qual1,
            'qual2': student.qual2,
            'college1': student.college1,
            'college2': student.college2,
            'training': student.training,
            'highlight_text': student.highlight_text,
            'color_theme': student.color_theme,
            'is_draft': student.is_draft,
            'photo_scale': student.photo_scale,
            'photo_pos_x': student.photo_pos_x,
            'photo_pos_y': student.photo_pos_y,
            'photo_url': student.get_photo_url()
        })
    return JsonResponse({'error': 'POST required'}, status=400)

@csrf_exempt
def api_delete_student(request, student_id):
    if request.method in ['POST', 'DELETE']:
        student = get_object_or_404(StudentPlacement, pk=student_id)
        s_id = student.id
        s_name = student.name
        student.delete()
        return JsonResponse({
            'status': 'success',
            'id': s_id,
            'message': f'Deleted {s_name}'
        })
    return JsonResponse({'error': 'POST or DELETE required'}, status=400)

def download_poster_backend(request, student_id):
    student = get_object_or_404(StudentPlacement, pk=student_id)
    
    # Generate 1080 x 1350 px image (4:5 ratio) strictly
    W, H = 1080, 1350
    img = Image.new('RGB', (W, H), color='#081735')
    draw = ImageDraw.Draw(img)

    # Draw header bar
    draw.rectangle([0, 0, W, 140], fill='#052b63')
    draw.rectangle([0, 140, W, 146], fill='#159be8')

    # Header text
    try:
        font_title = ImageFont.truetype("arial.ttf", 36)
        font_sub = ImageFont.truetype("arial.ttf", 20)
        font_badge = ImageFont.truetype("arial.ttf", 24)
        font_placed = ImageFont.truetype("arial.ttf", 110)
        font_name = ImageFont.truetype("arial.ttf", 48)
        font_role = ImageFont.truetype("arial.ttf", 36)
        font_info = ImageFont.truetype("arial.ttf", 22)
    except IOError:
        font_title = font_sub = font_badge = font_placed = font_name = font_role = font_info = ImageFont.load_default()

    draw.text((40, 35), "AgenticX Knowledge Solutions", fill='#ffffff', font=font_title)
    draw.text((40, 85), "STUDENT PLACEMENT STUDIO • INSTAGRAM 4:5 POSTER", fill='#a9d9fb', font=font_sub)
    draw.rectangle([W-320, 40, W-40, 100], fill='#1269ca')
    draw.text((W-300, 55), "★ PLACEMENT ALERT", fill='#ffffff', font=font_badge)

    # PLACED backdrop typography
    h_text = (student.highlight_text or "PLACED").upper()
    y_stack = 170
    for i in range(4):
        draw.text((60, y_stack + (i * 120)), h_text, fill='#0d2857', font=font_placed)

    # Info card area at bottom
    draw.rectangle([50, 940, W-50, 1220], fill='#ffffff')
    draw.rectangle([50, 940, W-50, 946], fill='#159be8')

    draw.text((80, 970), f"STUDENT: {student.name}", fill='#081735', font=font_name)
    draw.text((80, 1035), f"COMPANY: {student.company}  |  ROLE: {student.designation}", fill='#1269ca', font=font_role)
    if student.training and student.training.strip():
        draw.text((80, 1085), f"COURSE: {student.training}", fill='#1d334d', font=font_info)
        draw.text((80, 1125), f"QUALIFICATION: {student.qual1} {student.qual2}", fill='#1d334d', font=font_info)
        draw.text((80, 1165), f"COLLEGE: {student.college1}, {student.college2}", fill='#1d334d', font=font_info)
    else:
        draw.text((80, 1100), f"QUALIFICATION: {student.qual1} {student.qual2}", fill='#1d334d', font=font_info)
        draw.text((80, 1150), f"COLLEGE: {student.college1}, {student.college2}", fill='#1d334d', font=font_info)

    # Draw footer
    draw.rectangle([0, 1260, W, H], fill='#052b63')
    draw.text((60, 1290), "agenticx.co.in   |   +91 9496552094   |   +91 9496852094", fill='#ffffff', font=font_sub)

    # Save to buffer
    buffer = BytesIO()
    img.save(buffer, format='PNG', quality=100)
    buffer.seek(0)

    filename = f"{student.name.replace(' ', '_')}_4x5_Poster.png"
    response = HttpResponse(buffer.getvalue(), content_type='image/png')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response
