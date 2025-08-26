const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced keyword to category mapping
const categories = {
  pregnancy: [
    'pregnancy', 'ubuzima', "ubw'abana", 'pregnant', 'baby', 'umwana', 
    'antenatal', 'prenatal', 'checkup', 'muganga', 'doctor', 'vitamin',
    'week', 'month', 'due date', 'birth', 'delivery', 'labor'
  ],
  emergency: [
    'emergency', 'ingenzi', 'amaraso', 'bleeding', 'pain', 'ububabare',
    'urgent', 'critical', 'danger', 'risk', 'complication', 'problem',
    'symptom', 'fever', 'headache', 'dizziness', 'fainting'
  ],
  nutrition: [
    'nutrition', 'ibiryo', 'food', 'diet', 'eating', 'meal', 'vitamin',
    'protein', 'vegetable', 'fruit', 'water', 'drink', 'healthy',
    'supplement', 'iron', 'calcium', 'folic acid'
  ],
  mental_health: [
    'mental', 'depression', 'anxiety', 'stress', 'mood', 'feeling',
    'sad', 'happy', 'worried', 'fear', 'support', 'counseling'
  ],
  exercise: [
    'exercise', 'workout', 'activity', 'movement', 'walking', 'yoga',
    'fitness', 'physical', 'strength', 'flexibility'
  ]
};


// Enhanced category to trusted sources mapping
const sources = {
  pregnancy: [
    // WHO Antenatal Care (4+ visits)
    'https://ghoapi.azureedge.net/api/ANC4_COVERAGE',
    // WHO Skilled Birth Attendance
    'https://ghoapi.azureedge.net/api/BIRTHS_ATTENDED_BY_SKILLED_HEALTH_PERSONNEL',
    // WHO Adolescent Birth Rate
    'https://ghoapi.azureedge.net/api/ADOLESCENT_BIRTH_RATE',
    // WHO Maternal Mortality
    'https://ghoapi.azureedge.net/api/MATERNAL_MORTALITY_RATIO'
  ],
  emergency: [
    'https://ghoapi.azureedge.net/api/EMERGENCY_SURGICAL_CARE',
    'https://www.who.int/emergencies/emergency-care-framework'
  ],
  nutrition: [
    'https://ghoapi.azureedge.net/api/CHILDREN_UNDER_5_OVERWEIGHT',
    'https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
  ],
  mental_health: [
    'https://ghoapi.azureedge.net/api/MENTAL_HEALTH_DEPRESSION',
    'https://www.who.int/health-topics/mental-health'
  ],
  exercise: [
    'https://www.who.int/news-room/fact-sheets/detail/physical-activity'
  ]
};


// Enhanced predefined fallback messages
const fallbackResponses = {
  rw: {
    pregnancy: 'Ubusanzwe ubuzima bwawe bwiza. Reba ko ufata vitamini zawe buri munsi kandi ujya kwa muganga. Umwana wawe akura neza.',
    emergency: 'Ibi ni ibibazo by\'ingenzi! Ijya kwa muganga vuba cyane cyane niba ufite amaraso cyangwa ububabare. Ntuzagire ubwoba.',
    nutrition: 'Fata ibiryo byuzuye amatungo, imboga, n\'imbuto. Reba ko unywa amazi menshi. Ibi bizagufasha kuba ufite ubuzima bwiza.',
    mental_health: 'Ubuzima bwawe bw\'ubwenge ni ngombwa. Vuga ibibazo byawe kwa muganga cyangwa umufasha. Ntuzagire ubwoba.',
    exercise: 'Gukora sport bizagufasha kuba ufite ubuzima bwiza. Reba ko ukora sport yoroshye nka kugenda.',
    default: 'Nshobora kugufasha kugenzura ubuzima bwawe. Vuga ibibazo byawe cyangwa ibyo ushaka kumenya.'
  },
  en: {
    pregnancy: 'Your pregnancy is progressing well. Make sure to take your vitamins daily, attend regular checkups, and get plenty of rest.',
    emergency: 'These are emergency symptoms! Go to the hospital immediately, especially if you have bleeding or severe pain. Don\'t delay.',
    nutrition: 'Eat a balanced diet with proteins, vegetables, and fruits. Make sure to drink plenty of water. This will help you stay healthy.',
    mental_health: 'Your mental health is important. Talk to your doctor or counselor about your concerns. Don\'t be afraid to seek help.',
    exercise: 'Regular exercise will help you stay healthy. Try gentle activities like walking or prenatal yoga.',
    default: 'I can help you monitor your health. Tell me your concerns or what you want to know.'
  }
};




