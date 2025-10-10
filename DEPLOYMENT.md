# 🚀 Deployment Guide - Maternal Health Hub

## ✅ Pre-Deployment Checklist

### Backend (Maternal_Server)
- [x] Admin model created
- [x] Admin routes implemented
- [x] User model updated with gender field
- [x] Environment variables configured
- [x] Admin creation script ready

### Frontend (Maternal_Hub)
- [x] Admin dashboard complete
- [x] Admin login page
- [x] Admin registration page (super_admin only)
- [x] User management interface
- [x] Pregnancy monitoring
- [x] Info pages (Terms, Privacy, FAQ, Support)
- [x] Admin link on login page

## 🌐 Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

#### Backend Deployment (Render.com)

1. **Push code to GitHub** (done below)

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Maternal_Server`
   - Configure:
     - **Name**: `maternal-server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   FRONTEND_URL=https://maternalhub.vercel.app
   CHATBASE_API_KEY=786dc312-65cd-46da-80af-15e7b27df494
   CHATBASE_BOT_ID=jFoczhq_OFwj8Gp84I97t
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Note your backend URL (e.g., `https://maternal-server.onrender.com`)

#### Frontend Deployment (Vercel)

1. **Update Environment Variable**
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://maternal-server.onrender.com`

2. **Redeploy**
   - Vercel will auto-deploy when you push to GitHub
   - Or manually trigger deployment in Vercel dashboard

### Option 2: Deploy Both to Render

1. Deploy backend as above
2. Deploy frontend:
   - New → Static Site
   - Build Command: `npm run build`
   - Publish Directory: `build`

## 🔐 Post-Deployment Steps

### 1. Create Admin Account

SSH into your backend server or use Render Shell:

```bash
node scripts/createAdmin.js
```

Or update the script with your credentials and run it.

### 2. Test Admin Login

1. Go to: `https://your-frontend-url.com/admin/login`
2. Login with your admin credentials
3. Verify all features work

### 3. Update CORS Settings

Make sure your backend `.env` has:
```
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

## 📱 Features to Test

### User Features
- [x] User registration/login
- [x] Pregnancy tracker
- [x] Health centers map
- [x] AI chatbot
- [x] Mental health resources
- [x] Dad's corner
- [x] Profile management

### Admin Features
- [x] Admin login (separate from users)
- [x] Dashboard analytics
- [x] User management (view, edit, delete)
- [x] Pregnancy monitoring
- [x] Create new admins (super_admin only)

### Info Pages
- [x] Terms & Conditions
- [x] Privacy Policy
- [x] FAQ
- [x] Support/Contact

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_strong_secret_key
PORT=3001
FRONTEND_URL=https://maternalhub.vercel.app
CHATBASE_API_KEY=your_api_key
CHATBASE_BOT_ID=your_bot_id
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://maternal-server.onrender.com
```

## 🎯 Admin Access

### Default Admin (Change After First Login)
- **Email**: `brucenshuti2@gmail.com`
- **Password**: `804C23DD23!`
- **Role**: super_admin

### Creating Additional Admins
1. Login as super_admin
2. Go to `/admin/register`
3. Fill in new admin details
4. Choose role: admin, moderator, or super_admin

### Admin Roles & Permissions

**Super Admin:**
- Full access to everything
- Can create/delete other admins
- Can delete users

**Admin:**
- View and edit users
- View analytics
- Manage hospitals
- Cannot delete users or create admins

**Moderator:**
- View users and analytics
- Limited editing permissions

## 🚨 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (generate new one)
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set proper CORS origins
- [ ] Review admin permissions
- [ ] Enable rate limiting (already configured)
- [ ] Monitor logs for suspicious activity

## 📊 Monitoring

### Backend Health Check
```
GET https://your-backend-url.com/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Maternal Health API is running",
  "database": "connected"
}
```

### Frontend Health
Just visit your frontend URL - should load without errors

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:
- Push to `main` branch → Auto-deploy
- Pull requests → Preview deployments

## 📝 Post-Launch Tasks

1. **Monitor Performance**
   - Check response times
   - Monitor database queries
   - Review error logs

2. **User Feedback**
   - Test all features
   - Gather user feedback
   - Fix bugs

3. **Future Enhancements**
   - Push notifications (Firebase FCM)
   - More hospital data
   - SMS notifications
   - Email notifications

## 🆘 Troubleshooting

### Issue: Admin can't login
- Check backend is running
- Verify MongoDB connection
- Check CORS settings
- Verify admin exists in database

### Issue: 404 on admin routes
- Restart backend server
- Check route configuration
- Verify environment variables

### Issue: CORS errors
- Update FRONTEND_URL in backend .env
- Redeploy backend
- Clear browser cache

## 📞 Support

For issues or questions:
- Email: brucenshuti2@gmail.com
- Check logs in Render/Vercel dashboard
- Review error messages in browser console

---

**Ready to deploy! 🚀**
