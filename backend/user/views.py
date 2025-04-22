from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import FriendRequest, Profile
from .serializers import ProfileSerializer, UserWithProfileSerializer, FriendRequestSerializer
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from django.db.models import Q  

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
        to_user_id=to_user_id,
        accepted=False  # Only check non-accepted requests
    ).exists()
    
    if existing_request:
        return Response({"error": "A friend request has already been sent to this user"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if recipient has already sent a request
    reverse_request = FriendRequest.objects.filter(
        from_user_id=to_user_id,
        to_user=request.user,
        accepted=False  # Only check non-accepted requests
    ).exists()
    
    if reverse_request:
        return Response({"error": "This user has already sent you a friend request"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if they are already friends
    already_friends = FriendRequest.objects.filter(
        (Q(from_user=request.user) & Q(to_user_id=to_user_id)) |
        (Q(from_user_id=to_user_id) & Q(to_user=request.user)),
        accepted=True
    ).exists()
    
    if already_friends:
        return Response({"error": "You are already friends with this user"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create a new request with the current user as sender
    to_user = get_object_or_404(User, id=to_user_id)
    friend_request = FriendRequest(from_user=request.user, to_user=to_user)
    friend_request.save()
    
    serializer = FriendRequestSerializer(friend_request)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friend_requests(request):
    """
    Get all friend requests for the current user (both sent and received)
    """
    sent_requests = FriendRequest.objects.filter(from_user=request.user, accepted=False)
    received_requests = FriendRequest.objects.filter(to_user=request.user, accepted=False)
    
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
    # Get accepted friend requests in both directions
    sent_accepted = FriendRequest.objects.filter(from_user=request.user, accepted=True).values_list('to_user', flat=True)
    received_accepted = FriendRequest.objects.filter(to_user=request.user, accepted=True).values_list('from_user', flat=True)
    
    # Combine the user IDs
    friend_ids = set(list(sent_accepted) + list(received_accepted))
    
    # Get the actual user objects
    friends_list = User.objects.filter(id__in=friend_ids)
    
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
    already_friends = FriendRequest.objects.filter(
        (Q(from_user=request.user) & Q(to_user_id=user_id)) |
        (Q(from_user_id=user_id) & Q(to_user=request.user)),
        accepted=True
    ).exists()
    
    if already_friends:
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
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=request.user)
        
    # Return user object along with profile
    user_data = {
        'user': {
            'id': request.user.id,
            'username': request.user.username,
        },
        'profile': ProfileSerializer(profile).data
    }
    
    return Response(user_data)

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