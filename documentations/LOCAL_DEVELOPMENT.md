# 🏠 Local Development Setup

This guide helps you run the Budget Tracker backend locally for development and testing.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
setup_local.bat
```

**For Linux/Mac:**
```bash
chmod +x setup_local.sh
./setup_local.sh
```

### Option 2: Manual Setup

1. **Create .env file:**
   ```bash
   copy local.env .env
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

## 🎯 Running the Backend

```bash
python manage.py runserver
```

The backend will be available at:
- **API Root:** http://localhost:8000/
- **Admin Panel:** http://localhost:8000/admin/

## 🔑 Default Credentials

- **Username:** admin
- **Password:** admin123

## 📊 API Endpoints

- **API Root:** `GET http://localhost:8000/`
- **User Registration:** `POST http://localhost:8000/api/register/`
- **User Login:** `POST http://localhost:8000/api/auth/token/`
- **Categories:** `GET/POST http://localhost:8000/api/categories/`
- **Transactions:** `GET/POST http://localhost:8000/api/transactions/`
- **Budgets:** `GET/POST http://localhost:8000/api/budgets/`
- **Summary:** `GET http://localhost:8000/api/summary/`

## 🧪 Testing the API

### Test Registration
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

## 🔧 Environment Variables

The `.env` file contains:
```env
SECRET_KEY=django-insecure-local-development-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_URL=sqlite:///db.sqlite3
```

## 🗄️ Database

- **Type:** SQLite (for local development)
- **File:** `db.sqlite3`
- **Admin:** http://localhost:8000/admin/

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use:**
   ```bash
   python manage.py runserver 8001
   ```

2. **Database errors:**
   ```bash
   python manage.py migrate --run-syncdb
   ```

3. **Permission errors:**
   ```bash
   python manage.py collectstatic --noinput
   ```

## 📝 Development Notes

- The backend runs on SQLite for local development
- CORS is configured for localhost:8080 (frontend)
- Debug mode is enabled for detailed error messages
- All API endpoints require authentication except registration

## 🚀 Next Steps

1. **Test the backend** with the provided endpoints
2. **Create test data** through the admin panel
3. **Run the frontend** separately (see frontend README)
4. **Deploy to production** when ready

---

**Happy Coding! 🎉**
