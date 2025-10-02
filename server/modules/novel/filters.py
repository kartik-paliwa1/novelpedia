import django_filters
from .models import Novel

class NovelFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Novel
        fields = ['search', 'status']
