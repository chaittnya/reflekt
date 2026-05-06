from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from core.models import User, DailySummary, EventNode, Question, QuestionAnswer, Recommendation


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['id', 'username', 'email', 'gender', 'dob']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('gender', 'dob')}),
    )


@admin.register(DailySummary)
class DailySummaryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'date', 'rate', 'sleep_duration', 'burnout_score', 'chill_day']
    list_filter = ['chill_day', 'date']
    search_fields = ['user__username']


@admin.register(EventNode)
class EventNodeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'event', 'category', 'sentiment', 'intensity', 'date']
    list_filter = ['category', 'sentiment', 'intensity']
    search_fields = ['user__username', 'event']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'quest_number', 'text', 'dimension']


@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    list_display = ['id', 'daily_summary', 'question', 'answer', 'score', 'inference_confidence', 'source']
    list_filter = ['inference_confidence', 'source']
    search_fields = ['answer', 'daily_summary__user__username']


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'date', 'content']