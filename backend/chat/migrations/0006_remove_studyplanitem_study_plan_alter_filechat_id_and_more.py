# Generated by Django 5.1.6 on 2025-04-19 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_merge_0004_studyplan_studyplanitem_create_file_models'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='studyplanitem',
            name='study_plan',
        ),
        migrations.AlterField(
            model_name='filechat',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='uploadedfile',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.DeleteModel(
            name='StudyPlan',
        ),
        migrations.DeleteModel(
            name='StudyPlanItem',
        ),
    ]
