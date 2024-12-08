from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.utils.timezone import now
from datetime import timedelta

class RoleType(models.TextChoices):
    ADMIN = 'admin'
    STUDENT = 'student'
    TEACHER = 'teacher'

class Role(models.Model):
    roleName = models.CharField(max_length=50, choices=RoleType.choices, default=RoleType.STUDENT)
    description = models.TextField()
    
    def __str__(self):
        return self.roleName

class TimeLog(models.Model):
    createdAt = models.DateTimeField(default=timezone.now)
    updatedAt = models.DateTimeField(auto_now=True)

def get_default_verification_expiration():
    return now() + timedelta(days=3)

class CustomUser(AbstractUser):
    is_verified = models.BooleanField(default=False)
    verification_expiration_date = models.DateTimeField(default=get_default_verification_expiration)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',
        blank=True
    )

class EmailVerification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    email = models.EmailField()
    verified = models.BooleanField(default=False)
    primary = models.BooleanField(default=False)
    expiration_date = models.DateTimeField(default=get_default_verification_expiration)

    class Meta:
        unique_together = [['user', 'email']]

    def __str__(self):
        return f"{self.email} ({self.user.username})"


class UploadedImage(models.Model):
    image = models.ImageField(upload_to='images/')
    extracted_text = models.TextField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Automatically set the timestamp when the image is uploaded

    def __str__(self):
        return f"Image {self.id} - Extracted Text: {self.extracted_text[:30]}"

class UploadedDocument(models.Model):
    document = models.FileField(upload_to='documents/')  # Store in the 'documents' folder
    extracted_text = models.TextField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Automatically set the timestamp when the document is uploaded

    def __str__(self):
        return f"Document {self.id} - Extracted Text: {self.extracted_text[:30]}"
    
class UploadedFile(models.Model):
    FILE_TYPES = [
        ('image', 'Image'),
        ('document', 'Document'),
    ]
    file = models.FileField(upload_to='uploads/')
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_type.capitalize()} - {self.file.name}"
    
class Notebook(models.Model):
    name = models.TextField(max_length=255)
    image_description = models.ForeignKey(UploadedImage, on_delete=models.CASCADE,blank=True,null=True)
    file_description= models.ForeignKey(UploadedFile, on_delete=models.CASCADE,blank=True,null=True)


class Prompt(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,blank=True,null=True) #tracks to the user who made the prompt lull
    user_prompt = models.TextField()  # The text of the user's prompt
    bot_response = models.TextField(null=True, blank=True)  # The bot's response to the prompt
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of when the prompt was created


class Schedule(models.Model):
    DAYS_OF_WEEK = [
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
        ('sun', 'Sunday'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="schedules")
    title = models.CharField(max_length=255)
    day_of_the_week = models.CharField(max_length=3, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.title} on {self.get_day_of_the_week_display()} ({self.start_time})-{self.end_time}"

class StudyPlan(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="study_plans")
    day_of_the_week = models.CharField(max_length=3, choices=Schedule.DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField(null=True)
    task = models.TextField()  
    
    def __str__(self):
        return f"Study task on {self.get_day_of_the_week_display()} ({self.start_time})-{self.end_time}"

class Quiz(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="quizzes")
    title = models.CharField(max_length=255)
    body = models.TextField()
    file = models.FileField(upload_to="uploads/quiz/", blank=True, null=True)
    image = models.ImageField(upload_to="uploads/quiz/", blank=True, null=True)
    questions = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class FlashCards(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="flashcards")
    title = models.CharField(max_length=255)
    body = models.TextField()
    file = models.FileField(upload_to="uploads/flashcards/", blank=True, null=True)
    image = models.ImageField(upload_to="uploads/flashcards", blank=True, null=True)
    questions = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Session(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Link the session to a user
    CATEGORY_CHOICES = [
        ('quiz', 'Quiz'),
        ('flashcard', 'Flashcard'),
        # Add more categories as needed
    ]
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, null=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True) 
    flashcards = models.ForeignKey(FlashCards, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return f"{self.title} - {self.user.username}"