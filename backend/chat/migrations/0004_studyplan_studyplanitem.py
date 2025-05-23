# Generated by Django 5.1.6 on 2025-04-14 01:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_quiz_quizquestion'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='StudyPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('raw_schedule', models.TextField(blank=True)),
                ('study_plan', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='study_plans', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StudyPlanItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('time_slot', models.CharField(max_length=50)),
                ('description', models.TextField()),
                ('study_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='chat.studyplan')),
            ],
            options={
                'ordering': ['date', 'time_slot'],
            },
        ),
    ]
