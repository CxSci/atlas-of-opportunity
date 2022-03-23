from django.db import models


# TODO: Flesh out layout model beyond JSONFields.
class Dataset(models.Model):
    id = models.SlugField(
        max_length=255, unique=True, primary_key=True
    )  # small-business-support
    title = models.CharField(
        max_length=255, default=""
    )  # Small Business Support
    description = models.TextField()
    explore_layout = models.JSONField()
    detail_layout = models.JSONField()

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return f'Dataset(id="{self.id}", title="{self.title}")'
