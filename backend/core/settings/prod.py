DEBUG = False


ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

# ### PRODUCTION SETTING -- WITH AWS SERVIER
# # - make an account in aws
# # - make bucket in s3
# # - make user and give him the access to the bucket
# # - pip install  boto3
# # - pip install django-storages

# AWS_ACCESS_KEY_ID = 'AAKIATYYBUP12YW5YDX1235X2YCOEV'
# AWS_SECRET_ACCESS_KEY = 'YYaCxRJa213Qk61q7is612srYb523315EycY123ygasgGW0tYor0PfaciC210asdasdn8B'
# AWS_STORAGE_BUCKET_NAME = '19387112125n981efwefwe7b98c12'
# AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
# AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
# AWS_DEFAULT_ACL = 'public-read'

# AWS_LOCATION = 'static'
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'static'),
# ]

# # - now go and make the storages file in the main folder of the project
# STATIC_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)
# STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# DEFAULT_FILE_STORAGE = 'core.storages.MediaStore'
