import django_filters
from .models import Chapter

class ChapterFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(field_name='title', lookup_expr='icontains')

    class Meta:
        model = Chapter
        fields = ['search']
