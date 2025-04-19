from django.urls import path,include
from .views import get_profile, update_profile, delete_account
urlpatterns = [
    path('profile/', get_profile, name='get_profile'),
    path('profile/update/', update_profile, name='update_profile'),
    path('profile/delete/', delete_account, name='delete_account'),
] 


