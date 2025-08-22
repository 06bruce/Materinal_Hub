# 🤱 Maternal Health Hub - Live WHO Data Chatbot

A comprehensive maternal health chatbot that provides real-time health information using live WHO (World Health Organization) data, with support for Kinyarwanda and English languages.

## 🌟 Features

### 🤖 **Smart Chatbot with Live Data**
- **Real-time WHO API Integration** - Fetches live health statistics from WHO databases
- **Intelligent Category Detection** - Automatically categorizes user queries
- **Bilingual Support** - Full Kinyarwanda and English language support
- **Personalized Responses** - Context-aware advice based on user queries
- **Trend Analysis** - Provides insights on health data trends (improving/declining/stable)

### 📊 **Live Health Data Sources**
- **Antenatal Care Coverage** (ANC4_COVERAGE)
- **Skilled Birth Attendance** (BIRTHS_ATTENDED_BY_SKILLED_HEALTH_PERSONNEL)
- **Adolescent Birth Rate** (ADOLESCENT_BIRTH_RATE)
- **Maternal Mortality Ratio** (MATERNAL_MORTALITY_RATIO)
- **Emergency Surgical Care** (EMERGENCY_SURGICAL_CARE)
- **Nutrition Indicators** (CHILDREN_UNDER_5_OVERWEIGHT)
- **Mental Health Data** (MENTAL_HEALTH_DEPRESSION)

### 🎯 **Supported Categories**
- **Pregnancy** - Antenatal care, prenatal checkups, baby development
- **Emergency** - Emergency symptoms, urgent care, complications
- **Nutrition** - Diet, vitamins, healthy eating during pregnancy
- **Mental Health** - Depression, anxiety, stress management
- **Exercise** - Physical activity, fitness during pregnancy

### 💡 **Enhanced User Experience**
- **Confidence Scoring** - Shows how confident the system is in its response
- **Smart Suggestions** - Provides follow-up question suggestions
- **Fallback Responses** - Graceful handling when APIs are unavailable
- **Real-time Logging** - Comprehensive logging for debugging
- **Error Handling** - Robust error handling with user-friendly messages

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for user authentication)

### 1. Install Dependencies
```bash
cd Materinal_Hub
npm run install-all
```

### 2. Configure Environment

#### Backend (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/maternal-health
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

### 3. Start the Application

#### Option A: Start Both Services (Recommended)
```bash
npm run dev
```

#### Option B: Start Services Separately
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

### 4. Test the API
```bash
npm run test-api
```

## 🧪 Testing the Chatbot

### Sample Queries to Test

#### Pregnancy Related
- "pregnancy" / "ubuzima"
- "antenatal care" / "kujya kwa muganga"
- "vitamins" / "vitamini"
- "baby development" / "gukura kw'umwana"

#### Emergency Related
- "emergency" / "ingenzi"
- "bleeding" / "amaraso"
- "severe pain" / "ububabare"
- "complications" / "ibibazo"

#### Nutrition Related
- "nutrition" / "ibiryo"
- "healthy diet" / "ibiryo byiza"
- "vitamins" / "vitamini"
- "water intake" / "amazi"

#### Mental Health Related
- "mental health" / "ubuzima bw'ubwenge"
- "depression" / "agahinda"
- "anxiety" / "ubwoba"
- "stress" / "agahinda"

## 📡 API Endpoints

### Chat API
```http
POST /api/chat
Content-Type: application/json

{
  "message": "pregnancy",
  "language": "en"
}
```

**Response:**
```json
{
  "id": 1234567890,
  "type": "bot",
  "content": "Based on recent WHO global health data: Antenatal care coverage is around 85.2% and is improving...",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "category": "pregnancy",
  "confidence": 0.85,
  "source": "api",
  "dataPoints": 3,
  "apiData": [...],
  "suggestions": ["Do you have concerns?", "What would you like to know?"]
}
```

### Health Check
```http
GET /health
```

### Health Centers
```http
GET /api/health-centers
```

### Pregnancy Information
```http
GET /api/pregnancy-info/:week
```

## 🔧 Technical Architecture

### Backend (Node.js/Express)
- **Real-time WHO API Integration** - Fetches live health data
- **Intelligent Category Detection** - Keyword-based categorization
- **Trend Analysis** - Calculates data trends over time
- **Bilingual Translation** - Kinyarwanda/English translation
- **Error Handling** - Robust error handling with fallbacks
- **Logging** - Comprehensive request/response logging

