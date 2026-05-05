from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('N', 'Prefer not to say'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username


class DailySummary(models.Model):
    RATE_CHOICES = [(i, i) for i in range(1, 6)]  # 1 to 5

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_summaries')
    text = models.TextField()                          # refined text from LLM
    raw_text = models.TextField(null=True, blank=True) # raw STT output
    date = models.DateField()
    rate = models.IntegerField(choices=RATE_CHOICES, null=True, blank=True)
    sleep_duration = models.FloatField(null=True, blank=True)  # in hours
    burnout_score = models.FloatField(null=True, blank=True)   # 0 to 10
    chill_day = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')  # one summary per user per day

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class MemoryNode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memory_nodes')
    daily_summary = models.ForeignKey(DailySummary, on_delete=models.CASCADE, related_name='memory_nodes')

    def __str__(self):
        return f"MemoryNode for {self.user.username} - {self.daily_summary.date}"


class EventNode(models.Model):
    memory_node = models.ForeignKey(MemoryNode, on_delete=models.CASCADE, related_name='event_nodes')
    daily_summary = models.ForeignKey(DailySummary, on_delete=models.CASCADE, related_name='event_nodes')
    event = models.TextField()
    date = models.DateField()

    def __str__(self):
        return f"Event: {self.event[:50]} on {self.date}"


class Question(models.Model):
    quest_number = models.IntegerField(unique=True)
    text = models.TextField()
    dimension = models.CharField(max_length=100)  # e.g. "Emotional Exhaustion"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q{self.quest_number}: {self.text[:60]}"


class QuestionAnswer(models.Model):
    CONFIDENCE_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    daily_summary = models.ForeignKey(DailySummary, on_delete=models.CASCADE, related_name='question_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer = models.TextField(null=True, blank=True)
    inference_confidence = models.CharField(max_length=10, choices=CONFIDENCE_CHOICES, default='medium')
    score = models.IntegerField(null=True, blank=True)  # 0 to 3 per our burnout logic

    def __str__(self):
        return f"{self.daily_summary} - Q{self.question.quest_number}"


class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    content = models.TextField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommendation for {self.user.username} on {self.date}"