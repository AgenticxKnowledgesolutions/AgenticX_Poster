from django.core.management.base import BaseCommand
from posters.models import StudentPlacement

class Command(BaseCommand):
    help = 'Seeds initial placed student profiles with actual placement records'

    def handle(self, *args, **kwargs):
        # 1. Clean up old dummy placeholder profiles if they exist
        dummy_names = ['ANJANA K S', 'RAHUL VERMA', 'MEERA NAIR', 'ARJUN KUMAR', 'PRIYA SHARMA', 'KIRAN V']
        deleted_count, _ = StudentPlacement.objects.filter(name__in=dummy_names).delete()
        if deleted_count > 0:
            self.stdout.write(f"Removed {deleted_count} dummy demo students.")

        # 2. Real placed student records
        real_students = [
            {
                'id': 1,
                'name': 'Anjitha M S',
                'placement_type': 'DATA_ANALYTICS',
                'company': 'Anupama Traders',
                'designation': 'Accounts Executive - Tally',
                'qual1': 'MBA - HR & Finanace',
                'qual2': '',
                'college1': 'UIM',
                'college2': 'Kundara',
                'training': 'Tally Prime & Professional Accounting',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo': 'students/IMG_20260930_123229588_MF_PORTRAITtt_l6keJhS.jpeg',
                'photo_url': '/static/assets/student_1.jpg',
                'photo_scale': 100,
                'photo_pos_x': 0,
                'photo_pos_y': 0,
                'is_draft': False,
            },
            {
                'id': 7,
                'name': 'ANAGHA WILLIAMS HUTTON ',
                'placement_type': 'DATA_ANALYTICS',
                'company': 'Big 4*',
                'designation': 'Data Analyst ( Bangalore )',
                'qual1': 'B.Tech CS With AI ML',
                'qual2': '(2026)',
                'college1': 'College of Engineering',
                'college2': 'Attingal',
                'training': 'Data Analytics',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo': 'students/anaghaaaaa_KtzW0Hc.jpeg',
                'photo_url': None,
                'photo_scale': 100,
                'photo_pos_x': 0,
                'photo_pos_y': 0,
                'is_draft': False,
            },
            {
                'id': 8,
                'name': 'SREERAJ S ',
                'placement_type': 'DATA_ANALYTICS',
                'company': 'Big 6*',
                'designation': 'Data Analyst ( Bangalore )',
                'qual1': 'B.Tech CS',
                'qual2': '(2026)',
                'college1': 'College of Engineering',
                'college2': 'Attingal',
                'training': 'Data Analytics',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo': 'students/sreeraj.jpeg',
                'photo_url': None,
                'photo_scale': 100,
                'photo_pos_x': 0,
                'photo_pos_y': 0,
                'is_draft': False,
            },
            {
                'id': 9,
                'name': 'CAROL FELIX ',
                'placement_type': 'DATA_ANALYTICS',
                'company': 'Big 6*',
                'designation': 'Data Analyst ( Bangalore )',
                'qual1': 'B.Tech CS',
                'qual2': '(2024)',
                'college1': 'College of Engineering',
                'college2': 'Attingal',
                'training': 'Data Analytics',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo': 'students/carol_vvMhxYf.jpeg',
                'photo_url': None,
                'photo_scale': 100,
                'photo_pos_x': 0,
                'photo_pos_y': 0,
                'is_draft': False,
            },
            {
                'id': 10,
                'name': 'MEENAKSHI V ',
                'placement_type': 'DATA_ANALYTICS',
                'company': 'Hirelink HR Pvt. LTD',
                'designation': 'HR Executive ( Kollam )',
                'qual1': 'MSW',
                'qual2': '(2026)',
                'college1': "St. Joseph's University",
                'college2': ' Bangalore',
                'training': '',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo': 'students/Meenakshi.jpeg',
                'photo_url': None,
                'photo_scale': 100,
                'photo_pos_x': 0,
                'photo_pos_y': 0,
                'is_draft': False,
            },
            {
                'id': 11,
                'name': 'Amrutha Raj D',
                'placement_type': 'DATA_ANALYTICS',
                'company': 'Innovation Incubator Advisory ',
                'designation': 'Junior AI Engineer ( Trivandrum )',
                'qual1': 'B.Tech CS With AI ML',
                'qual2': '(2025)',
                'college1': 'Hindustan Institute Of Technology And Science ',
                'college2': 'Chennai',
                'training': 'Data Analytics',
                'highlight_text': 'PLACED',
                'color_theme': 'royal',
                'poster_style': 'stacked',
                'photo': 'students/amrutha.jpeg',
                'photo_url': None,
                'photo_scale': 100,
                'photo_pos_x': 0,
                'photo_pos_y': 0,
                'is_draft': False,
            },
        ]

        count = 0
        for s in real_students:
            student_data = dict(s)
            pk = student_data.pop('id')
            obj, created = StudentPlacement.objects.update_or_create(
                id=pk,
                defaults=student_data
            )
            count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} real student placement profiles!'))
