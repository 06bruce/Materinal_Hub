import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  preferences: {
    language: 'rw',
    notifications: true,
    emergencyContacts: [],
    pregnancyStartDate: null,
    dueDate: null,
    currentWeek: null,
  },
  profile: {
    name: '',
    age: null,
    location: '',
    phoneNumber: '',
    emergencyContact: '',
    isPregnant: false,
    isPostpartum: false,
    hasChildren: false,
    numberOfChildren: 0,
  }
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    
    case 'SET_PREGNANCY_DATES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          pregnancyStartDate: action.payload.startDate,
          dueDate: action.payload.dueDate,
          currentWeek: action.payload.currentWeek,
        },
      };
    
    case 'ADD_EMERGENCY_CONTACT':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          emergencyContacts: [...state.preferences.emergencyContacts, action.payload],
        },
      };
    
    case 'REMOVE_EMERGENCY_CONTACT':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          emergencyContacts: state.preferences.emergencyContacts.filter(
            contact => contact.id !== action.payload
          ),
        },
      };
    
    case 'LOGOUT':
      return initialState;
    
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('maternalHealthUser');
    const savedPreferences = localStorage.getItem('maternalHealthPreferences');
    // const authToken = localStorage.getItem('authToken');
    
    // Set axios default header if token exists
    // if (authToken) {
    //   const axios = require('axios');
    //   axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    // }
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: userData });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('maternalHealthUser', JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('maternalHealthPreferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  const login = (userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

  const logout = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const axios = require('axios');
        await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('maternalHealthUser');
      localStorage.removeItem('maternalHealthPreferences');
      localStorage.removeItem('authToken');
      
      // Remove axios default header
      const axios = require('axios');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      const axios = require('axios');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      if (response.data.success) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  const setPregnancyDates = (startDate, dueDate) => {
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const today = new Date();
    
    // Calculate current week
    const weeksDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24 * 7));
    const currentWeek = Math.max(0, Math.min(40, weeksDiff));
    
    dispatch({
      type: 'SET_PREGNANCY_DATES',
      payload: { startDate, dueDate, currentWeek },
    });
  };

  const addEmergencyContact = (contact) => {
    const newContact = {
      id: Date.now(),
      ...contact,
    };
    dispatch({ type: 'ADD_EMERGENCY_CONTACT', payload: newContact });
  };

  const removeEmergencyContact = (contactId) => {
    dispatch({ type: 'REMOVE_EMERGENCY_CONTACT', payload: contactId });
  };

  const calculatePregnancyWeek = () => {
    if (!state.preferences.pregnancyStartDate) return null;
    
    const start = new Date(state.preferences.pregnancyStartDate);
    const today = new Date();
    const weeksDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24 * 7));
    return Math.max(0, Math.min(40, weeksDiff));
  };

  const getDaysUntilDue = () => {
    if (!state.preferences.dueDate) return null;
    
    const today = new Date();
    const diffTime = new Date(state.preferences.dueDate) - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    updatePreferences,
    setPregnancyDates,
    addEmergencyContact,
    removeEmergencyContact,
    calculatePregnancyWeek,
    getDaysUntilDue,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
