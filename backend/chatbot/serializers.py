from rest_framework import serializers
from .models import UserFile
from users.models import Session,Quiz

class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ('file','uploaded_at')




class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField()
    files = serializers.ListField(child=serializers.FileField(required=False, allow_null=True),
    required=False, allow_empty=True)

class VerifyEmailSerializer(serializers.Serializer):
    """
    Serializer for verifying the email confirmation key.
    """
    key = serializers.CharField(max_length=64, required=True)

    def validate_key(self, value):
        if not value:
            raise serializers.ValidationError(_("This field is required."))
        return value


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'user', 'category', 'title', 'quiz', 'flashcards','created_at', 'updated_at']


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions', 'created_at']


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions', 'created_at']