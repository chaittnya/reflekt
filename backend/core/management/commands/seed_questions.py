from django.core.management.base import BaseCommand
from core.models import Question


class Command(BaseCommand):
    help = 'Seed the 8 fixed burnout questions'

    def handle(self, *args, **kwargs):
        questions = [
            {
                'quest_number': 1,
                'text': 'How was your energy level through the day?',
                'dimension': 'Emotional Exhaustion',
            },
            {
                'quest_number': 2,
                'text': 'Did you feel motivated or engaged in your work or tasks?',
                'dimension': 'Depersonalization / Cynicism',
            },
            {
                'quest_number': 3,
                'text': 'Did you feel a sense of accomplishment today?',
                'dimension': 'Personal Efficacy',
            },
            {
                'quest_number': 4,
                'text': 'How were your interactions with others today?',
                'dimension': 'Social Withdrawal',
            },
            {
                'quest_number': 5,
                'text': 'What emotions dominated your day?',
                'dimension': 'Affect / Mood State',
            },
            {
                'quest_number': 6,
                'text': 'Did you experience any physical discomfort such as tension, headache, or fatigue?',
                'dimension': 'Somatic Symptoms',
            },
            {
                'quest_number': 7,
                'text': 'What caused you the most stress today?',
                'dimension': 'Stressor Identification',
            },
            {
                'quest_number': 8,
                'text': 'Did you get any time to relax or do something you enjoy?',
                'dimension': 'Recovery Capacity',
            },
        ]

        for q in questions:
            obj, created = Question.objects.get_or_create(
                quest_number=q['quest_number'],
                defaults={
                    'text': q['text'],
                    'dimension': q['dimension'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Q{q['quest_number']}: {q['text'][:50]}"))
            else:
                self.stdout.write(self.style.WARNING(f"Already exists Q{q['quest_number']}, skipping."))

        self.stdout.write(self.style.SUCCESS('Done seeding questions!'))