// ---------------------------
// WHO GHO API helpers
// ---------------------------
const WHO_BASE = 'https://ghoapi.azureedge.net/api';
const cache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 120 }); // 30 min TTL

// Try to find the best WHO IndicatorCode by keyword(s)
async function findIndicatorCodeByKeywords(keywords = []) {
  const cacheKey = `indcode:${keywords.join('|').toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const q = keywords.map(k => `contains(IndicatorName,'${k}')`).join(' or ');
  const url = `${WHO_BASE}/Indicator?$select=IndicatorCode,IndicatorName&$filter=${encodeURI(q)}&$top=100`;
  const { data } = await axios.get(url);
  const list = (data && data.value) ? data.value : [];

  // Simple scoring: longer name match & earlier in list gets more weight
  const best = list.sort((a, b) => (b.IndicatorName.length - a.IndicatorName.length))[0];
  if (!best) return null;

  cache.set(cacheKey, best);
  return best; // { IndicatorCode, IndicatorName }
}

// Fetch latest value for a given IndicatorCode & ISO3 country (e.g., 'RWA')
async function fetchLatestIndicatorValue(indicatorCode, iso3 = 'RWA') {
  const cacheKey = `indval:${indicatorCode}:${iso3}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `${WHO_BASE}/${indicatorCode}?$filter=SpatialDim eq '${iso3}'&$orderby=TimeDim desc&$top=1`;
  const { data } = await axios.get(url);
  const row = (data && data.value && data.value[0]) ? data.value[0] : null;
  if (!row) return null;

  const result = {
    indicatorCode,
    indicatorName: row.IndicatorName || indicatorCode,
    country: row.SpatialDim,
    year: row.TimeDim,
    value: row.Value,
    unit: row.Dim1 || '%', // Many maternal indicators are percentages; adjust if Dim1 present
  };
  cache.set(cacheKey, result);
  return result;
}

// Resolve country to ISO3; accepts ISO3 directly or a few common names
const COUNTRY_TO_ISO3 = {
  Rwanda: 'RWA', Rw: 'RWA', 'Rwanda 🇷🇼': 'RWA',
  Kenya: 'KEN', Uganda: 'UGA', Tanzania: 'TZA', Burundi: 'BDI',
  'Democratic Republic of the Congo': 'COD', Congo: 'COG',
};
function normalizeCountry(input = 'RWA') {
  if (!input) return 'RWA';
  const s = String(input).trim();
  if (/^[A-Z]{3}$/.test(s)) return s; // already ISO3
  return COUNTRY_TO_ISO3[s] || 'RWA';
}

// ---------------------------
// "AI" layer: map intents -> indicator keyword sets
// ---------------------------
// We avoid hard-coding IndicatorCodes by discovering them via keywords at runtime.
const INTENT_MAP = {
  anc4: {
    keywords: ['antenatal care', 'at least four', 'anc4', 'pregnancy checkups'],
    display: { rw: 'Gusuzumwa kuwa mbere yo kubyara (inshuro 4+ %)', en: 'Antenatal care (4+ visits %)' }
  },
  sba: {
    keywords: ['skilled birth', 'attended by skilled', 'delivery with a skilled attendant', 'sba'],
    display: { rw: 'Kubyara byitabiriwe n\'abaganga b\'inzobere (%)', en: 'Births attended by skilled health personnel (%)' }
  },
  mmr: {
    keywords: ['maternal mortality ratio', 'mmr', 'maternal deaths per 100000'],
    display: { rw: 'Igipimo cy\'urupfu rw\'ababyeyi (ku 100,000)', en: 'Maternal mortality ratio (per 100,000 live births)' }
  },
  abr: {
    keywords: ['adolescent birth rate', 'teenage pregnancy', 'girls 15-19'],
    display: { rw: 'Igipimo cy\'ivuka mu bangavu', en: 'Adolescent birth rate' }
  }
};

// Given a user question, detect which intents they want
function detectIntents(message) {
  const lower = (message || '').toLowerCase();
  const intents = [];
  for (const [key, cfg] of Object.entries(INTENT_MAP)) {
    if (cfg.keywords.some(k => lower.includes(k.toLowerCase()))) intents.push(key);
  }
  // default: if they said pregnancy/maternal with no specifics, fetch a bundle
  if (intents.length === 0 && /(pregnan|maternal|umubyeyi|kwitera|kwabyara|kwisuzumisha)/i.test(lower)) {
    return ['anc4', 'sba', 'mmr'];
  }
  return intents.length ? intents : ['anc4'];
}

