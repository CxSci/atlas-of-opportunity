from backend.settings import DASHBOARD_DATABASE
from rest_framework import permissions, views, viewsets
from rest_framework.response import Response

from api.models import Dataset
from api.serializers import DatasetSerializer

import psycopg2 as pg


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ExploreMetricView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, dataset=None, metric=None, format=None):
        dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
            **DASHBOARD_DATABASE
        )

        sqls = {
            "small-business-support": {
                "income_diversity": {
                    "table": "sa2_info_for_dashboard",
                    "primary_key": "sa2_code",
                    "metric": "income_diversity"
                }
            }
        }

        params = sqls.get(dataset, None).get(metric, None)

        conn = pg.connect(dsn)
        sql = "select {primary_key} as id, {metric} as data from {table}".format(**params)
        with conn.cursor(cursor_factory=pg.extras.RealDictCursor) as cur:
            cur.execute(sql)
            result = cur.fetchall()
            print(result)
            return Response(result)
        return Response()
