from django.http import HttpResponse
from django.http import HttpResponseNotFound
import magic


def serve_file(file, file_name=None, content_type=None):
    if not file:
        return HttpResponseNotFound()

    if content_type is None:
        content_type = magic.from_file(file.path, mime=True)

    response = HttpResponse(file, content_type=content_type)
    if not file_name:
        file_name = file.name.split('/')[-1]
    response['Content-Disposition'] = 'attachment; filename={}'.format(file_name)
    response['Content-Length'] = file.size
    return response
