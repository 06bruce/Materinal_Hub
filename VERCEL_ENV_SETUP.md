# Vercel Environment Variables Setup

## 🚨 CRITICAL: You Must Set This in Vercel Dashboard

Your frontend is currently trying to connect to `localhost:3001` which won't work in production!

---

## Steps to Fix:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on **maternal-hub** or **Maternal_Hub** project

### 3. Go to Settings → Environment Variables
Navigate to: **Settings** → **Environment Variables**

### 4. Add This Variable

**Variable Name:**
```
REACT_APP_API_URL
```

**Value:**
```
https://maternal-server.onrender.com
```

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Redeploy
After adding the variable:
- Go to **Deployments** tab
- Click the **...** menu on the latest deployment
- Click **Redeploy**

---

## How to Verify

1. After redeployment completes
2. Open browser console (F12) on your admin login page
3. Try to login
4. Look for console message: `🔐 Admin login attempt to: https://maternal-server.onrender.com/api/admin/login`
5. Should NOT say `localhost:3001`

---

## Current Issue

Your frontend is using this API URL:
```
http://localhost:3001  ❌ (Won't work in production)
```

It should be:
```
https://maternal-server.onrender.com  ✅ (Production backend)
```

---

## Backend Server Details

- **URL:** https://maternal-server.onrender.com
- **Status:** Active on Render
- **Test:** https://maternal-server.onrender.com/health

---

## After Setting Up

Your admin login will work because:
1. Frontend will call the correct production API
2. CORS is already configured for your Vercel domain
3. Rate limits have been increased
4. Admin permissions are set correctly

---

## Quick Test

Open this URL in browser:
```
https://maternal-server.onrender.com/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Maternal Health API is running",
  "database": "connected"
}
```

If you see this, your backend is working! ✅
