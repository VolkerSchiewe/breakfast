import random
import string


def generate_random_string(length, number=1):
    codes = []
    for i in range(0, number):
        item = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(length))
        codes.append(item)

    return codes[0] if len(codes) == 1 else codes
