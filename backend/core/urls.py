from django.urls import path
from core.views import RegisterView, LoginView, LogoutView, JournalEntryView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('journal/', JournalEntryView.as_view(), name='journal-entry'),
]