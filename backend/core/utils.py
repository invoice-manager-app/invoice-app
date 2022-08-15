import os
import random
import string

import cv2
from django.utils.text import slugify


def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


def unique_slug_generator(instance, new_slug=None):

    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.name)
        # if isinstance(instance, co_models.Course)
        # or isinstance(instance, co_models.Section) or isinstance(instance, co_models.Lecture) :
        #     slug = slugify(instance.title)
        # if isinstance(instance, st_models.Student) or isinstance(instance, te_models.Teacher):
        #     slug = slugify(instance.first_name +'-'+ instance.last_name)

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = f"{slug}-{random_string_generator(size=5)}"

        return unique_slug_generator(instance, new_slug=new_slug)
    return slug


def is_image_aspect_ratio_valid(img_url):
    img = cv2.imread(img_url)
    dimensions = tuple(img.shape[1::-1])  # gives: (width, height)
    # print("dimensions: " + str(dimensions))
    aspect_ratio = dimensions[0] / dimensions[1]  # divide w / h
    # print("aspect_ratio: " + str(aspect_ratio))
    if aspect_ratio < 1:
        return False
    return True


def is_image_size_valid(img_url, mb_limit):
    image_size = os.path.getsize(img_url)
    # print("image size: " + str(image_size))
    if image_size > mb_limit:
        return False
    return True
