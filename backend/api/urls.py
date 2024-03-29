from django.urls import include, path
from rest_framework import routers

from api import views

router = routers.DefaultRouter()
router.register(r"datasets", views.DatasetViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path(
        "datasets/<slug:dataset>/search/",
        views.search_dataset,
        name="dataset-search",
    ),
    path(
        "datasets/<slug:dataset>/geometry/",
        views.geometry_for_ids,
        name="dataset-geometry",
    ),
    path(
        "datasets/<slug:dataset>/algorithms/<slug:algorithm>/",
        views.run_algorithm,
        name="dataset-run-algorithm",
    ),
    path(
        "datasets/<slug:dataset>/metrics/<slug:metric>/",
        views.ExploreMetricView.as_view(),
        name="explore-metric-detail",
    ),
    path(
        "datasets/<slug:dataset>/detail/<str:pk>/",
        views.DetailView.as_view(),
        name="dataset-detail",
    ),
    path(
        "api-auth/", include("rest_framework.urls", namespace="rest_framework")
    ),
]
