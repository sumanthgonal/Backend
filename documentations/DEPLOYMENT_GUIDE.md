# 🚀 Budget Tracker Deployment Guide

This guide will help you deploy your Personal Budget Tracker application to production.

## 📋 Prerequisites

- GitHub repository with your code
- Backend: Django + DRF API
- Frontend: React + Vite + TypeScript
- Database: SQLite (development) / PostgreSQL (production)

## 🎯 Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Backend + Frontend on Railway:**

1. **Go to [Railway.app](
    
)** and sign up with GitHub
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Railway will auto-detect both services:**
   - Backend (Django)
   - Frontend (Vite/React)

**Backend Configuration:**
```env
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=False
ALLOWED_HOSTS=*.railway.app
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

**Frontend Configuration:**
```env
VITE_API_URL=https://your-backend.railway.app
```

### Option 2: Render (Free Tier Available)

**Backend on Render:**

1. **Go to [Render.com](https://render.com)** and sign up
2. **Create New Web Service**
3. **Connect GitHub repository**
4. **Configure:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python manage.py migrate && python manage.py runserver 0.0.0.0:$PORT`
   - Environment: Python 3.11

**Frontend on Vercel:**

1. **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub
2. **Import Project** → Select your repository
3. **Configure:**
   - Framework: Vite
   - Root Directory: `dash-money-d3`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Option 3: Heroku (Paid)

**Backend on Heroku:**

1. **Install Heroku CLI**
2. **Create app:**
   ```bash
   heroku create your-budget-tracker-api
   ```
3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
4. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=your-app.herokuapp.com
   ```
5. **Deploy:**
   ```bash
   git push heroku main
   heroku run python manage.py migrate
   heroku run python manage.py createsuperuser
   ```

**Frontend on Netlify:**

1. **Go to [Netlify.com](https://netlify.com)**
2. **Import from Git** → Select repository
3. **Configure:**
   - Base directory: `dash-money-d3`
   - Build command: `npm run build`
   - Publish directory: `dash-money-d3/dist`

## 🔧 Step-by-Step Deployment (Railway - Recommended)

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub**
2. **Create a `.env` file for local development** (don't commit this)
3. **Update your `requirements.txt` for production:**

```txt
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
django-filter==23.3
python-decouple==3.8
psycopg2-binary==2.9.7
gunicorn==21.2.0
whitenoise==6.6.0
```

### Step 2: Deploy Backend

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Railway will detect Django automatically**
6. **Add PostgreSQL database:**
   - Go to your project dashboard
   - Click "New" → "Database" → "PostgreSQL"
7. **Set environment variables:**
   ```
   SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
   DEBUG=False
   ALLOWED_HOSTS=*.railway.app
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
8. **Deploy and run migrations:**
   - Railway will automatically run `python manage.py migrate`
   - Create superuser: Go to Railway dashboard → "Deployments" → "View Logs" → "Open Shell"

### Step 3: Deploy Frontend

1. **In the same Railway project, add a new service**
2. **Select "Deploy from GitHub repo"** → Same repository
3. **Railway will detect Vite/React**
4. **Set environment variables:**
   ```
   VITE_API_URL=https://your-backend-service.railway.app
   ```
5. **Deploy**

### Step 4: Configure CORS

Update your Django settings to allow your frontend domain:

```python
# In budget_tracker/settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.railway.app",
    "http://localhost:8080",  # For local development
]
```

## 🌐 Custom Domain Setup

### Railway Custom Domain

1. **Go to your Railway project dashboard**
2. **Click on your service** → "Settings" → "Domains"
3. **Add custom domain**
4. **Update DNS records** as instructed
5. **Update CORS settings** with your custom domain

## 🔒 Security Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY` (generate with: `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use HTTPS (Railway provides this automatically)
- [ ] Set up proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable database backups

## 📊 Database Migration

### For Production (PostgreSQL)

1. **Railway automatically provides PostgreSQL**
2. **Update your Django settings:**

```python
# In budget_tracker/settings.py
import dj_database_url

DATABASES = {
    'default': dj_database_url.parse(os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3'))
}
```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

## 🚀 Quick Start Commands

### Generate Secret Key
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Test Local Build
```bash
# Backend
cd .
python manage.py collectstatic --noinput
python manage.py runserver

# Frontend
cd dash-money-d3
npm run build
npm run preview
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check `CORS_ALLOWED_ORIGINS` in Django settings
   - Ensure frontend URL is correct

2. **Database Connection:**
   - Verify `DATABASE_URL` environment variable
   - Check PostgreSQL service is running

3. **Build Failures:**
   - Check Node.js version (use 18+)
   - Verify all dependencies are in package.json

4. **Static Files:**
   - Add `whitenoise` to requirements.txt
   - Configure static files in settings.py

### Logs and Debugging

- **Railway:** Go to project dashboard → "Deployments" → "View Logs"
- **Vercel:** Go to project dashboard → "Functions" → "View Logs"
- **Netlify:** Go to project dashboard → "Deployments" → "View Logs"

## 📈 Performance Tips

1. **Enable gzip compression**
2. **Use CDN for static files**
3. **Implement database indexing**
4. **Enable caching**
5. **Optimize images and assets**

## 🎉 Success!

Once deployed, your Budget Tracker will be available at:
- **Frontend:** `https://your-frontend.railway.app`
- **Backend API:** `https://your-backend.railway.app`
- **Admin Panel:** `https://your-backend.railway.app/admin`

## 📞 Support

If you encounter issues:
1. Check the platform-specific documentation
2. Review application logs
3. Verify environment variables
4. Test locally first

---

**Happy Deploying! 🚀**

Your Budget Tracker is ready for the world!
