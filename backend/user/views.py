# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Profile
from .serializers import ProfileSerializer
from django.contrib.auth.hashers import check_password

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Get the authenticated user's profile
    """
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update the authenticated user's profile
    """
    user = request.user
    profile = Profile.objects.get(user=user)
    
    # Handle profile picture
    profile_pic = request.FILES.get('profile_pic')
    if profile_pic:
        profile.profile_pic = profile_pic
    
    # Update bio if provided
    bio = request.data.get('bio')
    if bio is not None:
        profile.bio = bio
    
    # Update username if provided
    username = request.data.get('username')
    if username and username != user.username:
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        user.username = username
        user.save()
    
    # Update password if provided
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if old_password and new_password:
        if check_password(old_password, user.password):
            user.set_password(new_password)
            user.save()
        else:
            return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
    
    profile.save()
    
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    """
    Delete the authenticated user's account
    """
    user = request.user
    user.delete()
    return Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)