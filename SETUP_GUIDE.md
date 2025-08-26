# Maternal Health Hub - Setup Guide

This guide will help you set up and run both the frontend and backend of the Maternal Health Hub application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for user authentication features)

## Backend Setup

### 1. Navigate to the backend directory
```bash
cd Materinal_Hub/new/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Create a `.env` file in the backend directory with the following content:
```env
PORT=3001
MONGODB_URI=
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Start the backend server
```bash
npm run dev
```

The backend will start on `http://localhost:3001`

## Frontend Setup

### 1. Navigate to the frontend directory
```bash
cd Materinal_Hub/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Create a `.env` file in the frontend directory with the following content:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

### 4. Start the frontend development server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Integration

The application now includes real API integration with the following features:

### Backend APIs
- **Chat API**: `/api/chat` - Handles chat messages with WHO data integration
- **Health Centers**: `/api/health-centers` - Provides health center information and geolocation of the nearby hospitals or health centers
- **Pregnancy Info**: `/api/pregnancy-info/:week` - Week-by-week pregnancy information and pastpartum fuid
- **Emergency Contacts**: `/api/emergency-contacts` - Emergency contact information
- **Authentication**: `/api/auth/*` - User authentication endpoints

### WHO Data Integration
The backend now fetches real data from WHO APIs:
- Antenatal Care Coverage (ANC4_COVERAGE)
- Skilled Birth Attendance
- Adolescent Birth Rate

### Frontend-Backend Connection
- Frontend automatically connects to backend on port 3001
- API calls are centralized in `/src/config/api.js`
- Fallback responses when API is unavailable
- Real-time chat with backend processing

## Running Both Services

### Option 1: Separate Terminals
1. Terminal 1 (Backend):
   ```bash
   cd Materinal_Hub/backend
   npm run dev
   ```

2. Terminal 2 (Frontend):
   ```bash
   cd Materinal_Hub/frontend
   npm start
   ```

### Option 2: Using a Process Manager
You can use tools like `concurrently` or `pm2` to run both services together.

## Testing the Connection

1. Open your browser to `http://localhost:3000`
2. Navigate to the Chat page
3. Send a message about pregnancy, emergency, or nutrition
4. The system will fetch real WHO data and respond accordingly

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running (if using authentication)
- Check that port 3001 is available
- Verify all dependencies are installed

### Frontend Issues
- Ensure the backend is running on port 3001
- Check the `.env` file configuration
- Clear browser cache if needed

### CORS Issues
The backend is configured to accept requests from `http://localhost:3000`. If you change the frontend port, update the `FRONTEND_URL` in the backend `.env` file.

## API Endpoints

### Chat
- **POST** `/api/chat`
  - Body: `{ "message": "string", "language": "rw|en" }`
  - Returns: Chat response with WHO data integration

### Health Centers
- **GET** `/api/health-centers`
  - Returns: List of health centers with contact information

### Pregnancy Information
- **GET** `/api/pregnancy-info/:week`
  - Returns: Week-specific pregnancy information

### Emergency Contacts
- **GET** `/api/emergency-contacts`
  - Returns: Emergency contact information

## Development Notes

- The backend includes real WHO API integration for pregnancy-related queries
- Frontend has fallback responses when API is unavailable
- All API calls are centralized and configurable
- CORS is properly configured for local development
- Error handling includes graceful fallbacks

## Next Steps

1. Test all API endpoints
2. Customize WHO data processing as needed
3. Add more health data sources
4. Implement user authentication
5. Deploy to production environment
