from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import Generate_pdf, InvoiceList, InvoiceViewSet, Send_reminder, SendInvoice

urlpatterns = [
    path("list/", InvoiceList.as_view(), name="invoice_list"),
    path("<str:invoice_code>/generate_pdf/", Generate_pdf, name="generate_pdf"),
    path("<str:invoice_code>/send_invoice/", SendInvoice, name="send_invoice"),
    path("<str:invoice_code>/send_reminder/", Send_reminder, name="send_reminder"),
]
router = DefaultRouter()
router.register("", InvoiceViewSet, basename="invoices")
urlpatterns += router.urls



# HOW TO USE INVOICE ENDPOINTS

"""
http://localhost:8000/invoice/list/   - GET    --> To get list of invoices for the invoices page(first 10 objects)

PAGINATION
http://localhost:8000/invoice/list/?page=2
because the pagation will split the data to 10 objects per page
you can specified the page like this to get specific page

SEARCH
http://localhost:8000/invoice/list/?search=django
It will search in all these fields in the invoice
        "invoice_code",
        "client_name",
        "client_address",
        "client_email",
        "status",
        "company__name",
        "created_by__username"

ORDERING
http://localhost:8000/invoice/list/?ordering=-created_at
it will work in ("created_at","updated_at") fields and
if put (-) like (-updated_at) before the field name it will order the data in the opposite way

MIX
you can mix the search and ordering together like this
http://localhost:8000/invoice/list/?search=karam&ordering=-created_at
____________________________________________________________________________

http://localhost:8000/invoice/        - POST   --> To Create Invoice
body should be like:
{
    "client_name":"Karamyyy Farhan", # Required
    "client_email":"karam@gmail.com", # Required
    "client_number":"+9984737383",  # Not Required
    "client_address":"Iraq. Baghdad. AL Ola Street 4/3",  # Required
    "client_zipcode":3433,  # Not Required
    "client_city":"Baghdad", # Required
    "client_country":"Iraq", # Required
    "due_after":10,  # Required - default = 10 days
    "discount_amount":12, # Not Required - default = 0
    "description":"please pay it in the very soon time", # Not Required
    "company":"google",#  Required - her you give the company slug filed
    "items": [
        {
            "title": "AX", #  Required
            "quantity": 2, #  Not Required - default = 1
            "unit_price": 160, #  Required
            "tax_rate": 10 # Not Required - default = 0
        },
        {
            "title": "BX",
            "quantity": 5,
            "unit_price": 25,
            "tax_rate": 0
        }
    ]
}
_____________________________________________________________________

http://localhost:8000/invoice/<id>/   - GET    --> To get The invoice data

____________________________________________________________________

http://localhost:8000/invoice/<id>/   - PUT    --> To Update certain Invoice

NOTE:
partial update is available (mean you can send only the fileds you want to update)
the full data should be like this:
{
    "client_name":"Karam UP7 Farhan",
    "client_email":"karam@gmail.com",
    "client_number":"+9984737383",
    "client_address":"Iraq. Baghdad. AL Ola Street 4/3",
    "client_zipcode":3433,
    "client_city":"Baghdad",
    "client_country":"Iraq",
    "due_after":10,
    "discount_amount":12,
    "description":"please pay it in the very soon time",
    "status":"pending", ## paid or pending
    "items": [
        {
            "id": 21, ## if you want to update an existant item you should pass its ID
            "title": "AX",
            "quantity": 2,
            "unit_price": 160,
            "tax_rate": 10
        },
        {
            "id": 22,
            "title": "BX",
            "quantity": 5,
            "unit_price": 25,
            "tax_rate": 0
        },
        {
            "title": "CX", ## To add new Item you don't have to pass an ID
            "quantity": 10,
            "unit_price": 10,
            "tax_rate": 10
        },
        {
            "id": 43,  ## To delete item just put it's ID and make thr delete key true
            "delete": true
        }
    ]
}
_______________________________________________________________________

http://localhost:8000/invoice/<id>/   - DELETE --> To delete certain Invoice


____________________________________________________________________________
http://localhost:8000/company/list/ - GET --> To get all Companies for the select bar when you create new invoice
"""
