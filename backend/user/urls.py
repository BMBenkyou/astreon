from django.urls import path,include
from . import views
urlpatterns = [
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/delete/', views.delete_account, name='delete_account'),
     path('users/', views.get_all_users, name='get_all_users'),
    path('friend-requests/', views.send_friend_request, name='send_friend_request'),
    path('friend-requests/list/', views.get_friend_requests, name='get_friend_requests'),
    path('friend-requests/accept/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('friend-requests/decline/<int:request_id>/', views.decline_friend_request, name='decline_friend_request'),
    path('friend-requests/cancel/<int:user_id>/', views.cancel_friend_request, name='cancel_friend_request'),
    path('friends/', views.get_friends, name='get_friends'),
    path('friends/remove/<int:user_id>/', views.remove_friend, name='remove_friend'),
    path('friendship-status/<int:user_id>/', views.check_friendship_status, name='check_friendship_status'),
] 


