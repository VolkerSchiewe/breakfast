# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-10-31 10:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('election', '0002_subelection_is_multi_selectable'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='candidate',
            options={'ordering': ['name']},
        ),
        migrations.AlterModelOptions(
            name='subelection',
            options={'ordering': ['title']},
        ),
        migrations.RemoveField(
            model_name='subelection',
            name='short',
        ),
        migrations.AlterField(
            model_name='image',
            name='file',
            field=models.ImageField(upload_to='uploads/'),
        ),
    ]