// Build a natural-language answer from indicator results
function renderAnswer(results = [], lang = 'rw') {
  if (!results.length) {
    return lang === 'rw'
      ? 'Nabonye ikibazo cyawe, ariko sinabonye amakuru agezweho ya WHO kuri iki kibazo ubu.'
      : 'I understood your question, but I could not retrieve up-to-date WHO data for this right now.';
  }

  const lines = results.map(r => {
    const title = Object.values(INTENT_MAP).find(x => (x.display.en === r.intentDisplay.en)) ? r.intentDisplay[lang] : r.indicatorName;
    const val = r.value !== undefined && r.value !== null ? r.value : '—';
    const unit = r.unit ? ` ${r.unit}` : '';
    return `${title}: ${val}${unit} (${r.country}, ${r.year}).`;
  });

  return lang === 'rw'
    ? `Dukoresheje amakuru ya WHO, dore bimwe mu by'ingenzi kuri ubuzima bw'umubyeyi: \n- ${lines.join('\n- ')}`
    : `Using WHO data, here are key maternal health stats: \n- ${lines.join('\n- ')}`;
}

// Main brain: parse question -> find indicators -> fetch values -> assemble
async function answerMaternalQuestion({ message, language = 'rw', country = 'RWA' }) {
  const iso3 = normalizeCountry(country);
  const intents = detectIntents(message || '');
  const out = [];

  for (const intent of intents) {
    const cfg = INTENT_MAP[intent];
    if (!cfg) continue;

    // Find the best indicator code for this intent on the fly
    const match = await findIndicatorCodeByKeywords(cfg.keywords);
    if (!match) continue;

    const data = await fetchLatestIndicatorValue(match.IndicatorCode, iso3);
    if (data) {
      out.push({
        intent,
        intentDisplay: cfg.display,
        indicatorCode: match.IndicatorCode,
        indicatorName: match.IndicatorName,
        ...data
      });
    }
  }

  return {
    country: iso3,
    language,
    intents,
    results: out,
    text: renderAnswer(out, language)
  };
}

// Detect category based on keywords
function detectCategory(message) {
  const lower = message.toLowerCase();
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(word => lower.includes(word))) return cat;
  }
  return 'default';
}

// Enhanced fetch content from trusted sources
async function fetchFromSources(category) {
  const urls = sources[category] || [];
  let aggregatedData = [];
  let successCount = 0;
  
  console.log(`🔍 Fetching data for category: ${category}`);
  
  for (const url of urls) {
    try {
      console.log(`📡 Fetching from: ${url}`);
      const resp = await axios.get(url, {
        timeout: 15000, // 15 second timeout
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Maternal-Health-App/1.0'
        }
      });
      
      if (resp.data) {
        // Handle WHO API responses
        if (url.includes('ghoapi.azureedge.net')) {
          if (resp.data.value && Array.isArray(resp.data.value)) {
            // Extract relevant data from WHO API
            const latestData = resp.data.value
              .filter(item => item.Value !== null && item.Value !== undefined)
              .sort((a, b) => new Date(b.TimeDim) - new Date(a.TimeDim))
              .slice(0, 10); // Get latest 10 data points for better accuracy
            
            if (latestData.length > 0) {
              const avgValue = latestData.reduce((sum, item) => sum + item.Value, 0) / latestData.length;
              const trend = calculateTrend(latestData);
              
              aggregatedData.push({
                source: 'WHO',
                indicator: resp.data.value[0]?.Indicator || 'Health Indicator',
                value: avgValue,
                unit: resp.data.value[0]?.Unit || '%',
                year: latestData[0]?.TimeDim || 'Recent',
                trend: trend,
                dataPoints: latestData.length
              });
              
              successCount++;
              console.log(`✅ Successfully fetched WHO data: ${resp.data.value[0]?.Indicator}`);
            }
          }
        } else if (typeof resp.data === 'string') {
          aggregatedData.push({
            source: 'External',
            content: resp.data.substring(0, 800) + '...', // Increased content length
            url: url
          });
          successCount++;
        }
      }
    } catch (e) {
      console.warn(`❌ Failed fetching from ${url}: ${e.message}`);
      continue;
    }
  }
  
  console.log(`📊 Fetched ${successCount} successful responses for ${category}`);
  
  if (aggregatedData.length > 0) {
    return {
      type: 'api_data',
      category,
      data: aggregatedData,
      summary: generateSummaryFromData(aggregatedData, category),
      successCount: successCount
    };
  }
  
  return null;
}

