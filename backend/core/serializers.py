from rest_framework import serializers
from core.models import User, DailySummary, Recommendation, Question, QuestionAnswer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

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


class DailySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySummary
        fields = ['id', 'text', 'date', 'rate', 'sleep_duration', 'burnout_score', 'chill_day', 'created_at']


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