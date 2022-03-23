from rest_framework import serializers

from api.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
    exploreLayout = serializers.JSONField(source="explore_layout")
    detailLayout = serializers.JSONField(source="detail_layout")

    class Meta:
        model = Dataset
        fields = [
            "id",
            "title",
            "description",
            "exploreLayout",
            "detailLayout",
        ]
