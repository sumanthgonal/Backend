# 🚀 Deployment Checklist

## Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] All tests pass locally
- [ ] Environment variables are configured
- [ ] Database migrations are ready
- [ ] Static files are collected
- [ ] CORS settings are configured

## Backend Deployment

### Railway (Recommended)
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Add PostgreSQL database
- [ ] Set environment variables:
  - [ ] `SECRET_KEY`
  - [ ] `DEBUG=False`
  - [ ] `ALLOWED_HOSTS=*.railway.app`
  - [ ] `DATABASE_URL` (auto-set by Railway)
- [ ] Deploy and run migrations
- [ ] Create superuser account
- [ ] Test API endpoints

### Render
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy and test

### Heroku
- [ ] Install Heroku CLI
- [ ] Create Heroku app
- [ ] Add PostgreSQL addon
- [ ] Set environment variables
- [ ] Deploy with git push
- [ ] Run migrations
- [ ] Create superuser

## Frontend Deployment

### Vercel (Recommended)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure build settings:
  - [ ] Framework: Vite
  - [ ] Root Directory: `dash-money-d3`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Set environment variables:
  - [ ] `VITE_API_URL=https://your-backend-url.com`
- [ ] Deploy and test

### Netlify
- [ ] Create Netlify account
- [ ] Import from Git
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy and test

## Post-Deployment

- [ ] Test user registration
- [ ] Test user login
- [ ] Test all CRUD operations
- [ ] Test D3.js charts
- [ ] Test responsive design
- [ ] Test on different browsers
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Update CORS settings with production URLs

## Security Checklist

- [ ] `DEBUG=False` in production
- [ ] Strong `SECRET_KEY` generated
- [ ] `ALLOWED_HOSTS` configured
- [ ] HTTPS enabled
- [ ] CORS origins configured
- [ ] Environment variables secured
- [ ] Database credentials secured

## Performance Checklist

- [ ] Static files served efficiently
- [ ] Database queries optimized
- [ ] Caching enabled
- [ ] CDN configured
- [ ] Gzip compression enabled
- [ ] Images optimized

## Monitoring

- [ ] Application logs configured
- [ ] Error tracking set up
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database monitoring

## Backup Strategy

- [ ] Database backups configured
- [ ] Static files backed up
- [ ] Code repository backed up
- [ ] Recovery procedures documented

---

## Quick Commands

### Generate Secret Key
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Test Local Build
```bash
# Backend
python manage.py collectstatic --noinput
python manage.py runserver

# Frontend
cd dash-money-d3
npm run build
npm run preview
```

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Heroku Deployment
```bash
# Install Heroku CLI and deploy
heroku create your-app-name
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

---

**🎉 Once all items are checked, your Budget Tracker is ready for production!**
