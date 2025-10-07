#!/bin/bash

# Local Development Setup Script for Budget Tracker Backend

echo "🚀 Setting up Budget Tracker Backend for Local Development..."

# Copy environment file
echo "📝 Creating .env file..."
cp local.env .env

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Create superuser (optional)
echo "👤 Creating superuser account..."
echo "You can create a superuser account now (optional):"
echo "Username: admin"
echo "Email: admin@example.com"
echo "Password: admin123"
python manage.py createsuperuser --username admin --email admin@example.com --noinput
echo "from django.contrib.auth.models import User; u = User.objects.get(username='admin'); u.set_password('admin123'); u.save()" | python manage.py shell

echo "✅ Setup complete!"
echo ""
echo "🎯 To run the backend:"
echo "   python manage.py runserver"
echo ""
echo "🌐 Backend will be available at:"
echo "   http://localhost:8000/"
echo "   http://127.0.0.1:8000/"
echo ""
echo "🔑 Admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   Admin panel: http://localhost:8000/admin/"
echo ""
echo "📊 API endpoints:"
echo "   API root: http://localhost:8000/"
echo "   Register: http://localhost:8000/api/register/"
echo "   Login: http://localhost:8000/api/auth/token/"
