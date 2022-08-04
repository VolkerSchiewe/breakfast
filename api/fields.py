import base64
import re

from django.core.files.base import ContentFile
from rest_framework import serializers


class Base64StringField(serializers.Field):
    def to_internal_value(self, data):
        if data.startswith('data:image'):
            # base64 encoded image - decode
            img_format, img_str = data.split(';base64,')  # img_format ~= data:image/X,
            ext = img_format.split('/')[-1]  # guess file extension

            data = ContentFile(base64.b64decode(img_str), name='temp.' + ext)

        return data

    def to_representation(self, file):
        try:
            extension = re.search("(?<=\.)[\w+]+$", file.path).group(0)
            extension = extension if extension.lower() != 'jpg' else 'jpeg'
            with open(file.path, 'rb') as f:
                return 'data:image/{};base64,{}'.format(extension.lower(), base64.b64encode(f.read()).decode())
        except FileNotFoundError:
            return ''
        except Exception as e:
            raise IOError("Error encoding file" + str(e))
