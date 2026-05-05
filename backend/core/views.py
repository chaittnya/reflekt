from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from datetime import datetime, timedelta
from django.db.models import Avg
from core.serializers import (
    RegisterSerializer,
    UserSerializer,
    DailySummarySerializer,
    RecommendationSerializer,
)
from core.models import DailySummary, Recommendation
from core.services.llm.prompt_loader import load_prompt
from core.services.llm.claude_service import ClaudeLLMService
from core.services.journal_service import process_journal_entry


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        days = request.query_params.get('days', 30)
        try:
            days = int(days)
        except ValueError:
            days = 30

        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)

        summaries = DailySummary.objects.filter(
            user=user,
            date__range=[start_date, end_date]
        ).order_by('date')

        burnout_scores = [s.burnout_score for s in summaries if s.burnout_score is not None]
        chill_days = summaries.filter(chill_day=True).count()
        total_entries = summaries.count()

        avg_burnout = sum(burnout_scores) / len(burnout_scores) if burnout_scores else 0
        avg_sleep = summaries.aggregate(Avg('sleep_duration'))['sleep_duration__avg'] or 0
        avg_rate = summaries.aggregate(Avg('rate'))['rate__avg'] or 0

        seven_days_ago = end_date - timedelta(days=7)
        fourteen_days_ago = end_date - timedelta(days=14)

        last_7_scores = [
            s.burnout_score for s in summaries
            if s.date >= seven_days_ago and s.burnout_score is not None
        ]
        prev_7_scores = [
            s.burnout_score for s in summaries
            if s.date >= fourteen_days_ago and s.date < seven_days_ago and s.burnout_score is not None
        ]

        last_7_avg = sum(last_7_scores) / len(last_7_scores) if last_7_scores else 0
        prev_7_avg = sum(prev_7_scores) / len(prev_7_scores) if prev_7_scores else 0

        if last_7_avg < prev_7_avg:
            trend = 'improving'
        elif last_7_avg > prev_7_avg:
            trend = 'worsening'
        else:
            trend = 'stable'

        if avg_burnout <= 3:
            wellbeing_status = 'good'
        elif avg_burnout <= 6:
            wellbeing_status = 'moderate'
        else:
            wellbeing_status = 'concerning'

        return Response({
            'period_days': days,
            'start_date': start_date,
            'end_date': end_date,
            'total_entries': total_entries,
            'burnout_stats': {
                'current': burnout_scores[-1] if burnout_scores else None,
                'average': round(avg_burnout, 2),
                'min': min(burnout_scores) if burnout_scores else None,
                'max': max(burnout_scores) if burnout_scores else None,
                'last_7_avg': round(last_7_avg, 2),
                'trend': trend,
            },
            'health_stats': {
                'average_sleep_hours': round(avg_sleep, 2),
                'average_daily_rate': round(avg_rate, 2),
                'chill_days_count': chill_days,
            },
            'wellbeing_status': wellbeing_status,
            'daily_entries': DailySummarySerializer(summaries, many=True).data,
        }, status=status.HTTP_200_OK)


class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        limit = request.query_params.get('limit', 5)
        try:
            limit = int(limit)
        except ValueError:
            limit = 5

        recommendations = Recommendation.objects.filter(user=user).order_by('-date')[:limit]

        return Response({
            'recommendations': RecommendationSerializer(recommendations, many=True).data,
            'count': len(recommendations),
        }, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user

        latest_summary = DailySummary.objects.filter(user=user).order_by('-date').first()

        if not latest_summary:
            return Response(
                {'error': 'No journal entries found. Please create an entry first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if latest_summary.burnout_score is None or latest_summary.burnout_score < 5:
            return Response(
                {'message': 'Burnout score is low. No urgent recommendation needed.', 'recommendation': None},
                status=status.HTTP_200_OK
            )

        try:
            seven_days_ago = latest_summary.date - timedelta(days=7)
            recent_summaries = DailySummary.objects.filter(
                user=user,
                date__gte=seven_days_ago
            ).order_by('date')

            journal_context = "\n".join([
                f"[{s.date}] {s.text[:500]}" for s in recent_summaries
            ])

            recommendation_prompt = load_prompt('generate_recommendation.txt')
            prompt = recommendation_prompt.format(
                journal_entries=journal_context,
                burnout_score=latest_summary.burnout_score,
                chill_day='Yes' if latest_summary.chill_day else 'No'
            )

            llm_service = ClaudeLLMService()
            recommendation_content = llm_service._ask(prompt)

            recommendation = Recommendation.objects.create(
                user=user,
                content=recommendation_content,
                date=latest_summary.date
            )

            return Response({
                'message': 'Recommendation generated successfully',
                'recommendation': RecommendationSerializer(recommendation).data,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Failed to generate recommendation: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JournalEntryView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response(
                {'error': 'Audio file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        rate = request.data.get('rate')
        sleep_duration = request.data.get('sleep_duration')

        try:
            rate = int(rate) if rate else None
            sleep_duration = float(sleep_duration) if sleep_duration else None
        except ValueError:
            return Response(
                {'error': 'Invalid rate or sleep_duration'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            result = process_journal_entry(
                user=request.user,
                audio_file=audio_file,
                rate=rate,
                sleep_duration=sleep_duration,
            )
            return Response(result, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
