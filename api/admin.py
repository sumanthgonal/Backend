from django.contrib import admin
from .models import Category, Transaction, Budget


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'user', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['name', 'user__username']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['category', 'amount', 'date', 'user', 'created_at']
    list_filter = ['category__type', 'date', 'created_at']
    search_fields = ['category__name', 'note', 'user__username']
    date_hierarchy = 'date'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['user', 'year', 'month', 'amount', 'created_at']
    list_filter = ['year', 'month', 'created_at']
    search_fields = ['user__username']
