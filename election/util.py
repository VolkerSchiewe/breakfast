import random
import string


def generate_random_string(length, number=1, blacklist=None):
    if blacklist is None:
        blacklist = []
    codes = []
    while len(codes) < number:
        item = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(length))
        if not (item in codes or 'l' in item or 'I' in item or item in blacklist):
            codes.append(item)

    return codes[0] if len(codes) == 1 else codes
