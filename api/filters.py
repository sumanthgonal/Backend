import django_filters
from django.db.models import Q
from .models import Transaction, Category


class TransactionFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    category = django_filters.NumberFilter(method='filter_category')
    type = django_filters.ChoiceFilter(choices=Category.TYPE_CHOICES, method='filter_by_type')
    
    class Meta:
        model = Transaction
        fields = ['start_date', 'end_date', 'min_amount', 'max_amount', 'category', 'type']
    
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        self.user = user
    
    def filter_by_type(self, queryset, name, value):
        return queryset.filter(category__type=value)
    
    def filter_category(self, queryset, name, value):
        # Validate that the category belongs to the current user
        if self.user and value:
            try:
                category = Category.objects.get(id=value, user=self.user)
                return queryset.filter(category=category)
            except Category.DoesNotExist:
                # Return empty queryset if category doesn't exist for this user
                return queryset.none()
        return queryset
