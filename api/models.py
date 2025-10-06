from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal


class Category(models.Model):
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'categories'
        unique_together = ['user', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.type})"


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.category.name}: ${self.amount} on {self.date}"
    
    def save(self, *args, **kwargs):
        # Ensure amount is positive
        if self.amount <= 0:
            raise ValueError("Transaction amount must be positive")
        super().save(*args, **kwargs)


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    year = models.IntegerField()
    month = models.IntegerField()  # 1-12
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'year', 'month']
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"Budget {self.year}-{self.month:02d}: ${self.amount}"
    
    def save(self, *args, **kwargs):
        # Validate month
        if not 1 <= self.month <= 12:
            raise ValueError("Month must be between 1 and 12")
        super().save(*args, **kwargs)
