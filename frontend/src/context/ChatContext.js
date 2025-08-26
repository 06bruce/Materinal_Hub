import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiRequest, getApiUrl } from '../config/api';

const ChatContext = createContext();

const initialState = {
  messages: [],
  isTyping: false,
  language: 'rw', // Default to Kinyarwanda
  userProfile: null,
  pregnancyWeek: null,
  isOffline: false,
  emergencyMode: false,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload,
      };
    
    case 'SET_PREGNANCY_WEEK':
      return {
        ...state,
        pregnancyWeek: action.payload,
      };
    
    case 'SET_OFFLINE_MODE':
      return {
        ...state,
        isOffline: action.payload,
      };
    
    case 'SET_EMERGENCY_MODE':
      return {
        ...state,
        emergencyMode: action.payload,
      };
    
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
      };
    
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: state.language === 'rw' 
        ? 'Murakaza neza! Ndi umufasha wawe wo kugenzura ubuzima bwawe nubwa bana bawe. Nshobora kugufasha iki?'
        : 'Welcome! I am your maternal health assistant. How can I help you today?',
      timestamp: new Date(),
      category: 'welcome'
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: welcomeMessage });
  }, [state.language]);

  // Check online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      dispatch({ type: 'SET_OFFLINE_MODE', payload: !navigator.onLine });
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const sendMessage = async (content, type = 'user') => {
    const message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: message });

    if (type === 'user') {
      dispatch({ type: 'SET_TYPING', payload: true });
      
      try {
        console.log(`📤 Sending message to backend: "${content}"`);
        
        // Call real backend API using apiRequest helper
        const botResponse = await apiRequest('/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: content,
            language: state.language
          })
        });
        
        console.log(`📥 Received response:`, botResponse);
        
        // Add a small delay for realistic feel
        setTimeout(() => {
          dispatch({ type: 'ADD_MESSAGE', payload: {
            ...botResponse,
            timestamp: new Date()
          }});
          dispatch({ type: 'SET_TYPING', payload: false });
        }, 500 + Math.random() * 1000);
        
      } catch (error) {
        console.error('❌ Chat API error:', error);
        
        // Fallback to local response if API fails
        const fallbackResponse = await simulateBotResponse(content, state.language);
        
        setTimeout(() => {
          dispatch({ type: 'ADD_MESSAGE', payload: fallbackResponse });
        dispatch({ type: 'SET_TYPING', payload: false });
        }, 500);
      }
    }
  };

  const simulateBotResponse = async (userMessage, language) => {
    // This is a mock response system - replace with actual AI/backend integration
    const responses = {
      rw: {
        'pregnancy': 'Ubusanzwe ubuzima bwawe ni bwiza. Reba ko ufata vitamini zawe buri munsi kandi ujya kwa muganga.',
        'emergency': 'Ibi ni ibibazo by\'ingenzi! Ijya kwa muganga vuba cyane cyane niba ufite amaraso cyangwa ububabare.',
        'nutrition': 'Fata ibiryo byuzuye amatungo, imboga, n\'imbuto. Reba ko unywa amazi menshi.',
        'default': 'Nshobora kugufasha kugenzura ubuzima bwawe. Vuga ibibazo byawe cyangwa ibyo ushaka kumenya.'
      },
      en: {
        'pregnancy': 'Your pregnancy is going well. Make sure to take your vitamins daily and attend regular checkups.',
        'emergency': 'These are emergency symptoms! Go to the hospital immediately, especially if you have bleeding or severe pain.',
        'nutrition': 'Eat a balanced diet with proteins, vegetables, and fruits. Make sure to drink plenty of water.',
        'default': 'I can help you monitor your health. Tell me your concerns or what you want to know.'
      }
    };

    const message = userMessage.toLowerCase();
    let category = 'default';

    if (message.includes('pregnancy') || message.includes('ubuzima') || message.includes('ubw\'abana')) {
      category = 'pregnancy';
    } else if (message.includes('emergency') || message.includes('ingenzi') || message.includes('amaraso')) {
      category = 'emergency';
    } else if (message.includes('nutrition') || message.includes('ibiryo') || message.includes('food')) {
      category = 'nutrition';
    }

    return {
      id: Date.now() + 1,
      type: 'bot',
      content: responses[language][category],
      timestamp: new Date(),
      category
    };
  };

  const setLanguage = (lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  const setPregnancyWeek = (week) => {
    dispatch({ type: 'SET_PREGNANCY_WEEK', payload: week });
  };

  const setEmergencyMode = (mode) => {
    dispatch({ type: 'SET_EMERGENCY_MODE', payload: mode });
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  const value = {
    ...state,
    sendMessage,
    setLanguage,
    setPregnancyWeek,
    setEmergencyMode,
    clearChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
