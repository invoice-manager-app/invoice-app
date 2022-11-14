# import pdfkit

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Invoice
from .serializers import InvoiceListSerializer, InvoiceRedSerializer, InvoiceWriteSerializer

# from apps.team.models import Team

# class InvoiceViewSet(viewsets.ModelViewSet):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = InvoiceSerializer
#     queryset = Invoice.objects.all()

#     def get_queryset(self):
#         return self.queryset.filter(created_by=self.request.user)

#     def perform_create(self, serializer):
#         company_id = serializer.validated_data["company"]
#         # company = Company.objects.get(id=company_id)
#         serializer.save(created_by=self.request.user, modified_by=self.request.user,company=company_id)

#     def perform_update(self, serializer):
#         obj = self.get_object()

#         if self.request.user != obj.created_by:
#             raise PermissionDenied('Wrong object owner')

#         serializer.save()

# @api_view(['GET'])
# @authentication_classes([authentication.TokenAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def generate_pdf(request, invoice_id):
#     invoice = get_object_or_404(Invoice, pk=invoice_id, created_by=request.user)
#     team = Team.objects.filter(created_by=request.user).first()

#     template_name = 'pdf.html'

#     if invoice.is_credit_for:
#         template_name = 'pdf_creditnote.html'

#     template = get_template(template_name)
#     html = template.render({'invoice': invoice, 'team': team})
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


SUCCESS_CREATED = "successfully created"
SUCCESS_UPDATE = "successfully updated"
SUCCESS_DELETE = "successfully deleted"


# localhost:8000/invoice/?page=3
# localhost:8000/invoice/?search=django
class InvoiceList(ListAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceListSerializer
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (JWTAuthentication,) # if you make it in settings you don't have to make it here
    pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("client_name", "client_address")


class InvoiceViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Invoice.objects.all()
    # TRY THIS AND ENABLE get_queryset func MAYBE IT WILL BE BETTER
    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)

    # def get_serializer_class(self):
    #     if self.action in ["create", "update", "partial_update", "destroy"]:
    #         return CreateCompanySerializer

    #     return CompanySerializer

    # def list(self, request, *args, **kwargs):
    #     queryset = Invoice.objects.filter(company__owner=request.user)
    #     context = {"request": request}
    #     serializer_class = InvoiceRedSerializer(queryset, context=context, many=True)
    #     return Response(serializer_class.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        context = {"request": request}
        invoice = get_object_or_404(self.queryset, invoice_code=pk)
        serializer_class = InvoiceRedSerializer(invoice, context=context)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

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
            # add_company_data_to_response(company, context)

            return Response(context, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        data = request.data
        request.user
        invoice = get_object_or_404(self.queryset, invoice_code=pk)
        items_data = {"items": data.pop("items")}
        serializer = InvoiceWriteSerializer(invoice, data=data, context=items_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            context["response"] = "ok"
            context["response_message"] = SUCCESS_UPDATE
            # add_company_data_to_response(company, context)
            return Response(context, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        request.user
        # queryset = Post.objects.filter(author=request.user)
        invoice = get_object_or_404(self.queryset, invoice_code=pk)
        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context, status=status.HTTP_400_BAD_REQUEST)
        operation = invoice.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)
