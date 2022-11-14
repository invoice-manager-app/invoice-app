from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import InvoiceList, InvoiceViewSet

urlpatterns = [
    path("list/", InvoiceList.as_view(), name="invoice_list"),
    # path('', include(router.urls)),
    # path('invoices/<int:invoice_id>/generate_pdf/', generate_pdf, name='generate_pdf'),
    # path('invoices/<int:invoice_id>/send_reminder/', send_reminder, name='send_reminder'),
]
router = DefaultRouter()
router.register("", InvoiceViewSet, basename="invoices")
urlpatterns += router.urls
