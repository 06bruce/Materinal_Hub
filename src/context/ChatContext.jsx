import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../utils/api';

const ChatContext = createContext();

const initialState = {
  messages: [],
  isTyping: false,
  language: 'en',
  userProfile: null,
  userId: null, // <-- Added to track Chatbase user
  pregnancyWeek: null,
  isOffline: false,
  emergencyMode: false,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'SET_PREGNANCY_WEEK':
      return { ...state, pregnancyWeek: action.payload };
    case 'SET_OFFLINE_MODE':
      return { ...state, isOffline: action.payload };
    case 'SET_EMERGENCY_MODE':
      return { ...state, emergencyMode: action.payload };
    case 'CLEAR_CHAT':
      return { ...state, messages: [] };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Generate or load persistent userId
  useEffect(() => {
    let savedUserId = localStorage.getItem('chatUserId');
    if (!savedUserId) {
      savedUserId = `guest-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('chatUserId', savedUserId);
    }
    dispatch({ type: 'SET_USER_ID', payload: savedUserId });
  }, []);

  // Load initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content:
        state.language === 'rw'
          ? 'Murakaza neza! Ndi umufasha wawe wo kugenzura ubuzima bwawe nubwa bana bawe. Nshobora kugufasha iki?'
          : 'Welcome! I am your maternal health assistant. How can I help you today?',
      timestamp: new Date(),
      category: 'welcome',
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
    const message = { id: Date.now(), type, content, timestamp: new Date() };
    dispatch({ type: 'ADD_MESSAGE', payload: message });

    if (type === 'user') {
      dispatch({ type: 'SET_TYPING', payload: true });
      try {
        const response = await api.chat.sendMessage({
          message: content,
          language: state.language,
          userId: state.userId,
        });
        const botResponse = response.data;

        setTimeout(() => {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: { ...botResponse, timestamp: new Date() },
          });
          dispatch({ type: 'SET_TYPING', payload: false });
        }, 500 + Math.random() * 1000);
      } catch (error) {
        console.error('❌ Chat API error:', error);
        const content = state.language === 'rw'
          ? 'Ntabwo tubashije kuganira ubu. Ongera ugerageze nyuma ahe gato.'
          : 'Unable to respond right now. Please try again in a moment.';
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { id: Date.now() + 1, type: 'bot', content, timestamp: new Date(), source: 'chat_error' }
        });
        dispatch({ type: 'SET_TYPING', payload: false });
      }
    }
  };

  const setLanguage = (lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang });
  const setPregnancyWeek = (week) => dispatch({ type: 'SET_PREGNANCY_WEEK', payload: week });
  const setEmergencyMode = (mode) => dispatch({ type: 'SET_EMERGENCY_MODE', payload: mode });
  const clearChat = () => dispatch({ type: 'CLEAR_CHAT' });

  return (
    <ChatContext.Provider value={{ ...state, sendMessage, setLanguage, setPregnancyWeek, setEmergencyMode, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
