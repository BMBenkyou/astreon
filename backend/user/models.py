from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Q

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_friend_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_friend_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} ({'Accepted' if self.accepted else 'Pending'})"

def friends(self):
    """
    Get a queryset of users who are friends with this user
    """
    # Get all accepted friend requests where current user is either sender or recipient
    sent_accepted = FriendRequest.objects.filter(from_user=self, accepted=True).values_list('to_user', flat=True)
    received_accepted = FriendRequest.objects.filter(to_user=self, accepted=True).values_list('from_user', flat=True)
    
    # Combine the user IDs
    friend_ids = list(sent_accepted) + list(received_accepted)
    
    # Return queryset of User objects
    return User.objects.filter(id__in=friend_ids)

# Add the friends method to the User model
User.add_to_class('friends', friends)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics', blank=True)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a profile for new users"""
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Ensure profile exists and is saved when user is saved"""
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)