// Calculate trend from data points
function calculateTrend(dataPoints) {
  if (dataPoints.length < 2) return 'stable';
  
  const values = dataPoints.map(d => d.Value);
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (change > 5) return 'improving';
  if (change < -5) return 'declining';
  return 'stable';
}

// Enhanced generate human-readable summary from API data
function generateSummaryFromData(data, category) {
  const whoData = data.filter(item => item.source === 'WHO');
  
  if (category === 'pregnancy') {
    if (whoData.length > 0) {
      const ancCoverage = whoData.find(item => item.indicator.includes('ANC4'));
      const skilledBirth = whoData.find(item => item.indicator.includes('SKILLED'));
      const maternalMortality = whoData.find(item => item.indicator.includes('MATERNAL_MORTALITY'));
      
      let summary = 'Based on recent WHO global health data: ';
      
      if (ancCoverage) {
        const trend = ancCoverage.trend === 'improving' ? 'improving' : ancCoverage.trend === 'declining' ? 'needs attention' : 'stable';
        summary += `Antenatal care coverage is around ${ancCoverage.value.toFixed(1)}${ancCoverage.unit} and is ${trend}. `;
      }
      
      if (skilledBirth) {
        const trend = skilledBirth.trend === 'improving' ? 'improving' : skilledBirth.trend === 'declining' ? 'needs attention' : 'stable';
        summary += `Skilled birth attendance rate is approximately ${skilledBirth.value.toFixed(1)}${skilledBirth.unit} and is ${trend}. `;
      }
      
      if (maternalMortality) {
        summary += `Maternal mortality trends show ${maternalMortality.trend} patterns. `;
      }
      
      summary += 'These indicators help track global maternal health progress.';
      return summary;
    }
  }
  
  if (category === 'emergency') {
    if (whoData.length > 0) {
      const emergencyCare = whoData.find(item => item.indicator.includes('EMERGENCY'));
      
      if (emergencyCare) {
        return `Emergency care access shows ${emergencyCare.trend} trends globally. It's crucial to have emergency care available during pregnancy.`;
      }
    }
  }
  
  if (category === 'nutrition') {
    if (whoData.length > 0) {
      const nutritionData = whoData.find(item => item.indicator.includes('NUTRITION') || item.indicator.includes('OVERWEIGHT'));
      
      if (nutritionData) {
        return `Nutrition indicators show ${nutritionData.trend} trends. Proper nutrition during pregnancy is essential for both mother and baby.`;
      }
    }
  }
  
  if (category === 'mental_health') {
    if (whoData.length > 0) {
      const mentalHealthData = whoData.find(item => item.indicator.includes('MENTAL'));
      
      if (mentalHealthData) {
        return `Mental health awareness is ${mentalHealthData.trend}. It's important to address mental health during pregnancy and postpartum.`;
      }
    }
  }
  
  // Default response with data insights
  if (whoData.length > 0) {
    const latestData = whoData[0];
    return `Recent WHO data shows ${latestData.indicator} at ${latestData.value.toFixed(1)}${latestData.unit} with ${latestData.trend} trends. This information helps guide health decisions.`;
  }
  
  return 'Recent health data shows positive trends in maternal care access and outcomes.';
}




// Connect to MongoDB (optional)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed, continuing without database:', err.message);
    console.log('💡 To enable database features, chaeck you internet connection and reconnect to the internet');
  });
} 

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

// WHO maternal data endpoint
app.get('/api/who/maternal', async (req, res) => {
  try {
    const { country = 'RWA', lang = 'rw', intents: intentsCsv } = req.query;
    const language = ['rw', 'en'].includes(String(lang)) ? lang : 'rw';

    let intents = intentsCsv ? String(intentsCsv).split(',').map(s => s.trim()) : ['anc4', 'sba', 'mmr'];
    // sanitize intents
    intents = intents.filter(k => INTENT_MAP[k]);
    if (!intents.length) intents = ['anc4'];

    const result = await answerMaternalQuestion({ message: intents.join(','), language, country });
    res.json(result);
  } catch (err) {
    console.error('who/maternal error:', err.message);
    res.status(500).json({ error: 'Failed to fetch WHO maternal data', details: err.message });
  }
});

