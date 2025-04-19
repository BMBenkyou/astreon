from rest_framework import serializers
from .models import QuizQuestion, UploadedFile, FileChat

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'order']  # or all fields you need

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'quiz', 'question_text', 'options', 'correct_answer', 'explanation', 'order']
        read_only_fields = ['id']
    
    def validate_options(self, value):
        """
        Validate that options is a list.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("Options must be a list")
        if len(value) < 2:
            raise serializers.ValidationError("At least two options are required")
        return value
    
    def validate(self, data):
        """
        Validate that correct_answer is in options.
        """
        if 'options' in data and 'correct_answer' in data:
            options = data['options']
            correct_answer = data['correct_answer']
            
            # Check if correct_answer is one of the options
            if correct_answer not in options:
                raise serializers.ValidationError(
                    {"correct_answer": "Correct answer must be one of the provided options"}
                )
        
        return data




class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'name', 'file_type', 'uploaded_at', 'content']

class FileChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileChat
        fields = ['id', 'message', 'response', 'created_at']