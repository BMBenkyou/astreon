import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Quiz(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    body = models.TextField()
    file = models.FileField(upload_to="uploads/quiz/", blank=True, null=True)
    image = models.ImageField(upload_to="uploads/quiz/", blank=True, null=True)
    questions = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Session(models.Model):
    CATEGORY_CHOICES = (
        ('quiz', 'Quiz'),
        ('flashcard', 'Flashcard'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.title}"

class FlashCards(models.Model):
    user_id = models.UUIDField(default=uuid.uuid4) 
    title = models.CharField(max_length=255)
    body = models.TextField()
    file = models.FileField(upload_to="uploads/flashcards/", blank=True, null=True)
    image = models.ImageField(upload_to="uploads/flashcards/", blank=True, null=True)
    questions = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# Create your models here.
