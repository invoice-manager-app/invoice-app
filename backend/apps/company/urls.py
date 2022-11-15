from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CompanySelectBarView, CompanyVewSet

# app_name = 'post'


urlpatterns = [
    path("list/", CompanySelectBarView.as_view(), name="all_companies"),
    # path('lists/<str:slug>/', OnePost,name="all_posts"),
]
router = DefaultRouter()
router.register("", CompanyVewSet, basename="company")
urlpatterns += router.urls
