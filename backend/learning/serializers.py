from rest_framework import serializers
from .models import Quiz, Session

class QuizMessageSerializer(serializers.Serializer):
    message = serializers.CharField()
    files = serializers.ListField(child=serializers.FileField(), required=False)
    title = serializers.CharField(required=True)

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'body', 'questions', 'created_at']

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'category', 'title', 'quiz', 'created_at'] 