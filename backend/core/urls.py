from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import (
    JournalHistoryView,
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
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('stats/', StatsView.as_view(), name='stats'),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    path('journal/', JournalEntryView.as_view(), name='journal-entry'),
    path('journal/history/', JournalHistoryView.as_view(), name='journal-history'),
]