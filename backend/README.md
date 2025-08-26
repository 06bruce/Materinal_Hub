# Maternal Health Backend API

A Node.js/Express.js backend API for the Maternal Health Chatbot with real authentication, MongoDB database, and JWT tokens.

## 🚀 Features

- **User Authentication**: Register, login, logout with JWT tokens
- **User Profiles**: Complete user profiles with pregnancy tracking
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing, input validation, CORS protection
- **Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Configure your .env file:**
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/maternal-health
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   ```

## 🗄️ Database Setup

### Recommendation : MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`

## 🏃‍♂️ Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication Routes

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+250788123456",
  "age": 25,
  "isPregnant": true,
  "pregnancyStartDate": "2024-01-15"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user profile (requires authentication)

#### PUT `/api/auth/profile`
Update user profile (requires authentication)

#### POST `/api/auth/logout`
Logout user (requires authentication)

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isPregnant": true,
    "currentWeek": 12,
    "preferences": {
      "language": "rw",
      "notifications": true
    }
  }
}
```

## 🔐 Authentication

- JWT tokens with 30-day expiration
- Password hashing with bcrypt
- Protected routes with middleware
- Token-based authentication

## 🛡️ Security Features

- Password hashing (bcrypt)
- Input validation (express-validator)
- CORS protection
- Helmet security headers
- Rate limiting (configured but not implemented)
- JWT token validation

## 📁 Project Structure

```
backend/
├── models/
│   └── User.js              # User model with schema
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── validate.js          # Validation middleware
├── routes/
│   └── auth.js              # Authentication routes
├── server.js                # Main server file
├── package.json             # Dependencies
└── env.example              # Environment variables example
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/maternal-health |
| `JWT_SECRET` | JWT signing secret | (required) |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## 🧪 Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Example curl commands:

**Register:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    }
  ]
}
```

## 🔄 Integration with Frontend

The frontend is configured to:
1. Send requests to `http://localhost:3001/api`
2. Store JWT tokens in localStorage
3. Include tokens in Authorization headers
4. Handle authentication errors

## 🚀 Next Steps

After setting up authentication, you can:
1. Add chat history persistence
2. Implement real AI integration
3. Add file upload for medical documents
4. Create admin dashboard
5. Add email verification
6. Implement password reset

## 📞 Support

For issues or questions:
1. Check the console logs
2. Verify MongoDB connection
3. Ensure all environment variables are set
4. Check CORS configuration if frontend can't connect
