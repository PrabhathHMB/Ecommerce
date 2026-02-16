# Deployment Guide - EcommerceGroup Project

This guide will help you deploy your full-stack application to production.

## 🎯 Overview

- **Frontend**: React/Vite application → Deploy to **Vercel** or **Netlify**
- **Backend**: Spring Boot/Java application → Deploy to **Railway** or **Render**

---

## 📦 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Prerequisites
- GitHub account
- Vercel account (free at https://vercel.com)

#### Steps:

1. **Push your code to GitHub** (if not already)
   ```bash
   cd c:\Users\USER\Desktop\EcommerceGroup
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework
   - **Important**: Set the Root Directory to `frontend`
   - Add environment variable: `VITE_API_BASE_URL` = `<your-backend-url>` (you'll get this after deploying backend)
   - Click "Deploy"

3. **Alternative: Deploy via Vercel CLI**
   ```bash
   cd frontend
   npm install -g vercel
   vercel login
   vercel
   ```

#### Configuration Files
- `vercel.json` ✅ Already created in the frontend directory

---

### Option 2: Deploy to Netlify

#### Prerequisites
- GitHub account
- Netlify account (free at https://netlify.com)

#### Steps:

1. **Push your code to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`
   - Add environment variable: `VITE_API_BASE_URL` = `<your-backend-url>`
   - Click "Deploy site"

3. **Alternative: Deploy via Netlify CLI**
   ```bash
   cd frontend
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

#### Configuration Files
- `netlify.toml` ✅ Already created in the frontend directory

---

## 🚀 Backend Deployment

### Option 1: Deploy to Railway (Recommended - Easiest)

#### Prerequisites
- GitHub account
- Railway account (free at https://railway.app)

#### Steps:

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect it's a Maven project

3. **Configure the deployment**
   - Set root directory to `backend` (if needed)
   - Railway will automatically use `mvn clean install` and run the JAR

4. **Set up MongoDB**
   - You're already using MongoDB Atlas (good!)
   - Your connection string is in `application.properties`

5. **Add Environment Variables** (in Railway dashboard)
   - `SPRING_DATA_MONGODB_URI` = `<your-mongodb-connection-string>`
   - `SPRING_MAIL_USERNAME` = `beautyfashion835@gmail.com`
   - `SPRING_MAIL_PASSWORD` = `<your-email-password>`
   - `AI_API_KEY` = `<your-google-ai-key>`
   - All other sensitive values from `application.properties`

6. **Deploy**
   - Railway will give you a public URL like: `https://your-app.railway.app`
   - Copy this URL to use in your frontend's `VITE_API_BASE_URL`

7. **Enable CORS** (if needed)
   - Make sure your Spring Boot app allows requests from your frontend domain
   - Check your CORS configuration in the backend

---

### Option 2: Deploy to Render

#### Prerequisites
- GitHub account
- Render account (free at https://render.com)

#### Steps:

1. **Sign up at Render**
   - Go to https://render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the service**
   - **Name**: `ecommerce-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Docker` or `Java`
   - **Build Command**: `./mvnw clean install`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

4. **Add Environment Variables** (same as Railway above)

5. **Deploy**
   - Render will give you a URL like: `https://ecommerce-backend.onrender.com`

---

## 🔗 Connect Frontend to Backend

After deploying both:

1. **Get your backend URL** (from Railway/Render)
   - Example: `https://your-app.railway.app`

2. **Update Frontend Environment Variable**
   - In Vercel/Netlify dashboard, set:
     - `VITE_API_BASE_URL` = `https://your-app.railway.app`
   
3. **Redeploy Frontend** (if needed)
   - Vercel/Netlify will auto-redeploy when you change environment variables

4. **Update Backend CORS Settings**
   - Make sure your backend allows your frontend domain
   - Update `payhere.return.url` and `payhere.cancel.url` in backend environment variables to use your production frontend URL

---

## ✅ Quick Deployment Checklist

### Frontend
- [ ] Push code to GitHub
- [ ] Create Vercel/Netlify account
- [ ] Import repository
- [ ] Set root directory to `frontend`
- [ ] Add `VITE_API_BASE_URL` environment variable
- [ ] Deploy

### Backend
- [ ] Push code to GitHub
- [ ] Create Railway/Render account
- [ ] Import repository
- [ ] Set root directory to `backend`
- [ ] Add all environment variables from `application.properties`
- [ ] Deploy
- [ ] Copy the backend URL

### Final Steps
- [ ] Update frontend `VITE_API_BASE_URL` with backend URL
- [ ] Update backend CORS to allow frontend domain
- [ ] Test the application
- [ ] Update payment callback URLs to production URLs

---

## 🔒 Security Notes

1. **Never commit sensitive data**
   - Use environment variables for all secrets
   - Add `.env` files to `.gitignore`

2. **Current Exposed Secrets** ⚠️
   - Your `application.properties` contains sensitive data
   - Consider moving all secrets to environment variables
   - Use different credentials for production

3. **Recommended: Create environment-specific configs**
   ```
   application.properties (default)
   application-dev.properties (local development)
   application-prod.properties (production - use env vars)
   ```

---

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Check Java version (should be 17+)
- Clear cache and rebuild

### CORS Errors
- Ensure backend CORS configuration allows your frontend domain
- Check that `VITE_API_BASE_URL` is correctly set

### Backend Won't Start
- Verify all environment variables are set
- Check MongoDB connection string
- Check logs in Railway/Render dashboard

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

## 🎉 Success!

Once deployed:
- Frontend URL: `https://your-app.vercel.app` or `https://your-app.netlify.app`
- Backend URL: `https://your-app.railway.app` or `https://your-app.onrender.com`

Share your deployed app with the world! 🚀
