# 🚀 Maternal Hub- Setup Guide

## 🎯 **Profile Page is Now Ready!**

I've just created a complete profile page for you. Here's what you need to do to get it working:

## 📋 **Quick Setup Steps:**

### **1. 🗄️ Set up MongoDB (if not already done)**

**Option A: Local MongoDB**
```bash
# Install MongoDB locally (if not installed)
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string

### **2. ⚙️ Configure Backend Environment**

```bash
cd backend

# Create .env file
echo "PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/maternal-health
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000" > .env
```

### **3. 🛠️ Install Backend Dependencies**

```bash
cd backend
npm install
```

### **4. 🚀 Start Backend Server**

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Maternal Health API server running on port 3001
```

### **5. 🌐 Start Frontend (in new terminal)**

```bash
cd frontend
npm start
```

## 🎉 **How to Test the Profile Page:**

### **Step 1: Register/Login**
1. Go to `http://localhost:3000/login`
2. Register a new user or login with existing user
3. You'll be redirected to home page

### **Step 2: Access Profile**
1. **Click on your name** in the top-right corner of the header
2. **Or** use mobile menu → Profile
3. **Or** go directly to `http://localhost:3000/profile`

### **Step 3: Edit Profile**
1. Click "Edit Profile" button
2. Update your information
3. Check "I am pregnant" if applicable
4. Set pregnancy start date
5. Click "Save Changes"

## 🔧 **What's New in the Profile Page:**

### **✅ Features Added:**
- **Personal Information Display** (name, email, phone, age)
- **Edit Profile Functionality** with form validation
- **Pregnancy Information** (if pregnant)
  - Current week calculation
  - Days until due date
  - Weeks remaining
- **Preferences Section** (language, notifications)
- **Logout Button**
- **Responsive Design** (works on mobile and desktop)
- **Real-time Updates** with backend API

### **🎨 UI Features:**
- Beautiful card-based layout
- Smooth animations with Framer Motion
- Icon-based information display
- Gradient pregnancy progress section
- Form validation and error handling
- Toast notifications for success/error

## 🐛 **Troubleshooting:**

### **If Profile Page Doesn't Load:**
1. **Check if backend is running:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check if MongoDB is connected:**
   - Look for "✅ MongoDB connected successfully" in backend console

3. **Check if user is logged in:**
   - Go to `http://localhost:3000/login` first
   - Register or login

### **If Profile Update Fails:**
1. **Check browser console** for errors
2. **Check backend console** for errors
3. **Verify JWT token** in localStorage:
   - F12 → Application → Local Storage → `authToken`

### **Common Issues:**
- **"MongoDB connection error"** → Start MongoDB
- **"JWT_SECRET not defined"** → Check .env file
- **"Port already in use"** → Change PORT in .env
- **"CORS error"** → Check FRONTEND_URL in .env

## 🔗 **API Endpoints Used:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

## 🎯 **Next Steps:**

Once the profile page is working, you can:
1. **Test all features** (edit profile, pregnancy tracking)
2. **Customize the design** (colors, layout)
3. **Add more fields** (emergency contacts, medical history)
4. **Implement other features** (chat history, file uploads)

## 📞 **Need Help?**

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set
3. Make sure MongoDB is running
4. Check that both servers are running on correct ports

The profile page should now work perfectly! 🎉
