from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import FriendRequest, Profile, Feedback, Message
from .serializers import ProfileSerializer, UserWithProfileSerializer, FriendRequestSerializer,MessageSerializer
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_GET
from django.db.models import Q  
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

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

from .serializers import FeedbackSerializer

class FeedbackSubmitView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            feedback_text = request.data.get('feedback')
            
            if not feedback_text or not feedback_text.strip():
                return Response({"error": "Please provide feedback text"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create the feedback
            feedback = Feedback.objects.create(
                user=request.user,
                feedback_text=feedback_text
            )
            
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """
    Send a message to another user
    """
    recipient_id = request.data.get('recipient_id')
    content = request.data.get('content')
    
    # Validate request data
    if not recipient_id:
        return Response({"error": "Recipient ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not content or not content.strip():
        return Response({"error": "Message content cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if sending message to self
    if int(recipient_id) == request.user.id:
        return Response({"error": "You cannot send a message to yourself"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get recipient user
    recipient = get_object_or_404(User, id=recipient_id)
    
    # Create and save the message
    message = Message.objects.create(
        sender=request.user,
        recipient=recipient,
        content=content
    )
    
    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, user_id):
    """
    Get messages between the current user and another user
    """
    other_user = get_object_or_404(User, id=user_id)
    
    # Get messages in both directions
    messages = Message.objects.filter(
        (Q(sender=request.user) & Q(recipient=other_user)) |
        (Q(sender=other_user) & Q(recipient=request.user))
    ).order_by('timestamp')
    
    # Mark received messages as read
    unread_messages = messages.filter(recipient=request.user, is_read=False)
    unread_messages.update(is_read=True)
    
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    """
    Get all conversations with last message
    """
    # Get all users with whom the current user has exchanged messages
    sent_to = Message.objects.filter(sender=request.user).values_list('recipient', flat=True).distinct()
    received_from = Message.objects.filter(recipient=request.user).values_list('sender', flat=True).distinct()
    
    # Combine the user IDs
    user_ids = set(list(sent_to) + list(received_from))
    
    conversations = []
    for user_id in user_ids:
        other_user = User.objects.get(id=user_id)
        
        # Get the last message
        last_message = Message.objects.filter(
            (Q(sender=request.user) & Q(recipient=other_user)) |
            (Q(sender=other_user) & Q(recipient=request.user))
        ).order_by('-timestamp').first()
        
        # Count unread messages
        unread_count = Message.objects.filter(
            sender=other_user,
            recipient=request.user,
            is_read=False
        ).count()
        
        # Create conversation object
        conversation = {
            'user': {
                'id': other_user.id,
                'username': other_user.username,
                # Add profile info if needed
            },
            'last_message': MessageSerializer(last_message).data if last_message else None,
            'unread_count': unread_count
        }
        
        conversations.append(conversation)
    
    # Sort conversations by last message timestamp (newest first)
    conversations.sort(
        key=lambda x: x['last_message']['timestamp'] if x['last_message'] else '1970-01-01T00:00:00Z',
        reverse=True
    )
    
    return Response(conversations)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_message(request, message_id):
    """
    Delete a message
    """
    message = get_object_or_404(Message, id=message_id)
    
    # Check if user is authorized to delete this message
    if message.sender != request.user:
        return Response({"error": "You can only delete messages you've sent"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    message.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)