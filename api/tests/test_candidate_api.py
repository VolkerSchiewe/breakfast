import os

from api.tests.test_cases import BallotsApiTestCase
from election.models import Candidate


class CandidateApiTest(BallotsApiTestCase):
    def test_create_candidate_with_image(self):
        data = {
            'subElection': 1,
            'name': 'Tester',
            'image': {
                'name': 'Tester',
                'base64Image': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAYAAACKAxD9AAAACXBIWXMAABcRAAAXEQHKJvM/AAADpklEQVR42u3dv20bMRSA8adXW4g3ibOBaxWyNrDc+NpskIyQ9ipLGwgqVGcEZ4OMkEADKEVkA4L/STqSj3zv+xY4gvcD7w5HgKPdbidRG8+6SxH5KSKP21U/l8ApCOSziNyOZ90CCLERPBUag4LgoLAYFARgCAXhSARhMSgIwBACwpkIwmFQEIDBNYRECMJgUBCAwSWETAjcY1AQgMEVhEII3GJQEIDBBQQjBO4wjFrej2CM4Km/InK1XfW/WRFiI7huHUGzECpD8Mg7AghcIGgOAgiAAAIggAAIIAACCIAAAiCAAAggAAIIgAACIIAACCAAAggOm276y+mm/x4WAgj+I9jPwbfppl+EgwCCAwRPc3BriUFBUAUCscagIKgGgSkGBUFVCMwwKAiqQ2CCQUFQJYLiGBQE1SIoikFBUDWCYhgUBNUjKIJBQdAEguwYFATNIMiKQUHQFIJsGBQEzSHIgkFB0CSC5BgUBEmynIMkGBQESfphfP3BGBQEw1tPuoWI3LWMQUEAhpMhgMAvBgUBGI6GAAL/GBQEYPgQAgjiYFAQgOFNCCCIh0FBAIYXEEAQF4OCAAzPEEAAhtHFzT0IjJpu+rmIPBgPY7medPPRxc39IwjAoCJifQM+iciVkGm6XfVzEVkaj+NhPOvmrAZ2jwYVEQFDbAQHn49giIvgAAIY4iJ4AQEMMRG8CgEM8RC8CQEMsRC8CwEMcRB8CAEMMRAcBQEM/hEcDQEMvhGcBAEMfhGcDAEMPhGcBQEM/hCcDQEMvhAMggCGg762jGAwBDA8dy0iv1pFkAQCGETWk+6PEYYkCJJBAIMJhmQIkkIAQ1EMSREkhwCGIhiSI8gCAQxZMWRBkA0CGLJgyIYgKwQwJMWQFUF2CGBIgiE7giIQwDAIQxEExSCA4SwMxRAUhQCGkzAURVAcAhiOwlAcgQkEMLyLwQSBGQQwvIrBDIGIyGi325neifGsW4jIrTGIu+3K5pT2/ekv8/WkMz3zwRwCGOpIaxgEm1uAAAYggAEIYAACGIAABiCAAQhgAAIYgAAGIIABCGAAAhiAAAYHVfEbekiV/ML+0vrBI9q65ApWhqWH02eah2CMYbm/Nu8IgTG4QeAKQmEMrhC4g1AIgzsELiFkxuASgVsImTC4ReAaQmIMrhG4h5AIg3sEISAMxBACQRgIZ2IIgyAUhBMxhEIQDsKRGMIhCAnhAwwhEYSF8AaGsAhEHOxHGNp+P4NERiAi8g8HVRHgNdnhWwAAAABJRU5ErkJggg=="
            }
        }
        response = self.client.post('/api/candidates/', data, format='json')
        self.assertEqual(response.status_code, 201)
        candidate = Candidate.objects.get(pk=response.data.get('id'))
        self.assertEqual(candidate.name, 'Tester')
        self.assertEqual(candidate.image.name, 'Tester')

    def test_create_candidate(self):
        data = {
            'subElection': 1,
            'name': 'Tester',
            'image': None,
        }
        response = self.client.post('/api/candidates/', data, format='json')
        self.assertEqual(response.status_code, 201)
        candidate = Candidate.objects.get(pk=response.data.get('id'))
        self.assertEqual(candidate.name, 'Tester')

    def test_update_candidate_remove_image(self):
        candidate = Candidate.objects.get(pk=3)
        self.assertEqual(candidate.name, 'Max')
        data = {
            'subElection': 1,
            'name': 'Tester',
            'image': None,
        }
        response = self.client.patch('/api/candidates/{}/'.format(candidate.id), data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Candidate.objects.get(pk=3).name, 'Tester')
        self.assertEqual(Candidate.objects.get(pk=3).image, None)

    def test_update_candidate_with_image(self):
        candidate = Candidate.objects.get(pk=3)
        old_image = candidate.image.file
        self.assertEqual(candidate.name, 'Max')
        data = {
            'subElection': 1,
            'name': 'Tester',
            'image': {
                'name': 'Tester',
                'base64Image': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAYAAACKAxD9AAAACXBIWXMAABcRAAAXEQHKJvM/AAADpklEQVR42u3dv20bMRSA8adXW4g3ibOBaxWyNrDc+NpskIyQ9ipLGwgqVGcEZ4OMkEADKEVkA4L/STqSj3zv+xY4gvcD7w5HgKPdbidRG8+6SxH5KSKP21U/l8ApCOSziNyOZ90CCLERPBUag4LgoLAYFARgCAXhSARhMSgIwBACwpkIwmFQEIDBNYRECMJgUBCAwSWETAjcY1AQgMEVhEII3GJQEIDBBQQjBO4wjFrej2CM4Km/InK1XfW/WRFiI7huHUGzECpD8Mg7AghcIGgOAgiAAAIggAAIIAACCIAAAiCAAAggAAIIgAACIIAACCAAAggOm276y+mm/x4WAgj+I9jPwbfppl+EgwCCAwRPc3BriUFBUAUCscagIKgGgSkGBUFVCMwwKAiqQ2CCQUFQJYLiGBQE1SIoikFBUDWCYhgUBNUjKIJBQdAEguwYFATNIMiKQUHQFIJsGBQEzSHIgkFB0CSC5BgUBEmynIMkGBQESfphfP3BGBQEw1tPuoWI3LWMQUEAhpMhgMAvBgUBGI6GAAL/GBQEYPgQAgjiYFAQgOFNCCCIh0FBAIYXEEAQF4OCAAzPEEAAhtHFzT0IjJpu+rmIPBgPY7medPPRxc39IwjAoCJifQM+iciVkGm6XfVzEVkaj+NhPOvmrAZ2jwYVEQFDbAQHn49giIvgAAIY4iJ4AQEMMRG8CgEM8RC8CQEMsRC8CwEMcRB8CAEMMRAcBQEM/hEcDQEMvhGcBAEMfhGcDAEMPhGcBQEM/hCcDQEMvhAMggCGg762jGAwBDA8dy0iv1pFkAQCGETWk+6PEYYkCJJBAIMJhmQIkkIAQ1EMSREkhwCGIhiSI8gCAQxZMWRBkA0CGLJgyIYgKwQwJMWQFUF2CGBIgiE7giIQwDAIQxEExSCA4SwMxRAUhQCGkzAURVAcAhiOwlAcgQkEMLyLwQSBGQQwvIrBDIGIyGi325neifGsW4jIrTGIu+3K5pT2/ekv8/WkMz3zwRwCGOpIaxgEm1uAAAYggAEIYAACGIAABiCAAQhgAAIYgAAGIIABCGAAAhiAAAYHVfEbekiV/ML+0vrBI9q65ApWhqWH02eah2CMYbm/Nu8IgTG4QeAKQmEMrhC4g1AIgzsELiFkxuASgVsImTC4ReAaQmIMrhG4h5AIg3sEISAMxBACQRgIZ2IIgyAUhBMxhEIQDsKRGMIhCAnhAwwhEYSF8AaGsAhEHOxHGNp+P4NERiAi8g8HVRHgNdnhWwAAAABJRU5ErkJggg=="
            },
        }
        response = self.client.patch('/api/candidates/{}/'.format(candidate.id), data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Candidate.objects.get(pk=3).name, 'Tester')
        self.assertNotEqual(Candidate.objects.get(pk=3).image.file, old_image)

    def test_update_candidate_create_image(self):
        candidate = Candidate.objects.get(pk=2)
        self.assertIsNone(candidate.image)
        self.assertEqual(candidate.name, 'Maria Muster')
        data = {
            'subElection': 1,
            'name': 'Tester',
            'image': {
                'name': 'Tester',
                'base64Image': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAYAAACKAxD9AAAACXBIWXMAABcRAAAXEQHKJvM/AAADpklEQVR42u3dv20bMRSA8adXW4g3ibOBaxWyNrDc+NpskIyQ9ipLGwgqVGcEZ4OMkEADKEVkA4L/STqSj3zv+xY4gvcD7w5HgKPdbidRG8+6SxH5KSKP21U/l8ApCOSziNyOZ90CCLERPBUag4LgoLAYFARgCAXhSARhMSgIwBACwpkIwmFQEIDBNYRECMJgUBCAwSWETAjcY1AQgMEVhEII3GJQEIDBBQQjBO4wjFrej2CM4Km/InK1XfW/WRFiI7huHUGzECpD8Mg7AghcIGgOAgiAAAIggAAIIAACCIAAAiCAAAggAAIIgAACIIAACCAAAggOm276y+mm/x4WAgj+I9jPwbfppl+EgwCCAwRPc3BriUFBUAUCscagIKgGgSkGBUFVCMwwKAiqQ2CCQUFQJYLiGBQE1SIoikFBUDWCYhgUBNUjKIJBQdAEguwYFATNIMiKQUHQFIJsGBQEzSHIgkFB0CSC5BgUBEmynIMkGBQESfphfP3BGBQEw1tPuoWI3LWMQUEAhpMhgMAvBgUBGI6GAAL/GBQEYPgQAgjiYFAQgOFNCCCIh0FBAIYXEEAQF4OCAAzPEEAAhtHFzT0IjJpu+rmIPBgPY7medPPRxc39IwjAoCJifQM+iciVkGm6XfVzEVkaj+NhPOvmrAZ2jwYVEQFDbAQHn49giIvgAAIY4iJ4AQEMMRG8CgEM8RC8CQEMsRC8CwEMcRB8CAEMMRAcBQEM/hEcDQEMvhGcBAEMfhGcDAEMPhGcBQEM/hCcDQEMvhAMggCGg762jGAwBDA8dy0iv1pFkAQCGETWk+6PEYYkCJJBAIMJhmQIkkIAQ1EMSREkhwCGIhiSI8gCAQxZMWRBkA0CGLJgyIYgKwQwJMWQFUF2CGBIgiE7giIQwDAIQxEExSCA4SwMxRAUhQCGkzAURVAcAhiOwlAcgQkEMLyLwQSBGQQwvIrBDIGIyGi325neifGsW4jIrTGIu+3K5pT2/ekv8/WkMz3zwRwCGOpIaxgEm1uAAAYggAEIYAACGIAABiCAAQhgAAIYgAAGIIABCGAAAhiAAAYHVfEbekiV/ML+0vrBI9q65ApWhqWH02eah2CMYbm/Nu8IgTG4QeAKQmEMrhC4g1AIgzsELiFkxuASgVsImTC4ReAaQmIMrhG4h5AIg3sEISAMxBACQRgIZ2IIgyAUhBMxhEIQDsKRGMIhCAnhAwwhEYSF8AaGsAhEHOxHGNp+P4NERiAi8g8HVRHgNdnhWwAAAABJRU5ErkJggg=="
            },
        }
        response = self.client.patch('/api/candidates/{}/'.format(candidate.id), data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Candidate.objects.get(pk=2).name, 'Tester')
        self.assertIsNotNone(Candidate.objects.get(pk=2).image.file)

    def test_missing_file(self):
        data = {
            'subElection': 1,
            'name': 'Tester',
            'image': {
                'name': 'Tester',
                'base64Image': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAYAAACKAxD9AAAACXBIWXMAABcRAAAXEQHKJvM/AAADpklEQVR42u3dv20bMRSA8adXW4g3ibOBaxWyNrDc+NpskIyQ9ipLGwgqVGcEZ4OMkEADKEVkA4L/STqSj3zv+xY4gvcD7w5HgKPdbidRG8+6SxH5KSKP21U/l8ApCOSziNyOZ90CCLERPBUag4LgoLAYFARgCAXhSARhMSgIwBACwpkIwmFQEIDBNYRECMJgUBCAwSWETAjcY1AQgMEVhEII3GJQEIDBBQQjBO4wjFrej2CM4Km/InK1XfW/WRFiI7huHUGzECpD8Mg7AghcIGgOAgiAAAIggAAIIAACCIAAAiCAAAggAAIIgAACIIAACCAAAggOm276y+mm/x4WAgj+I9jPwbfppl+EgwCCAwRPc3BriUFBUAUCscagIKgGgSkGBUFVCMwwKAiqQ2CCQUFQJYLiGBQE1SIoikFBUDWCYhgUBNUjKIJBQdAEguwYFATNIMiKQUHQFIJsGBQEzSHIgkFB0CSC5BgUBEmynIMkGBQESfphfP3BGBQEw1tPuoWI3LWMQUEAhpMhgMAvBgUBGI6GAAL/GBQEYPgQAgjiYFAQgOFNCCCIh0FBAIYXEEAQF4OCAAzPEEAAhtHFzT0IjJpu+rmIPBgPY7medPPRxc39IwjAoCJifQM+iciVkGm6XfVzEVkaj+NhPOvmrAZ2jwYVEQFDbAQHn49giIvgAAIY4iJ4AQEMMRG8CgEM8RC8CQEMsRC8CwEMcRB8CAEMMRAcBQEM/hEcDQEMvhGcBAEMfhGcDAEMPhGcBQEM/hCcDQEMvhAMggCGg762jGAwBDA8dy0iv1pFkAQCGETWk+6PEYYkCJJBAIMJhmQIkkIAQ1EMSREkhwCGIhiSI8gCAQxZMWRBkA0CGLJgyIYgKwQwJMWQFUF2CGBIgiE7giIQwDAIQxEExSCA4SwMxRAUhQCGkzAURVAcAhiOwlAcgQkEMLyLwQSBGQQwvIrBDIGIyGi325neifGsW4jIrTGIu+3K5pT2/ekv8/WkMz3zwRwCGOpIaxgEm1uAAAYggAEIYAACGIAABiCAAQhgAAIYgAAGIIABCGAAAhiAAAYHVfEbekiV/ML+0vrBI9q65ApWhqWH02eah2CMYbm/Nu8IgTG4QeAKQmEMrhC4g1AIgzsELiFkxuASgVsImTC4ReAaQmIMrhG4h5AIg3sEISAMxBACQRgIZ2IIgyAUhBMxhEIQDsKRGMIhCAnhAwwhEYSF8AaGsAhEHOxHGNp+P4NERiAi8g8HVRHgNdnhWwAAAABJRU5ErkJggg=="
            },
        }
        response = self.client.patch('/api/candidates/2/', data, format='json')
        self.assertEqual(response.status_code, 200)
        candidate = Candidate.objects.get(pk=2)
        os.remove(candidate.image.file.path)
        response = self.client.get('/api/candidates/{}/'.format(candidate.id))
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.data.get('base64image'))
