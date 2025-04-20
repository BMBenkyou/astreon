from django.urls import path
from .views import ChatView, QuizGenerationView, FileUploadView, FileChatView, UserFilesView, UserQuizzesView, QuizDetailView, FlashcardGenerationView, FlashcardSetDetailView,UserFlashcardSetsView
from . import views

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('quiz/generate/', QuizGenerationView.as_view(), name='quiz'),
    path('flashcard/generate/',FlashcardGenerationView.as_view(), name='flashcard'),
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('chat/file/', FileChatView.as_view(), name='file-chat'),
    path('files/', UserFilesView.as_view(), name='user-files'),
    path('chat/file-context/init/', views.init_file_chat, name='init_file_chat'),
    path('quizzes/', UserQuizzesView.as_view(), name='user-quizzes'),
    path('quizzes/<int:quiz_id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('flashcard/sets/',UserFlashcardSetsView.as_view(), name='user-quizzes'),
    path('flashcards/<int:set_id>/',FlashcardSetDetailView.as_view(), name='quiz-detail'),

]