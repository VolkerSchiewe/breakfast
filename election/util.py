import string
import random

from django.http import HttpResponse
from django.http import HttpResponseNotFound
import magic


def serve_file(file, file_name=None, content_type=None):
    if not file:
        return HttpResponseNotFound()

    if content_type is None:
        content_type = magic.from_file(file.name, mime=True)

    response = HttpResponse(file, content_type=content_type)
    if not file_name:
        file_name = file.name.split('/')[-1]
    response['Content-Disposition'] = 'attachment; filename={}'.format(file_name)
    response['Content-Length'] = file.size
    return response


def generate_random_string(length, number=1):
    codes = []
    for i in range(0, number):
        item = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(length))
        codes.append(item)

    return codes[0] if len(codes) == 1 else codes
