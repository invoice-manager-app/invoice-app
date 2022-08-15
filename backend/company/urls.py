from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AllCompanies, CompanyVewSet

# app_name = 'post'


urlpatterns = [
    path("all/", AllCompanies.as_view(), name="all_companies"),
    # path('lists/<str:slug>/', OnePost,name="all_posts"),
]
router = DefaultRouter()
router.register("", CompanyVewSet, basename="company")
urlpatterns += router.urls
