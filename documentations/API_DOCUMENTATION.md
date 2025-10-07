# 🔌 Budget Tracker API - Complete Documentation

## 📋 **API Overview**

The Budget Tracker API is built with **Django REST Framework** and provides a comprehensive set of endpoints for managing personal finances. It features JWT authentication, user data isolation, and advanced filtering capabilities.

### **Base URL**
- **Local Development:** `http://localhost:8000/api`
- **Production:** `https://your-backend.railway.app/api`

### **Authentication**
- **Type:** JWT (JSON Web Tokens)
- **Header:** `Authorization: Bearer <access_token>`
- **Token Refresh:** Automatic via axios interceptors

---

## 🔐 **Authentication Endpoints**

### **1. User Login**
```http
POST /api/auth/token/
```

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Usage in Frontend:**
```typescript
const response = await authAPI.login(username, password);
const { access, refresh } = response.data;
localStorage.setItem('access_token', access);
localStorage.setItem('refresh_token', refresh);
```

### **2. Token Refresh**
```http
POST /api/auth/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "your_refresh_token"
}
```

**Response:**
```json
{
  "access": "new_access_token"
}
```

**Usage in Frontend:**
```typescript
const response = await authAPI.refresh(refreshToken);
const { access } = response.data;
localStorage.setItem('access_token', access);
```

### **3. User Registration**
```http
POST /api/register/
```

**Request Body:**
```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "new_user",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Usage in Frontend:**
```typescript
const response = await authAPI.register({
  username: 'new_user',
  email: 'user@example.com',
  password: 'secure_password',
  firstName: 'John',
  lastName: 'Doe'
});
```

---

## 📂 **Categories API**

### **1. List Categories**
```http
GET /api/categories/
```

**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Salary",
      "type": "income",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Groceries",
      "type": "expense",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Usage in Frontend:**
```typescript
const response = await categoriesAPI.list();
const categories = response.data.results;
```

### **2. Create Category**
```http
POST /api/categories/
```

**Request Body:**
```json
{
  "name": "Rent",
  "type": "expense"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Rent",
  "type": "expense",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Usage in Frontend:**
```typescript
const response = await categoriesAPI.create({
  name: 'Rent',
  type: 'expense'
});
```

### **3. Update Category**
```http
PUT /api/categories/{id}/
```

**Request Body:**
```json
{
  "name": "Monthly Rent",
  "type": "expense"
}
```

**Usage in Frontend:**
```typescript
const response = await categoriesAPI.update(categoryId, {
  name: 'Monthly Rent',
  type: 'expense'
});
```

### **4. Delete Category**
```http
DELETE /api/categories/{id}/
```

**Response:** `204 No Content`

**Usage in Frontend:**
```typescript
await categoriesAPI.delete(categoryId);
```

---

## 💰 **Transactions API**

### **1. List Transactions**
```http
GET /api/transactions/
```

**Query Parameters:**
- `page` (int): Page number for pagination
- `page_size` (int): Number of items per page
- `start_date` (date): Filter transactions from this date
- `end_date` (date): Filter transactions until this date
- `category` (int): Filter by category ID
- `min_amount` (decimal): Minimum transaction amount
- `max_amount` (decimal): Maximum transaction amount
- `type` (string): Filter by type ('income' or 'expense')
- `ordering` (string): Sort by field (e.g., '-date', 'amount')

**Example Request:**
```http
GET /api/transactions/?start_date=2024-01-01&end_date=2024-01-31&type=expense&page=1&page_size=10
```

**Response:**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/transactions/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "category": 2,
      "category_name": "Groceries",
      "category_type": "expense",
      "amount": "150.00",
      "date": "2024-01-15",
      "note": "Weekly grocery shopping",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Usage in Frontend:**
```typescript
const response = await transactionsAPI.list({
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  type: 'expense',
  page: 1,
  page_size: 10
});
```

### **2. Create Transaction**
```http
POST /api/transactions/
```

**Request Body:**
```json
{
  "category": 2,
  "amount": "150.00",
  "date": "2024-01-15",
  "note": "Weekly grocery shopping"
}
```

**Response:**
```json
{
  "id": 1,
  "category": 2,
  "category_name": "Groceries",
  "category_type": "expense",
  "amount": "150.00",
  "date": "2024-01-15",
  "note": "Weekly grocery shopping",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Usage in Frontend:**
```typescript
const response = await transactionsAPI.create({
  category: 2,
  amount: '150.00',
  date: '2024-01-15',
  note: 'Weekly grocery shopping'
});
```

### **3. Get Transaction Details**
```http
GET /api/transactions/{id}/
```

**Usage in Frontend:**
```typescript
const response = await transactionsAPI.get(transactionId);
```

### **4. Update Transaction**
```http
PUT /api/transactions/{id}/
```

**Usage in Frontend:**
```typescript
const response = await transactionsAPI.update(transactionId, {
  category: 2,
  amount: '175.00',
  date: '2024-01-15',
  note: 'Updated grocery shopping'
});
```

### **5. Delete Transaction**
```http
DELETE /api/transactions/{id}/
```

**Usage in Frontend:**
```typescript
await transactionsAPI.delete(transactionId);
```

### **6. Transaction Statistics**
```http
GET /api/transactions/stats/
```

**Query Parameters:**
- `start` (date): Start date for statistics
- `end` (date): End date for statistics

**Response:**
```json
[
  {
    "day": "2024-01-15",
    "total_income": "5000.00",
    "total_expenses": "150.00"
  },
  {
    "day": "2024-01-16",
    "total_income": "0.00",
    "total_expenses": "75.00"
  }
]
```

**Usage in Frontend:**
```typescript
const response = await transactionsAPI.stats({
  start: '2024-01-01',
  end: '2024-01-31'
});
```

---

## 📊 **Budget API**

### **1. List Budgets**
```http
GET /api/budgets/
```

**Query Parameters:**
- `year` (int): Filter by year
- `month` (int): Filter by month (1-12)

**Response:**
```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "year": 2024,
      "month": 1,
      "amount": "3000.00",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Usage in Frontend:**
```typescript
const response = await budgetAPI.list({
  year: 2024,
  month: 1
});
```

### **2. Create Budget**
```http
POST /api/budgets/
```

**Request Body:**
```json
{
  "year": 2024,
  "month": 1,
  "amount": "3000.00"
}
```

**Response:**
```json
{
  "id": 1,
  "year": 2024,
  "month": 1,
  "amount": "3000.00",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Usage in Frontend:**
```typescript
const response = await budgetAPI.create({
  year: 2024,
  month: 1,
  amount: '3000.00'
});
```

### **3. Update Budget**
```http
PUT /api/budgets/{id}/
```

**Usage in Frontend:**
```typescript
const response = await budgetAPI.update(budgetId, {
  year: 2024,
  month: 1,
  amount: '3500.00'
});
```

### **4. Delete Budget**
```http
DELETE /api/budgets/{id}/
```

**Usage in Frontend:**
```typescript
await budgetAPI.delete(budgetId);
```

---

## 📈 **Summary API**

### **1. Get Financial Summary**
```http
GET /api/summary/
```

**Query Parameters:**
- `year` (int): Year for summary (default: current year)
- `month` (int): Month for summary (default: current month)

**Response:**
```json
{
  "total_income": "5000.00",
  "total_expenses": "3200.00",
  "balance": "1800.00",
  "by_category": [
    {
      "category": "Salary",
      "type": "income",
      "amount": "5000.00"
    },
    {
      "category": "Groceries",
      "type": "expense",
      "amount": "400.00"
    },
    {
      "category": "Rent",
      "type": "expense",
      "amount": "1200.00"
    }
  ],
  "monthly_budget": "3000.00",
  "budget_variance": "-200.00"
}
```

**Usage in Frontend:**
```typescript
const response = await summaryAPI.get({
  year: 2024,
  month: 1
});
```

---

## 🔧 **API Design Patterns**

### **1. Authentication Flow**
```typescript
// Frontend authentication flow
class AuthService {
  async login(username: string, password: string) {
    const response = await authAPI.login(username, password);
    const { access, refresh } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    return response.data;
  }
  
  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
  }
}
```

### **2. Automatic Token Refresh**
```typescript
// Axios interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await authAPI.refresh(refreshToken);
        const { access } = response.data;
        
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### **3. Error Handling**
```typescript
// Frontend error handling pattern
try {
  const response = await transactionsAPI.create(transactionData);
  toast.success('Transaction created successfully');
  return response.data;
} catch (error) {
  if (error.response?.status === 400) {
    toast.error('Invalid transaction data');
  } else if (error.response?.status === 401) {
    toast.error('Please log in again');
  } else {
    toast.error('Failed to create transaction');
  }
  throw error;
}
```

