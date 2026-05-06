from rest_framework import serializers
from core.models import User, DailySummary, Recommendation, Question, QuestionAnswer, EventNode

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'gender', 'dob']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            gender=validated_data.get('gender'),
            dob=validated_data.get('dob'),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'gender', 'dob']


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ['id', 'content', 'date', 'created_at']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'quest_number', 'text', 'dimension']


class QuestionAnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = QuestionAnswer
        fields = ['id', 'question', 'answer', 'inference_confidence', 'score']

class EventNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventNode
        fields = ['id', 'event', 'category', 'sentiment', 'intensity', 'date']


class DailySummarySerializer(serializers.ModelSerializer):
    event_nodes      = EventNodeSerializer(many=True, read_only=True)
    question_answers = QuestionAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = DailySummary
        fields = [
            'id', 'text', 'raw_text', 'date',
            'rate', 'sleep_duration',
            'burnout_score', 'chill_day',
            'event_nodes', 'question_answers',
            'created_at'
        ]