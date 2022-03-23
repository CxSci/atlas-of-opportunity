from rest_framework import viewsets
from rest_framework import permissions

from api.models import Dataset
from api.serializers import DatasetSerializer


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
