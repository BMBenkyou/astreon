# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import FriendRequest, Profile
from .models import Profile
from .serializers import ProfileSerializer
from django.contrib.auth.hashers import check_password
from .serializers import UserWithProfileSerializer, FriendRequestSerializer
from django.shortcuts import get_object_or_404


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    """
    Get all users with their profiles
    """
    users = User.objects.all()
    serializer = UserWithProfileSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    """
    Send a friend request to another user
    """
    to_user_id = request.data.get('to_user')
    
    # Validate request data
    if not to_user_id:
        return Response({"error": "Target user ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if sending request to self
    if int(to_user_id) == request.user.id:
        return Response({"error": "You cannot send a friend request to yourself"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if friend request already exists
    existing_request = FriendRequest.objects.filter(
        from_user=request.user,
        to_user_id=to_user_id
    ).exists()
    
    if existing_request:
        return Response({"error": "A friend request has already been sent to this user"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if recipient has already sent a request
    reverse_request = FriendRequest.objects.filter(
        from_user_id=to_user_id,
        to_user=request.user
    ).exists()
    
    if reverse_request:
        return Response({"error": "This user has already sent you a friend request"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create a new request with the current user as sender
    serializer = FriendRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(from_user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friend_requests(request):
    """
    Get all friend requests for the current user (both sent and received)
    """
    sent_requests = FriendRequest.objects.filter(from_user=request.user)
    received_requests = FriendRequest.objects.filter(to_user=request.user)
    
    sent_serializer = FriendRequestSerializer(sent_requests, many=True)
    received_serializer = FriendRequestSerializer(received_requests, many=True)
    
    return Response({
        'sent': sent_serializer.data,
        'received': received_serializer.data
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, request_id):
    """
    Accept a friend request
    """
    friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=request.user)
    
    friend_request.accepted = True
    friend_request.save()
    
    serializer = FriendRequestSerializer(friend_request)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def decline_friend_request(request, request_id):
    """
    Decline and delete a friend request
    """
    friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=request.user)
    friend_request.delete()
    
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_friend_request(request, user_id):
    """
    Cancel a sent friend request
    """
    friend_request = get_object_or_404(
        FriendRequest, 
        from_user=request.user,
        to_user_id=user_id,
        accepted=False
    )
    
    friend_request.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    """
    Get all friends of the current user
    """
    friends_list = request.user.friends()
    serializer = UserWithProfileSerializer(friends_list, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_friend(request, user_id):
    """
    Remove a user from friends
    """
    # Find and delete the friend request in either direction
    FriendRequest.objects.filter(
        (Q(from_user=request.user) & Q(to_user_id=user_id)) |
        (Q(from_user_id=user_id) & Q(to_user=request.user)),
        accepted=True
    ).delete()
    
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_friendship_status(request, user_id):
    """
    Check friendship status with another user
    """
    # Check if they are already friends
    target_user = get_object_or_404(User, id=user_id)
    user_friends = request.user.friends()
    
    if target_user in user_friends:
        return Response({'status': 'friends'})
    
    # Check for pending friend requests
    sent_request = FriendRequest.objects.filter(
        from_user=request.user,
        to_user_id=user_id,
        accepted=False
    ).exists()
    
    if sent_request:
        return Response({'status': 'request_sent'})
    
    received_request = FriendRequest.objects.filter(
        from_user_id=user_id,
        to_user=request.user,
        accepted=False
    ).exists()
    
    if received_request:
        return Response({'status': 'request_received'})
    
    # No relationship
    return Response({'status': 'none'})

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