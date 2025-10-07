# Maternal Health Hub

A comprehensive maternal health chatbot application built with React and Node.js, designed to provide health guidance and support for pregnant women in Rwanda, with support for Kinyarwanda, English, and French languages.

## 🚀 Features

- **Multilingual Support**: Kinyarwanda, English, and French
- **AI Chatbot**: Powered by Chatbase for maternal health guidance
- **Pregnancy Tracking**: Track pregnancy progress and milestones
- **Health Centers**: Find nearby health centers and emergency contacts
- **Mental Health Support**: Resources and guidance for mental health
- **User Authentication**: Secure user registration and login
**Evidence-based Content**: Medically reviewed maternal health information
- **Responsive Design**: Mobile-first design with modern UI

## 🛠 Tech Stack

### Frontend
- **React 18** with Hooks
- **Styled Components** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate Limiting** for API protection
- **Node Cache** for response caching

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Materinal_Hub/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the environment template
   cp env-template.txt .env
   
   # Edit .env file with your values
   nano .env
   ```

4. **Required Environment Variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/maternal-health
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   NODE_ENV=development
   CHATBASE_API_KEY=your-chatbase-api-key-here
   CHATBASE_BOT_ID=your-chatbase-bot-id-here
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the environment template
   cp env-template.txt .env
   
   # Edit .env file with your values
   nano .env
   ```

4. **Required Environment Variables**
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_NAME=Maternal Health Hub
   REACT_APP_VERSION=1.0.0
   ```

5. **Start the frontend development server**
   ```bash
   npm start
   ```

## 🚀 Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 📁 Project Structure

```
Materinal_Hub/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main App component
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Health Data
 - `GET /api/health-centers` - Get health centers
 - `GET /api/emergency-contacts` - Get emergency contacts

### Chat
- `POST /api/chat` - Send chat message

### System
- `GET /health` - Health check endpoint

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Protection** with configurable origins
- **Helmet.js** for security headers
- **Environment Variables** for sensitive data

## 🎨 UI/UX Features

- **Responsive Design** for all screen sizes
- **Dark/Light Mode** support
- **Loading States** with spinners
- **Error Boundaries** for graceful error handling
- **Toast Notifications** for user feedback
- **Smooth Animations** with Framer Motion
- **Accessibility** features with ARIA labels

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and start the server
3. Use PM2 or similar process manager

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Recent Updates

- ✅ Fixed security issues with API keys
- ✅ Removed duplicate code and files
- ✅ Added comprehensive error handling
- ✅ Implemented performance optimizations
- ✅ Added caching and rate limiting
- ✅ Improved code organization
- ✅ Enhanced UI/UX with loading states

---

**Built with ❤️ for maternal health in Rwanda**
