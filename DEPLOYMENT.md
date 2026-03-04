# Deployment Guide

## Prerequisites
1. GitHub account (already done ✓)
2. MongoDB Atlas account (free)
3. Render/Railway account (for backend)
4. Vercel/Netlify account (for frontend)

## Step 1: Setup MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database password
7. Add `/job-portal` at the end: `mongodb+srv://username:password@cluster.mongodb.net/job-portal`

## Step 2: Deploy Backend to Render

### Option A: Using Render (Recommended - Free)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** job-portal-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `MONGODB_URI` = (your MongoDB Atlas connection string)
   - `JWT_SECRET` = (generate a random string, e.g., `openssl rand -base64 32`)
   - `FRONTEND_URL` = (leave empty for now, will add after frontend deployment)
   - `NODE_ENV` = production
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://job-portal-backend.onrender.com`)

### Option B: Using Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Deploy and copy the URL

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** build
5. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
   (Replace with your actual backend URL from Step 2)
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL (e.g., `https://job-portal-app.vercel.app`)

## Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Add/Update:
   - `FRONTEND_URL` = (your Vercel frontend URL)
5. Save changes (service will redeploy automatically)

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Register a new account
3. Test all features:
   - Login/Logout
   - Job listing
   - Apply for jobs
   - Create profile
   - Post jobs (as recruiter)

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend Issues
- Check browser console for errors
- Verify `REACT_APP_API_URL` points to correct backend
- Clear browser cache and try again

### CORS Issues
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check if backend is running (visit backend URL in browser)

## Free Tier Limitations

- **Render:** Backend may sleep after 15 minutes of inactivity (takes 30s to wake up)
- **Vercel:** 100GB bandwidth per month
- **MongoDB Atlas:** 512MB storage

## Alternative: Deploy Both on Render

You can deploy both frontend and backend on Render:

1. Deploy backend as Web Service (as above)
2. Deploy frontend as Static Site:
   - Root Directory: frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: build

## Cost-Free Deployment Summary

✅ MongoDB Atlas - Free M0 tier
✅ Render - Free tier (backend)
✅ Vercel - Free tier (frontend)

Total Cost: $0/month
