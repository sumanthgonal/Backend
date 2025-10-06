#!/bin/bash

# Budget Tracker Deployment Script
echo "🚀 Starting Budget Tracker Deployment..."

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run this script from the project root."
    exit 1
fi

# Generate a secure secret key
echo "🔑 Generating secure secret key..."
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))")
echo "Generated SECRET_KEY: $SECRET_KEY"

# Create .env file for production
echo "📝 Creating .env file..."
cat > .env << EOF
SECRET_KEY=$SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=*.railway.app,*.herokuapp.com,*.onrender.com
DATABASE_URL=postgresql://user:pass@host:port/dbname
EOF

echo "✅ .env file created successfully!"

# Install production dependencies
echo "📦 Installing production dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo "🎉 Backend deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy to Railway, Render, or Heroku"
echo "3. Set environment variables on your platform"
echo "4. Deploy your frontend to Vercel or Netlify"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