// Enhanced Chat endpoint with WHO API integration
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'rw', country = 'RWA' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`💬 Chat request: "${message}" in ${language}`);

    const category = detectCategory(message);
    console.log(`🏷️ Detected category: ${category}`);

    let responseData = {
      id: Date.now(),
      type: 'bot',
      timestamp: new Date().toISOString(),
      category,
      confidence: calculateConfidence(message, category)
    };

    // For pregnancy-related questions, use WHO API data
    if (category === 'pregnancy') {
      try {
        console.log(`🌍 Fetching WHO data for pregnancy question...`);
        const whoResponse = await answerMaternalQuestion({ message, language, country });
        
        responseData.content = whoResponse.text;
        responseData.source = 'who_api';
        responseData.apiData = whoResponse.results;
        responseData.dataPoints = whoResponse.results.length;
        responseData.country = whoResponse.country;
        responseData.intents = whoResponse.intents;
        
        console.log(`✅ WHO API response generated with ${whoResponse.results.length} data points`);
      } catch (whoError) {
        console.error('❌ WHO API error:', whoError);
        // Fallback to static response if WHO API fails
        const fallbackResponse = fallbackResponses[language][category] || fallbackResponses[language].default;
        responseData.content = fallbackResponse;
        responseData.source = 'fallback';
        console.log(`⚠️ Using fallback response due to WHO API error`);
      }
    } else {
      // For non-pregnancy categories, use enhanced fallback responses
      const fallbackResponse = fallbackResponses[language][category] || fallbackResponses[language].default;
      const advice = getPersonalizedAdvice(category, language);
      
      responseData.content = `${fallbackResponse} ${advice}`;
      responseData.source = 'fallback';
      
      console.log(`⚠️ Using fallback response for category: ${category}`);
    }

    // Add helpful suggestions
    responseData.suggestions = getSuggestions(category, language);

    console.log(`📤 Sending response: ${responseData.content.substring(0, 100)}...`);
    res.json(responseData);
    
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong processing your request'
    });
  }
});

