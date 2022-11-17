from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .email import InvoiceDetailEmail
from .models import Invoice
from .serializers import InvoiceListSerializer, InvoiceRedSerializer, InvoiceWriteSerializer

SUCCESS_CREATED = "successfully created"
SUCCESS_UPDATE = "successfully updated"
SUCCESS_DELETE = "successfully deleted"


# localhost:8000/invoice/?page=3
# localhost:8000/invoice/?search=django
# http://localhost:8000/invoice/list/?ordering=-created_at
class InvoiceList(ListAPIView):
    queryset = Invoice.objects.select_related("company")
    serializer_class = InvoiceListSerializer
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (JWTAuthentication,) # if you make it in settings you don't have to make it here
    # pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = (
        "invoice_code",
        "client_name",
        "client_address",
        "client_email",
        "status",
        "company__name",
        "created_by__username",
    )
    ordering_fields = ("created_at", "updated_at")


class InvoiceViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Invoice.objects.select_related("company")

    def get_queryset(self):
        return self.queryset.filter(company__owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        context = {"request": request}
        invoice = get_object_or_404(self.queryset, invoice_code=pk)
        serializer = InvoiceRedSerializer(invoice, context=context)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        context = {}
        data = request.data

        serializer = InvoiceWriteSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            company_id = serializer.validated_data["company"]
            # company = Company.objects.get(id=company_id)
            serializer.save(created_by=self.request.user, modified_by=self.request.user, company=company_id)
            context["response"] = "ok"
            context["response_message"] = SUCCESS_CREATED

            return Response(context, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        data = request.data
        print(data)
        request.user
        invoice = get_object_or_404(self.queryset, invoice_code=pk)
        items_data = {"items": data.get("items", None)}
        serializer = InvoiceWriteSerializer(invoice, data=data, context=items_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            context["response"] = "ok"
            context["response_message"] = SUCCESS_UPDATE
            return Response(context, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        request.user
        invoice = get_object_or_404(self.queryset, invoice_code=pk)
        operation = invoice.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def SendInvoice(request, invoice_code):
    response_data = {}
    invoice = get_object_or_404(Invoice, pk=invoice_code, created_by=request.user)
    to = [invoice.client_email]
    context = {"invoice": invoice}
    try:
        InvoiceDetailEmail(request, context).send(to)
        response_data["response"] = "Ok"
        response_data["message"] = "Email sent Successfully"
        response_status = status.HTTP_200_OK
    except KeyError:
        response_data["response"] = "Error"
        response_data["message"] = "Email Sending Failed!"
        response_status = status.HTTP_400_BAD_REQUEST
    return Response(response_data, status=response_status)


# @api_view(['GET'])
# def Generate_pdf(request, invoice_code):
#     invoice = get_object_or_404(Invoice, pk=invoice_code, created_by=request.user)

#     template_name = 'pdf.html'

#     template = get_template(template_name)
#     html = template.render({'invoice': invoice})
#     pdf = pdfkit.from_string(html, False, options={})

#     response = HttpResponse(pdf, content_type='application/pdf')
#     response['Content-Disposition'] = 'attachment; filename="invoice.pdf"'

#     return response


# @api_view(['GET'])
# @authentication_classes([authentication.TokenAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def send_reminder(request, invoice_id):
#     invoice = get_object_or_404(Invoice, pk=invoice_id, created_by=request.user)
#     team = Team.objects.filter(created_by=request.user).first()

#     subject = 'Unpaid invoice'
#     from_email = team.email
#     to = [invoice.client.email]
#     text_content = 'You have an unpaid invoice. Invoice number: #' + str(invoice.invoice_number)
#     html_content = 'You have an unpaid invoice. Invoice number: #' + str(invoice.invoice_number)

#     msg = EmailMultiAlternatives(subject, text_content, from_email, to)
#     msg.attach_alternative(html_content, "text/html")

#     template = get_template('pdf.html')
#     html = template.render({'invoice': invoice, 'team': team})
#     pdf = pdfkit.from_string(html, False, options={})

#     if pdf:
#         name = 'invoice_%s.pdf' % invoice.invoice_number
#         msg.attach(name, pdf, 'application/pdf')

#     msg.send()

#     return Response()