### **4. Data Validation**
```typescript
// Frontend validation before API calls
const validateTransaction = (data: TransactionData) => {
  const errors: string[] = [];
  
  if (!data.category) errors.push('Category is required');
  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.push('Amount must be positive');
  }
  if (!data.date) errors.push('Date is required');
  
  return errors;
};
```

---

## 🛡️ **Security Features**

### **1. User Data Isolation**
- All queries are automatically filtered by the authenticated user
- Users can only access their own data
- Foreign key relationships ensure data integrity

### **2. Input Validation**
- Server-side validation for all inputs
- Type checking and range validation
- SQL injection protection via Django ORM

### **3. Authentication Security**
- JWT tokens with expiration
- Automatic token refresh
- Secure token storage in localStorage

### **4. CORS Configuration**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://your-frontend.vercel.app"
]
```

---

## 📊 **Database Schema**

### **Models Relationship**
```
User (Django built-in)
├── Category (1:N)
│   └── Transaction (1:N)
└── Budget (1:N)
```

### **Key Constraints**
- **Category:** Unique name per user
- **Transaction:** Positive amount validation
- **Budget:** Unique year/month per user
- **All models:** User foreign key for isolation

---

## 🚀 **Performance Optimizations**

### **1. Database Queries**
- `select_related()` for foreign key optimization
- Database-level aggregations for summary data
- Pagination for large datasets

### **2. Frontend Optimizations**
- Axios interceptors for automatic token management
- Error handling with user-friendly messages
- Optimistic updates for better UX

### **3. Caching Strategy**
- JWT tokens cached in localStorage
- API responses cached by React Query
- Static assets served via CDN

---

## 📝 **API Testing**

### **Using curl:**
```bash
# Login
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'

# Get transactions (with token)
curl -X GET http://localhost:8000/api/transactions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **Using Postman:**
1. Set base URL: `http://localhost:8000/api`
2. Add Authorization header: `Bearer YOUR_ACCESS_TOKEN`
3. Test all endpoints with proper request bodies

---

## 🔄 **API Versioning**

Currently using **v1.0.0** with backward compatibility. Future versions will be added as:
- `/api/v2/` for major changes
- Query parameter versioning for minor updates

---

**Total Endpoints:** 15+ endpoints
**Authentication:** JWT with automatic refresh
**Data Format:** JSON
**Status:** Production Ready ✅
