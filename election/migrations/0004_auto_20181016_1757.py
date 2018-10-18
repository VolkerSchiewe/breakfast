# Generated by Django 2.1.2 on 2018-10-16 15:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('election', '0003_auto_20171031_1154'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='candidate',
            options={'ordering': ['name']},
        ),
        migrations.RenameField(
            model_name='candidate',
            old_name='title',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='image',
            old_name='title',
            new_name='name',
        ),
        migrations.AlterField(
            model_name='candidate',
            name='image',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                                    to='election.Image'),
        ),
        migrations.AlterField(
            model_name='electionuser',
            name='election',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                                    to='election.Election'),
        ),
    ]