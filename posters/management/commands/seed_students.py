from django.core.management.base import BaseCommand
from posters.models import StudentPlacement

class Command(BaseCommand):
    help = 'Seeds initial placed student profiles for all placement types'

    def handle(self, *args, **kwargs):
        students_data = [
            {
                'name': 'ANJANA K S',
                'placement_type': 'DATA_ANALYTICS',
                'company': 'Big 6 Company',
                'designation': 'Data Analyst',
                'qual1': 'B.Tech CS with AI & ML',
                'qual2': '(2026 Batch)',
                'college1': 'College of Engineering',
                'college2': 'Attingal',
                'training': 'Data Analytics',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo_url': '/static/assets/student_1.jpg',
            },
            {
                'name': 'RAHUL VERMA',
                'placement_type': 'SOFTWARE_ENG',
                'company': 'TechCorp Systems',
                'designation': 'Software Development Engineer (SDE 1)',
                'qual1': 'B.Tech Computer Science',
                'qual2': '(2026 Batch)',
                'college1': 'National Institute of Tech',
                'college2': 'Calicut',
                'training': 'Full Stack Web Development',
                'highlight_text': 'HIRED',
                'color_theme': 'bright',
                'poster_style': 'stacked',
                'photo_url': '/static/assets/student_2.jpg',
            },
            {
                'name': 'MEERA NAIR',
                'placement_type': 'AI_ML',
                'company': 'Cognitive AI Labs',
                'designation': 'AI Research Engineer',
                'qual1': 'M.Tech Data Science & AI',
                'qual2': '(2026 Batch)',
                'college1': 'College of Engineering',
                'college2': 'Trivandrum',
                'training': 'Applied AI & Deep Learning',
                'highlight_text': 'SELECTED',
                'color_theme': 'cyan',
                'poster_style': 'stacked',
                'photo_url': '/static/assets/student_3.jpg',
            },
            {
                'name': 'ARJUN KUMAR',
                'placement_type': 'CLOUD_DEVOPS',
                'company': 'CloudScale Global',
                'designation': 'DevOps & Cloud Engineer',
                'qual1': 'B.Tech Information Tech',
                'qual2': '(2026 Batch)',
                'college1': 'GEC Barton Hill',
                'college2': 'Trivandrum',
                'training': 'AWS Cloud Architecture',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo_url': '/static/assets/student_2.jpg',
            },
            {
                'name': 'PRIYA SHARMA',
                'placement_type': 'CYBER_SECURITY',
                'company': 'SecureTech Defense',
                'designation': 'Cyber Security Analyst',
                'qual1': 'B.Tech CS Cyber Security',
                'qual2': '(2026 Batch)',
                'college1': 'Model Engineering College',
                'college2': 'Kochi',
                'training': 'Ethical Hacking & InfoSec',
                'highlight_text': 'OFFERED',
                'color_theme': 'bright',
                'poster_style': 'stacked',
                'photo_url': '/static/assets/student_3.jpg',
            },
            {
                'name': 'KIRAN V',
                'placement_type': 'INTERN_PPO',
                'company': 'FinTech Global Solutions',
                'designation': 'Graduate Tech Intern (PPO Offer)',
                'qual1': 'B.Tech CS & Business Systems',
                'qual2': '(2026 Batch)',
                'college1': 'TKM College of Engineering',
                'college2': 'Kollam',
                'training': 'FinTech Web Engineering',
                'highlight_text': 'PPO',
                'color_theme': 'cyan',
                'poster_style': 'stacked',
                'photo_url': '/static/assets/student_1.jpg',
            },
        ]

        created_count = 0
        for data in students_data:
            obj, created = StudentPlacement.objects.get_or_create(
                name=data['name'],
                placement_type=data['placement_type'],
                defaults=data
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} student placement profiles!'))
