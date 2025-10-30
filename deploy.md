# Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Backend Deployment (Render)

1. **Go to [render.com](https://render.com) and sign up with GitHub**

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `OptimalSearchWords`
   - Configure:
     - **Name**: `word-lookup-backend`
     - **Environment**: `Docker`
     - **Region**: `Oregon (US West)` (free tier)
     - **Branch**: `main`
     - **Root Directory**: Leave empty (uses root)
     - **Build Command**: Auto-detected from Dockerfile
     - **Start Command**: Auto-detected from Dockerfile

3. **Environment Variables:**
   - Add: `PORT` = `8080`

4. **Deploy** - Click "Create Web Service"

5. **Get your backend URL** (will be something like):
   ```
   https://word-lookup-backend-xxxx.onrender.com
   ```

### 2. Frontend Deployment (Netlify)

#### Option A: Netlify CLI (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Go to frontend directory
cd frontend

# Build the project
npm run build

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

#### Option B: Netlify Web Interface
1. **Go to [netlify.com](https://netlify.com)**
2. **New site from Git**
3. **Connect GitHub** → Select `OptimalSearchWords`
4. **Build settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
5. **Environment variables:**
   - `REACT_APP_API_URL`: `https://your-render-backend-url.onrender.com`
6. **Deploy**

### 3. Update API URL

After backend deployment, update the frontend:

1. **In Netlify dashboard:**
   - Go to Site settings → Environment variables
   - Update `REACT_APP_API_URL` with your actual Render backend URL

2. **Redeploy frontend** to pick up the new API URL

## 🔧 Alternative: Manual Build & Deploy

If you prefer manual deployment:

```bash
# Build frontend
cd frontend
npm run build

# Upload the 'build' folder to any static hosting service
# (Netlify drop, Vercel, GitHub Pages, etc.)
```

## 📋 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL obtained
- [ ] Frontend environment variable updated
- [ ] Frontend deployed to Netlify
- [ ] Test live application
- [ ] Both services working together

## 🌐 Expected URLs

- **Frontend**: `https://your-site-name.netlify.app`
- **Backend**: `https://word-lookup-backend-xxxx.onrender.com`

## 🐛 Troubleshooting

**Backend Issues:**
- Check Render logs for build errors
- Ensure Dockerfile is in root directory
- Verify PORT environment variable is set

**Frontend Issues:**
- Check browser console for API errors
- Verify REACT_APP_API_URL is correct
- Ensure CORS is enabled on backend (already configured)

**CORS Issues:**
- Backend already has CORS headers configured
- If issues persist, check browser network tab for actual error messages