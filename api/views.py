from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from django.db.models.functions import TruncMonth, TruncDay
from django.utils import timezone
from datetime import datetime, date
from decimal import Decimal

from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, SummarySerializer
from .filters import TransactionFilter


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.none()  # Will be overridden in get_queryset
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = TransactionFilter
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date', '-created_at']
    queryset = Transaction.objects.none()  # Will be overridden in get_queryset
    
    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user).select_related('category')
        # Apply filters
        filterset = self.filterset_class(self.request.GET, queryset=queryset, user=self.request.user)
        return filterset.qs
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get transaction statistics for charts"""
        start = request.query_params.get('start')
        end = request.query_params.get('end')
        
        queryset = Transaction.objects.filter(user=request.user)
        
        if start:
            queryset = queryset.filter(date__gte=start)
        if end:
            queryset = queryset.filter(date__lte=end)
        
        # Group by day for time series
        daily_stats = queryset.extra(
            select={'day': 'date'}
        ).values('day').annotate(
            total_income=Sum('amount', filter=Q(category__type='income')),
            total_expenses=Sum('amount', filter=Q(category__type='expense'))
        ).order_by('day')
        
        return Response(daily_stats)


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    queryset = Budget.objects.none()  # Will be overridden in get_queryset
    
    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user)
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        
        if year:
            queryset = queryset.filter(year=year)
        if month:
            queryset = queryset.filter(month=month)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SummaryViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Transaction.objects.none()  # Required for router
    
    def list(self, request):
        """Get summary data for dashboard"""
        year = request.query_params.get('year', timezone.now().year)
        month = request.query_params.get('month', timezone.now().month)
        
        try:
            year = int(year)
            month = int(month)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid year or month'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get transactions for the specified month
        transactions = Transaction.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month
        ).select_related('category')
        
        # Calculate totals
        total_income = transactions.filter(category__type='income').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        total_expenses = transactions.filter(category__type='expense').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        balance = total_income - total_expenses
        
        # Get breakdown by category
        by_category = []
        for transaction in transactions:
            category_data = {
                'category': transaction.category.name,
                'type': transaction.category.type,
                'amount': str(transaction.amount)
            }
            by_category.append(category_data)
        
        # Get monthly budget
        try:
            budget = Budget.objects.get(user=request.user, year=year, month=month)
            monthly_budget = budget.amount
            budget_variance = monthly_budget - total_expenses
        except Budget.DoesNotExist:
            monthly_budget = None
            budget_variance = None
        
        summary_data = {
            'total_income': str(total_income),
            'total_expenses': str(total_expenses),
            'balance': str(balance),
            'by_category': by_category,
            'monthly_budget': str(monthly_budget) if monthly_budget else None,
            'budget_variance': str(budget_variance) if budget_variance is not None else None,
        }
        
        serializer = SummarySerializer(summary_data)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('firstName', '')
        last_name = request.data.get('lastName', '')
        
        # Validate required fields
        if not username or not email or not password:
            return Response(
                {'error': 'Username, email, and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        return Response(
            {
                'message': 'User created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            },
            status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