// Calculate confidence score for category detection
function calculateConfidence(message, category) {
  const lowerMessage = message.toLowerCase();
  const categoryKeywords = categories[category] || [];
  
  const matchedKeywords = categoryKeywords.filter(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  return Math.min(matchedKeywords.length / categoryKeywords.length, 1.0);
}

// Get personalized advice based on category
function getPersonalizedAdvice(category, language) {
  const advice = {
    rw: {
      pregnancy: 'Reba ko ujya kwa muganga buri munsi kandi ufata intungamubiri zawe.',
      emergency: 'Niba ufite ibibazo by\'ingenzi, ijya kwa muganga vuba.',
      nutrition: 'Fata ibiryo byuzuye kandi unywa amazi menshi.',
      mental_health: 'Vuga ibibazo byawe kwa muganga cyangwa umufasha.',
      exercise: 'Gukora sport yoroshye bizagufasha.',
      default: 'Reba ko ujya kwa muganga buri munsi.'
    },
    en: {
      pregnancy: 'Make sure to attend regular checkups and take your vitamins.',
      emergency: 'If you have emergency symptoms, seek medical help immediately.',
      nutrition: 'Eat a balanced diet and drink plenty of water.',
      mental_health: 'Talk to your doctor or counselor about your concerns.',
      exercise: 'Gentle exercise will help you stay healthy.',
      default: 'Make sure to attend regular checkups.'
    }
  };
  
  return advice[language][category] || advice[language].default;
}

// Get helpful suggestions for follow-up questions
function getSuggestions(category, language) {
  const suggestions = {
    rw: {
      pregnancy: ['Niba ufite ibibazo?', 'Ushaka kumenya iki?', 'Ushaka kumenya ibyerekeye urubyaro ?'],
      emergency: ['Ufite amaraso?', 'Ufite ububabare?', 'Ushaka kumenya ibyerekeye ingenzi?'],
      nutrition: ['Ushaka kumenya indyo yuzuye?', 'Ushaka kumenya vitamini wafata?', 'Ushaka kumenya ibindi byagufasha mukubona vitamini?'],
      mental_health: ['Ufite ubwoba?', 'Ufite agahinda?', 'Ushaka kumenya ibyerekeye ubuzima bw\'ubwenge?'],
      exercise: ['Ushaka kumenya sport?', 'Ushaka kumenya ibyerekeye gukora sport?', 'Ushaka kumenya ibyerekeye kugenda?'],
      default: ['Ushaka kumenya iki?', 'Ufite ibibazo?', 'Ushaka kumenya ibyerekeye ubuzima?']
    },
    en: {
      pregnancy: ['Do you have concerns?', 'What would you like to know?', 'Want to know about vitamins?'],
      emergency: ['Are you bleeding?', 'Are you in pain?', 'Want to know about emergencies?'],
      nutrition: ['Want to know about healthy foods?', 'Want to know about vitamins?', 'Want to know about water?'],
      mental_health: ['Are you worried?', 'Are you feeling sad?', 'Want to know about mental health?'],
      exercise: ['Want to know about exercise?', 'Want to know about physical activity?', 'Want to know about walking?'],
      default: ['What would you like to know?', 'Do you have concerns?', 'Want to know about health?']
    }
  };
  
  return suggestions[language][category] || suggestions[language].default;
}

// Enhanced translation function for API responses to Kinyarwanda
function translateToKinyarwanda(englishText) {
  const translations = {
    // WHO Data references
    'Based on recent WHO global health data': 'Hashingiye ku makuru ya WHO ya vuba aha y\'ubuzima bw\'isi yose',
    'Based on recent WHO data': 'Hashingiye ku makuru ya WHO ya vuba aha',
    
    // Pregnancy indicators
    'Antenatal care coverage is around': 'Ubusanzwe bwo kujya kwa muganga mbere yo kubyara buri hagati ya',
    'Skilled birth attendance rate is approximately': 'Ubusanzwe bwo kubyara kwa muganga buri hagati ya',
    'Maternal mortality trends show': 'Ibimenyetso by\'urupfu rw\'ababyeyi birekana',
    
    // Trends
    'and is improving': 'kandi biragenda neza',
    'and is stable': 'kandi biri mumurongo mwiza',
    'and is declining': 'kandi biragenda nabi',
    'and is needs attention': 'kandi bikenewe kwitabwaho',
    
    // Categories
    'improving': 'biragenda neza',
    'stable': 'birahagaze',
    'declining': 'biragenda nabi',
    'needs attention': 'bikenewe kwitabwaho',
    
    // Health outcomes
    'These indicators help track global maternal health progress': 'Ibi bimenyetso bifasha kugenzura iterambere ry\'ubuzima bw\'ababyeyi ku isi yose',
    'These are positive indicators for maternal health outcomes': 'Ibi ni ibimenyetso byiza by\'ubuzima bw\'ababyeyi',
    
    // Emergency care
    'Emergency care access shows': 'Kubona ubufasha bw\'ingenzi birekana',
    'trends globally': 'ibimenyetso ku isi yose',
    'It\'s crucial to have emergency care available during pregnancy': 'Ni ngombwa kuba ufite ubufasha bw\'ingenzi mbere yo kubyara',
    
    // Nutrition
    'Nutrition indicators show': 'Ibimenyetso by\'ibiryo birekana',
    'Proper nutrition during pregnancy is essential for both mother and baby': 'Ibiryo byiza mbere yo kubyara ni ngombwa kuri nyina n\'umwana',
    
    // Mental health
    'Mental health awareness is': 'Kumenya ubuzima bw\'ubwenge ni',
    'It\'s important to address mental health during pregnancy and postpartum': 'Ni ngombwa kugenzura ubuzima bw\'ubwenge mbere yo kubyara n\'nyuma yo kubyara',
    
    // General
    'Recent health data shows': 'Makuru ya vuba y\'ubuzima yerekana',
    'positive trends in maternal care access and outcomes': 'ibimenyetso byiza by\'ubuzima bw\'ababyeyi',
    'This information helps guide health decisions': 'Iyi makuru ifasha gufata ibyemezo by\'ubuzima',
    'Recent WHO data shows': 'Makuru ya vuba ya WHO yerekana',
    'with': 'na',
    'trends': 'ibimenyetso',
    'This information helps guide health decisions': 'Iyi makuru ifasha gufata ibyemezo by\'ubuzima'
  };

  let translatedText = englishText;
  Object.entries(translations).forEach(([eng, kin]) => {
    translatedText = translatedText.replace(new RegExp(eng, 'gi'), kin);
  });

  return translatedText;
}


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
