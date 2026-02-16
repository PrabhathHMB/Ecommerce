# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Step 1: Frontend (Vercel - 5 minutes)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel login
   vercel
   ```
   - Follow prompts and select default options
   - You'll get a URL like: `https://your-project.vercel.app`

### Step 2: Backend (Railway - 10 minutes)

1. **Go to Railway**: https://railway.app
2. **Click "Start a New Project"**
3. **Select "Deploy from GitHub repo"** (connect GitHub first if needed)
4. **Select this repository**
5. **Click the service** → **Settings** → **Set Root Directory** to `backend`
6. **Add Environment Variables** (click "Variables" tab):
   - Copy all variables from `backend/.env.example`
   - Fill in with your actual values from `backend/src/main/resources/application.properties`
7. **Deploy** - Railway auto-deploys!
8. **Copy the URL** from Railway dashboard (e.g., `https://your-app.railway.app`)

### Step 3: Connect Frontend to Backend

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-app.railway.app`
   - Click "Redeploy" to apply changes

### Step 4: Update Backend URLs

1. **In Railway Dashboard**:
   - Add environment variables:
     - `PAYHERE_RETURN_URL` = `https://your-project.vercel.app/payment/success`
     - `PAYHERE_CANCEL_URL` = `https://your-project.vercel.app/payment/cancel`

## ✅ Done! Your app is live! 🎉

---

## Alternative: Netlify + Render

### Frontend (Netlify)
```bash
npm install -g netlify-cli
cd frontend
netlify login
netlify deploy --prod
```

### Backend (Render)
1. Go to https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Set root directory to `backend`
5. Build command: `./mvnw clean install`
6. Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

---

## 📱 Test Your Deployment

- Frontend: `https://your-project.vercel.app`
- Backend health: `https://your-app.railway.app/actuator/health`

## 🔍 Troubleshooting

**CORS Error?**
- Check backend allows your frontend domain
- Verify `VITE_API_BASE_URL` is set correctly

**Backend won't start?**
- Check all environment variables are set in Railway/Render
- Check logs in platform dashboard

**Build fails?**
- Check Node/Java versions match your local setup
- Clear build cache and retry

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
