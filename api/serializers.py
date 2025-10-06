from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Transaction, Budget


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_name(self, value):
        # Check for duplicate category names for the same user
        user = self.context['request'].user
        if self.instance:
            # For updates, exclude current instance
            if Category.objects.filter(user=user, name=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A category with this name already exists.")
        else:
            # For creates
            if Category.objects.filter(user=user, name=value).exists():
                raise serializers.ValidationError("A category with this name already exists.")
        return value
    
    def create(self, validated_data):
        # Automatically set the user to the current authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_type = serializers.CharField(source='category.type', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'category', 'category_name', 'category_type', 'amount', 'date', 'note', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value
    
    def validate_category(self, value):
        # Ensure category belongs to the current user
        if value.user != self.context['request'].user:
            raise serializers.ValidationError("You can only use your own categories.")
        return value
    
    def create(self, validated_data):
        # Automatically set the user to the current authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'year', 'month', 'amount', 'created_at']
        read_only_fields = ['created_at']
    
    def validate_month(self, value):
        if not 1 <= value <= 12:
            raise serializers.ValidationError("Month must be between 1 and 12.")
        return value
    
    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Budget amount cannot be negative.")
        return value
    
    def create(self, validated_data):
        # Automatically set the user to the current authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SummarySerializer(serializers.Serializer):
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    by_category = serializers.ListField(
        child=serializers.DictField()
    )
    monthly_budget = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True)
    budget_variance = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True)
