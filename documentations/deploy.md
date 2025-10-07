# Deployment Guide

This guide covers deploying the Personal Budget Tracker to various platforms.

## 🚀 Backend Deployment

### Option 1: Railway

1. **Create Railway account** and connect your GitHub repository
2. **Set environment variables**:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app.railway.app
   ```
3. **Deploy**: Railway will automatically detect Django and deploy

### Option 2: Render

1. **Create Render account** and connect your repository
2. **Create a new Web Service**
3. **Configure**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python manage.py migrate && python manage.py runserver 0.0.0.0:$PORT`
4. **Set environment variables**:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app.onrender.com
   ```

### Option 3: Heroku

1. **Install Heroku CLI** and login
2. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```
3. **Set environment variables**:
   ```bash
   heroku config:set SECRET_KEY=your-secret-key-here
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=your-app.herokuapp.com
   ```
4. **Deploy**:
   ```bash
   git push heroku main
   heroku run python manage.py migrate
   heroku run python manage.py createsuperuser
   ```

## 🎨 Frontend Deployment

### Option 1: Vercel

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Set environment variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
4. **Deploy**: Vercel will automatically deploy on every push

### Option 2: Netlify

1. **Connect your repository** to Netlify
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. **Set environment variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
4. **Deploy**: Netlify will automatically deploy

### Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```
2. **Add to package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
3. **Deploy**:
   ```bash
   npm run deploy
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost
DATABASE_URL=your-database-url
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
```

## 📊 Database Setup

### For Production

1. **Use PostgreSQL** (recommended for production)
2. **Update requirements.txt**:
   ```
   psycopg2-binary==2.9.7
   ```
3. **Update settings.py**:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': os.getenv('DB_NAME'),
           'USER': os.getenv('DB_USER'),
           'PASSWORD': os.getenv('DB_PASSWORD'),
           'HOST': os.getenv('DB_HOST'),
           'PORT': os.getenv('DB_PORT'),
       }
   }
   ```

## 🔒 Security Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Regular security updates

## 📈 Performance Optimization

### Backend
- Use database connection pooling
- Enable caching (Redis/Memcached)
- Use CDN for static files
- Optimize database queries

### Frontend
- Enable gzip compression
- Use CDN for assets
- Implement lazy loading
- Optimize bundle size

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in settings
2. **Database connection**: Verify database credentials and connection
3. **Static files**: Ensure proper static file configuration
4. **Environment variables**: Double-check all required variables are set

### Logs
- Check application logs for errors
- Monitor database performance
- Use browser dev tools for frontend issues

## 📞 Support

For deployment issues, check:
1. Platform-specific documentation
2. Application logs
3. Environment variable configuration
4. Database connectivity

---

**Happy Deploying! 🚀**
