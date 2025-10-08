# Fix Vercel Environment Variables

## Problem
Your Vercel deployment is trying to connect to `localhost:3001` instead of your Render backend at `https://maternal-server.onrender.com`.

## Solution Steps

### 1. Update Vercel Environment Variables

Go to your Vercel dashboard:
1. Visit: https://vercel.com/dashboard
2. Select your project: **maternalhub**
3. Go to **Settings** → **Environment Variables**
4. Look for `REACT_APP_API_URL`

### 2. Set the Correct Value

**If the variable exists:**
- Click **Edit** on `REACT_APP_API_URL`
- Change the value to: `https://maternal-server.onrender.com`
- Make sure it's enabled for: **Production**, **Preview**, and **Development**

**If the variable doesn't exist:**
- Click **Add New**
- Name: `REACT_APP_API_URL`
- Value: `https://maternal-server.onrender.com`
- Select all environments: **Production**, **Preview**, **Development**
- Click **Save**

### 3. Redeploy Your Application

After updating the environment variable:

**Option A: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

**Option B: Push a new commit**
```bash
cd /home/bruce-nshuti/Documents/Maternal_Hub
git add .
git commit -m "Fix: Update API configuration"
git push
```

### 4. Verify the Fix

After redeployment:
1. Visit: https://maternalhub.vercel.app/login
2. Open browser console (F12)
3. Try to login
4. Check the network tab - API calls should now go to `https://maternal-server.onrender.com`

## Backend Status ✅

Your Render backend is **RUNNING CORRECTLY**:
- URL: https://maternal-server.onrender.com
- Health check: ✅ Responding with 200 OK

## Quick Test Command

To verify your backend is working:
```bash
curl https://maternal-server.onrender.com/health
```

Expected response: `{"status":"ok","message":"Server is running"}`
