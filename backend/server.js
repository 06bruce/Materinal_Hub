const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Keyword to category mapping


const categories = {
  pregnancy: ['pregnancy', 'ubuzima', "ubw'abana"],
  emergency: ['emergency', 'ingenzi', 'amaraso'],
  nutrition: ['nutrition', 'ibiryo', 'food']
};


// Category to trusted sources mapping

const sources = {
  pregnancy: [
    'https://www.who.int/data/gho/info/indicator-metadata-registry/imr-details/3323', // example
    'https://www.moh.gov.rw/pregnancy-guidelines' // hypothetical Rwanda MoH endpoint
  ],
  emergency: [
    'https://www.moh.gov.rw/emergency-guidelines', // hypothetical
    'https://www.cdc.gov/emergency-preparedness'
  ],
  nutrition: [
    'https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
  ]
};


// Predefined fallback messages
const fallbackResponses = {
  rw: {
    pregnancy: 'Ubusanzwe ubuzima bwawe bwiza. Reba ko ufata vitamini zawe buri munsi kandi ujya kwa muganga.',
    emergency: 'Ibi ni ibibazo by\'ingenzi! Ijya kwa muganga vuba cyane cyane niba ufite amaraso cyangwa ububabare.',
    nutrition: 'Fata ibiryo byuzuye amatungo, imboga, n\'imbuto. Reba ko unywa amazi menshi.',
    default: 'Nshobora kugufasha kugenzura ubuzima bwawe. Vuga ibibazo byawe cyangwa ibyo ushaka kumenya.'
  },
  en: {
    pregnancy: 'Your pregnancy is going well. Make sure to take your vitamins daily and attend regular checkups.',
    emergency: 'These are emergency symptoms! Go to the hospital immediately, especially if you have bleeding or severe pain.',
    nutrition: 'Eat a balanced diet with proteins, vegetables, and fruits. Make sure to drink plenty of water.',
    default: 'I can help you monitor your health. Tell me your concerns or what you want to know.'
  }
};




// Detect category based on keywords
function detectCategory(message) {
  const lower = message.toLowerCase();
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(word => lower.includes(word))) return cat;
  }
  return 'default';
}

// Fetch content from trusted sources
async function fetchFromSources(category) {
  const urls = sources[category] || [];
  for (const url of urls) {
    try {
      const resp = await axios.get(url);
      if (resp.data && resp.data.summary) return resp.data.summary; // adjust depending on API
      if (resp.data && typeof resp.data === 'string') return resp.data;
    } catch (e) {
      console.warn(`Failed fetching from ${url}: ${e.message}`);
      continue;
    }
  }
  return null;
}




// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maternal-health', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Maternal Health API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'rw' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const category = detectCategory(message);
    let content = await fetchFromSources(category);

    if (!content) {
      content = fallbackResponses[language][category] || fallbackResponses[language].default;
    }

    res.json({
      id: Date.now(),
      type: 'bot',
      content,
      timestamp: new Date().toISOString(),
      category
    });
  } catch (error) {
    console.error('Chat error:', error);
    if (error.response) {
      // Axios error
      res.status(error.response.status).json({
        error: 'Error fetching data from sources',
        message: error.message
      });
    } else {
      // General error
      res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong processing your request'
      });
    }
  }
});


// Health centers endpoint
app.get('/api/health-centers', (req, res) => {
  const centers = [
    {
      id: 1,
      name: "Kigali Central Hospital",
      location: "Kigali, Rwanda",
      phone: "+250 788 123 456",
      hours: "24/7 Emergency Services",
      rating: 4.5,
      coordinates: [-1.9441, 30.0619]
    },
    {
      id: 2,
      name: "King Faisal Hospital",
      location: "Kigali, Rwanda",
      phone: "+250 788 234 567",
      hours: "Mon-Fri: 8AM-6PM",
      rating: 4.8,
      coordinates: [-1.9500, 30.0586]
    },
    {
      id: 3,
      name: "Rwanda Military Hospital",
      location: "Kigali, Rwanda",
      phone: "+250 788 345 678",
      hours: "24/7 Emergency Services",
      rating: 4.3,
      coordinates: [-1.9488, 30.0647]
    }
  ];

  res.json(centers);
});

// Pregnancy information endpoint
app.get('/api/pregnancy-info/:week', (req, res) => {
  const week = parseInt(req.params.week);
  
  const weekInfo = {
    rw: {
      baby: `Umwana wawe afite uburebure bwa cm ${2 + week * 0.5} kandi afite ibiro bya gram ${week * 7}.`,
      mother: "Ushobora kumva ububabare mu nda kandi ushobora kumva umwana akina.",
      tips: "Fata vitamini zawe buri munsi, unywa amazi menshi, kandi ujya kwa muganga."
    },
    en: {
      baby: `Your baby is about ${2 + week * 0.5} cm long and weighs about ${week * 7} grams.`,
      mother: "You may feel abdominal pain and you may feel the baby moving.",
      tips: "Take your vitamins daily, drink plenty of water, and see your doctor."
    }
  };

  res.json({
    week,
    info: weekInfo.rw // Default to Kinyarwanda
  });


  res.josn({
    week,
    info: weekInfi.fr
  })
});

// Emergency contacts endpoint
app.get('/api/emergency-contacts', (req, res) => {
  const contacts = [
    {
      name: "Emergency Hotline",
      phone: "+250 788 123 456",
      description: "24/7 emergency medical assistance"
    },
    {
      name: "Maternal Health Support",
      phone: "+250 788 234 567",
      description: "Specialized maternal health support"
    },
    {
      name: "Mental Health Crisis",
      phone: "+250 788 345 678",
      description: "Mental health crisis intervention"
    }
  ];

  res.json(contacts);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Maternal Health API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
