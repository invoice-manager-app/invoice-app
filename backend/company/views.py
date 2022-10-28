from company.models import Company
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import CompanyReadSerializer, CompanyWriteSerializer
from .utils import add_company_data_to_response

SUCCESS_CREATED = "successfully created"
SUCCESS_UPDATE = "successfully updated"
SUCCESS_DELETE = "successfully deleted"


# localhost:8000/api/post/all/?page=3
# localhost:8000/api/post/all/?search=django
class AllCompanies(ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyReadSerializer
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (JWTAuthentication,) # if you make it in settings you don't have to make it here
    pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("owner__username", "name")


class CompanyVewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Company.objects.all()

    # def get_serializer_class(self):
    #     if self.action in ["create", "update", "partial_update", "destroy"]:
    #         return CreateCompanySerializer

    #     return CompanySerializer

    def list(self, request, *args, **kwargs):
        queryset = Company.objects.filter(owner=request.user)
        context = {"request": request}
        serializer_class = CompanyReadSerializer(queryset, context=context, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        company = get_object_or_404(self.queryset, slug=pk)
        context = {"request": request}
        serializer_class = CompanyReadSerializer(company, context=context)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        context = {}
        data = request.data

        serializer = CompanyWriteSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            company = serializer.save(owner=request.user)
            context["response"] = "ok"
            context["response_message"] = SUCCESS_CREATED
            add_company_data_to_response(company, context)

            return Response(context, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        user = request.user
        company = get_object_or_404(self.queryset, slug=pk, owner=user)
        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context)
        serializer = CompanyWriteSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            company = serializer.save()
            context["response"] = "ok"
            context["response_message"] = SUCCESS_UPDATE
            add_company_data_to_response(company, context)
            return Response(context, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        user = request.user
        # queryset = Post.objects.filter(author=request.user)
        company = get_object_or_404(self.queryset, slug=pk, owner=user)
        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context, status=status.HTTP_400_BAD_REQUEST)
        operation = company.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)
