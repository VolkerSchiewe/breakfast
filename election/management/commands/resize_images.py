import PIL
from django.core.management import BaseCommand
from PIL import Image
import os


class Command(BaseCommand):
    help = 'Shrink uploaded images'

    def add_arguments(self, parser):
        parser.add_argument('upload_path', nargs='+', type=str)

    def handle(self, *args, **options):
        path = options['upload_path'][0]
        for image_path in os.listdir(path):
            print("Image: " + image_path)
            basewidth = 160
            img = Image.open(os.path.join(path, image_path))
            if basewidth in img.size:
                print("Already resized")
                continue
            wpercent = (basewidth / float(img.size[0]))
            hsize = int((float(img.size[1]) * float(wpercent)))
            img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)
            img.save(os.path.join(path, image_path))
            print("resized")