### Frontend (React)
- **Real-time Chat Interface** - Live chat with backend
- **API Integration** - Centralized API configuration
- **Error Handling** - Graceful fallback responses
- **Responsive Design** - Mobile and desktop optimized
- **Loading States** - User-friendly loading indicators

### Data Flow
1. **User Input** → Frontend sends message to backend
2. **Category Detection** → Backend analyzes message content
3. **WHO API Fetch** → Backend fetches relevant health data
4. **Data Processing** → Backend processes and analyzes trends
5. **Response Generation** → Backend generates personalized response
6. **Translation** → Response translated to user's language
7. **Frontend Display** → Enhanced response displayed to user

## 📊 WHO Data Integration

### Data Sources
The chatbot integrates with multiple WHO health indicators:

- **ANC4_COVERAGE** - Antenatal care coverage (4+ visits)
- **BIRTHS_ATTENDED_BY_SKILLED_HEALTH_PERSONNEL** - Skilled birth attendance
- **ADOLESCENT_BIRTH_RATE** - Adolescent birth rate statistics
- **MATERNAL_MORTALITY_RATIO** - Maternal mortality trends
- **EMERGENCY_SURGICAL_CARE** - Emergency care access
- **CHILDREN_UNDER_5_OVERWEIGHT** - Nutrition indicators
- **MENTAL_HEALTH_DEPRESSION** - Mental health statistics

### Data Processing
- **Trend Analysis** - Calculates improving/declining/stable trends
- **Data Aggregation** - Combines multiple data sources
- **Statistical Analysis** - Provides meaningful insights
- **Real-time Updates** - Fetches latest available data

## 🎨 User Interface Features

### Chat Interface
- **Real-time Messaging** - Instant responses with typing indicators
- **Message Categories** - Color-coded message types
- **Smart Suggestions** - Context-aware follow-up questions
- **Confidence Indicators** - Shows response confidence level
- **Data Sources** - Displays data source information

### Health Centers
- **Interactive Map** - Location-based health center display
- **Contact Information** - Phone numbers and hours
- **Ratings & Reviews** - User ratings and feedback
- **Emergency Services** - 24/7 emergency service indicators

### Pregnancy Tracker
- **Week-by-week Information** - Detailed pregnancy progression
- **Baby Development** - Fetal development milestones
- **Health Tips** - Personalized health advice
- **Due Date Calculator** - Pregnancy timeline tracking

## 🔒 Security & Performance

### Security Features
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Message content validation
- **Rate Limiting** - API request rate limiting
- **Error Sanitization** - Safe error message handling

### Performance Optimizations
- **API Caching** - Intelligent data caching
- **Request Timeouts** - Configurable timeout settings
- **Fallback Responses** - Offline-capable responses
- **Lazy Loading** - Optimized data loading

## 🐛 Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check if port 3001 is available
netstat -an | grep 3001

# Check MongoDB connection
mongo --eval "db.runCommand('ping')"
```

#### Frontend Connection Issues
```bash
# Check if backend is running
curl http://localhost:3001/health

# Check environment variables
echo $REACT_APP_API_URL
```

#### WHO API Issues
```bash
# Test WHO API directly
curl https://ghoapi.azureedge.net/api/ANC4_COVERAGE

# Check network connectivity
ping ghoapi.azureedge.net
```

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
REACT_APP_DEBUG=true
```

## 📈 Future Enhancements

### Planned Features
- **Machine Learning Integration** - AI-powered response generation
- **Voice Recognition** - Speech-to-text capabilities
- **Image Recognition** - Symptom analysis from photos
- **Personalized Profiles** - User-specific health tracking
- **Telemedicine Integration** - Direct doctor consultation
- **Offline Mode** - Enhanced offline capabilities

### Data Enhancements
- **Local Health Data** - Rwanda-specific health statistics
- **Real-time Alerts** - Health emergency notifications
- **Predictive Analytics** - Health trend predictions
- **Community Data** - User-generated health insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **World Health Organization** - For providing comprehensive health data APIs
- **Rwanda Ministry of Health** - For local health guidelines and support
- **Open Source Community** - For the amazing tools and libraries used

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the API documentation

---

**Made with ❤️ for maternal health in Rwanda**
