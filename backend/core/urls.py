from django.urls import path
from core.views import (
    RegisterView,
    LoginView,
    LogoutView,
    StatsView,
    RecommendationView,
    JournalEntryView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('stats/', StatsView.as_view(), name='stats'),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    path('journal/', JournalEntryView.as_view(), name='journal-entry'),
]