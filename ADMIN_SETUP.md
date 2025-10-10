# Admin Dashboard Setup Guide

## ✅ What's Been Completed

### 1. Backend (Maternal_Server)
- ✅ **Admin Model** (`/models/Admin.js`) - Separate collection from users
- ✅ **Admin Routes** (`/routes/admin.js`) - Complete API endpoints
- ✅ **User Model Updated** - Added `gender` field for analytics
- ✅ **Server Updated** - Admin routes integrated

### 2. Frontend (Maternal_Hub)
- ✅ **Admin Context** (`/context/AdminContext.jsx`) - State management
- ✅ **Admin API Utils** (`/utils/adminApi.js`) - API functions
- ✅ **Admin Login Page** - Separate login for admins
- ✅ **Admin Dashboard** - Analytics with charts
- ✅ **User Management** - View, edit, delete users
- ✅ **Pregnancy Monitoring** - Track all pregnant users
- ✅ **Admin Layout** - Sidebar navigation
- ✅ **Protected Routes** - Admin authentication

### 3. Info Pages
- ✅ **Terms & Conditions** - 12 comprehensive sections
- ✅ **Privacy Policy** - 14 detailed sections
- ✅ **FAQ** - 16 questions answered
- ✅ **Support** - 12 contact sections

## 🚀 How to Test

### Step 1: Start Backend
```bash
cd /home/bruce-nshuti/Documents/Maternal_Server
npm start
```

### Step 2: Start Frontend
```bash
cd /home/bruce-nshuti/Documents/Maternal_Hub
npm start
```

### Step 3: Access Admin Panel
1. Go to: `http://localhost:3000/admin/login`
2. Login with:
   - **Email:** `admin@maternalhub.rw`
   - **Password:** `Admin@123456`

### Step 4: Explore Features
- **Dashboard** (`/admin/dashboard`) - View analytics
- **Users** (`/admin/users`) - Manage all users
- **Pregnancy** (`/admin/pregnancy`) - Monitor pregnant users

## 📊 Admin Features

### Dashboard Analytics
- Total users count
- Gender distribution (Male/Female/Other)
- Pregnant users count
- Pregnancy by trimester (1st, 2nd, 3rd)
- New users (last 30 days)
- Active users (last 7 days)
- Visual bar charts

### User Management
- View all users with pagination
- Search by name/email
- Filter by gender
- Filter by pregnancy status
- Edit user details (except password)
- Delete users
- View user details

### Pregnancy Monitoring
- View all pregnant users
- See current week and progress bar
- View trimester status
- Days until due date
- Alert for users due within 30 days
- Sorted by pregnancy progress

## 🔒 Admin Permissions

The admin model includes a permissions system:
- `canViewUsers` - View user list
- `canEditUsers` - Edit user information
- `canDeleteUsers` - Delete users
- `canViewAnalytics` - View dashboard analytics
- `canManageHospitals` - Manage health centers
- `canManageContent` - Manage content

## 🔐 Security Features

1. **Separate Admin Collection** - Admins stored separately from users
2. **JWT Authentication** - 8-hour token expiration for admins
3. **Protected Routes** - Frontend route protection
4. **Password Hashing** - bcrypt with salt rounds
5. **Permission-based Access** - Granular permissions
6. **Token Verification** - Middleware on all admin routes

## 📝 Admin Roles

- **super_admin** - Full access to everything
- **admin** - Standard admin access
- **moderator** - Limited access

## 🔄 Creating Additional Admins

Run the script again with different credentials:

```bash
cd /home/bruce-nshuti/Documents/Maternal_Server
node scripts/createAdmin.js
```

Or create via MongoDB directly.

## 🎨 UI Features

- Modern gradient design (purple theme)
- Responsive layout (mobile-friendly)
- Sidebar navigation
- Real-time data updates
- Loading states
- Error handling
- Toast notifications
- Smooth animations

## 🔧 API Endpoints

### Admin Authentication
- `POST /api/admin/login` - Admin login

### Analytics
- `GET /api/admin/analytics` - Dashboard statistics

### User Management
- `GET /api/admin/users` - Get all users (paginated)
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user (no password)
- `DELETE /api/admin/users/:id` - Delete user

### Pregnancy Monitoring
- `GET /api/admin/pregnant-users` - Get all pregnant users

## ⚠️ Important Notes

1. **Password Security**: Admin cannot change user passwords - users must do this themselves
2. **First Login**: Change the default admin password immediately
3. **Gender Field**: New users must provide gender (required field)
4. **Token Expiry**: Admin tokens expire after 8 hours
5. **Permissions**: Check admin permissions before operations

## 🐛 Troubleshooting

### Issue: Can't login to admin
- Check MongoDB is running
- Verify admin was created: `node scripts/createAdmin.js`
- Check backend logs for errors

### Issue: Analytics not loading
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify JWT token in localStorage

### Issue: Can't edit users
- Check admin permissions in database
- Verify `canEditUsers` is true

## 📱 Next Steps

1. ✅ Test admin dashboard thoroughly
2. ⏳ Add push notifications (Firebase FCM)
3. ⏳ Add hospital data (waiting for your file)
4. ⏳ Deploy to production

## 🎯 Production Checklist

Before deploying:
- [ ] Change default admin password
- [ ] Update CORS settings for production URL
- [ ] Set secure JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Test all admin features
- [ ] Backup database

---

**Built with ❤️ for Maternal Health Hub**
