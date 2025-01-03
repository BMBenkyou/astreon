# Generated by Django 4.2.16 on 2024-12-05 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_quiz'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='uploads/quiz/'),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='uploads/quiz/'),
        ),
    ]
