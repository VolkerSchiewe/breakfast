from django.db import models
from PIL import Image as PILImage


class Image(models.Model):
    name = models.CharField(max_length=128)
    file = models.ImageField(upload_to='uploads/')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super(Image, self).save(*args, **kwargs)
        if self.file:
            image = PILImage.open(self.file)
            width = 160
            ratio = (width / float(image.size[0]))
            height = int((float(image.size[1]) * float(ratio)))
            image = image.resize((width, height), PILImage.ANTIALIAS)
            image.save(self.file.path)
