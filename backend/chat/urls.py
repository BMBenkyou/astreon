from django.urls import path
from .views import ChatView, QuizGenerationView, FileUploadView, FileChatView, UserFilesView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('quiz/generate/', QuizGenerationView.as_view(), name='quiz'),
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('chat/file/', FileChatView.as_view(), name='file-chat'),
    path('files/',UserFilesView.as_view(), name='user-files'),

]