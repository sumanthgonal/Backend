# Personal Budget Tracker

A comprehensive personal budget tracking application built with Django REST Framework backend and React frontend. Features JWT authentication, CRUD operations for transactions and categories, monthly budget comparison, and interactive D3.js visualizations.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based authentication with token refresh
- **Transaction Management**: Full CRUD operations with pagination and filtering
- **Category Management**: Create and manage income/expense categories
- **Budget Tracking**: Set and monitor monthly budgets
- **Dashboard Analytics**: Visual summaries with D3.js charts
- **Multi-user Support**: Complete user isolation and data security

### Advanced Features
- **Interactive Charts**: D3.js visualizations for income vs expenses and budget comparisons
- **Advanced Filtering**: Filter transactions by date range, category, amount, and type
- **Pagination**: Efficient data loading with configurable page sizes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Automatic token refresh and seamless user experience

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7**: Web framework
- **Django REST Framework 3.14.0**: API development
- **djangorestframework-simplejwt 5.3.0**: JWT authentication
- **django-cors-headers 4.3.1**: CORS handling
- **django-filter 23.3**: Advanced filtering
- **python-decouple 3.8**: Environment variable management

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **D3.js**: Data visualization
- **Tailwind CSS**: Styling framework

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🚀 Quick Start

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🔐 Demo Credentials

For testing purposes, use these credentials:

- **Username**: `admin`
- **Password**: `admin123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/token/` - Obtain JWT tokens
- `POST /api/auth/token/refresh/` - Refresh access token

### Categories
- `GET /api/categories/` - List user categories
- `POST /api/categories/` - Create category
- `PUT/PATCH /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

### Transactions
- `GET /api/transactions/` - List transactions (with filtering)
- `POST /api/transactions/` - Create transaction
- `GET /api/transactions/{id}/` - Get transaction details
- `PUT/PATCH /api/transactions/{id}/` - Update transaction
- `DELETE /api/transactions/{id}/` - Delete transaction
- `GET /api/transactions/stats/` - Get transaction statistics

### Budgets
- `GET /api/budgets/` - List budgets
- `POST /api/budgets/` - Create/update budget
- `PUT/PATCH /api/budgets/{id}/` - Update budget
- `DELETE /api/budgets/{id}/` - Delete budget

### Summary
- `GET /api/summary/` - Get dashboard summary data

### Query Parameters

#### Transaction Filtering
- `start_date` - Filter transactions from this date (YYYY-MM-DD)
- `end_date` - Filter transactions until this date (YYYY-MM-DD)
- `category` - Filter by category ID
- `type` - Filter by type (income/expense)
- `min_amount` - Minimum transaction amount
- `max_amount` - Maximum transaction amount
- `page` - Page number for pagination
- `page_size` - Number of items per page (max 50)

#### Summary Parameters
- `year` - Year for summary (default: current year)
- `month` - Month for summary (default: current month)

## 🎨 Frontend Routes

- `/login` - Login page
- `/dashboard` - Main dashboard with charts and summary
- `/transactions` - Transaction list with filtering
- `/transactions/new` - Add new transaction
- `/transactions/:id/edit` - Edit transaction
- `/categories` - Category management
- `/budget` - Budget management

## 📈 Data Models

### Category
- `id` - Primary key
- `user` - Foreign key to User
- `name` - Category name (unique per user)
- `type` - Category type (income/expense)
- `created_at`, `updated_at` - Timestamps

### Transaction
- `id` - Primary key
- `user` - Foreign key to User
- `category` - Foreign key to Category
- `amount` - Transaction amount (positive decimal)
- `date` - Transaction date
- `note` - Optional note
- `created_at`, `updated_at` - Timestamps

### Budget
- `id` - Primary key
- `user` - Foreign key to User
- `year` - Budget year
- `month` - Budget month (1-12)
- `amount` - Monthly budget amount
- `created_at` - Creation timestamp

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **User Isolation**: All data is scoped to authenticated users
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Django ORM provides built-in protection
- **XSS Protection**: React's built-in XSS protection

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Set environment variables**:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   DATABASE_URL=your-database-url
   ```

2. **Deploy using your preferred platform**

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**

3. **Set environment variables**:
   ```
   VITE_API_URL=your-backend-url
   ```

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Development Notes

### Database Migrations
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### Creating Sample Data
```bash
python manage.py shell
# Use Django shell to create sample categories and transactions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

### Libraries and Frameworks
- **Django** - Web framework for Python
- **Django REST Framework** - Powerful API framework
- **React** - JavaScript library for building user interfaces
- **Vite** - Next generation frontend tooling
- **D3.js** - Data-driven document manipulation
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client

### Development Tools
- **djangorestframework-simplejwt** - JWT authentication for DRF
- **django-cors-headers** - CORS handling for Django
- **django-filter** - Dynamic filtering for Django REST Framework
- **python-decouple** - Environment variable management

### AI Assistance
This project was developed with assistance from AI tools for code generation, documentation, and implementation guidance.

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Happy Budgeting! 💰**
