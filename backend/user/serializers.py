from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, FriendRequest

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