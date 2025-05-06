from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, FriendRequest
from .models import Feedback

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp', 'is_read']
        
    def get_sender(self, obj):
        return {
            'id': obj.sender.id,
            'username': obj.sender.username
        }

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'profile_pic']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'profile']

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserWithProfileSerializer(read_only=True)
    to_user = UserWithProfileSerializer(read_only=True)
    
    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'created_at', 'accepted']
        read_only_fields = ['id', 'from_user', 'created_at', 'accepted']
    
    def create(self, validated_data):
        return FriendRequest.objects.create(**validated_data)

class FeedbackSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'username', 'feedback_text', 'created_at']
        read_only_fields = ['id', 'user', 'username', 'created_at']
    
    def get_username(self, obj):
        return obj.user.username