import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, handleApiError } from '../utils/api';
import toast from 'react-hot-toast';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [respondedHospital, setRespondedHospital] = useState(null);
  const [alertedHospitals, setAlertedHospitals] = useState([]);

  // Check for active emergency on mount
  useEffect(() => {
    const activeEmergency = localStorage.getItem('activeEmergency');
    if (activeEmergency) {
      try {
        const data = JSON.parse(activeEmergency);
        setEmergencyData(data);
        setEmergencyActive(true);
        setAlertedHospitals(data.hospitalIds || []);
        
        // Check if any hospital has responded
        if (data.respondedHospital) {
          setRespondedHospital(data.respondedHospital);
        }
      } catch (error) {
        console.error('Error loading active emergency:', error);
      }
    }
  }, []);

  const sendEmergencyAlert = async (userData, userLocation) => {
    try {
      // Send emergency alert to backend
      const response = await api.emergency.sendAlert({
        userData: {
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          age: userData.age,
          gender: userData.gender,
        },
        location: userLocation,
        timestamp: new Date().toISOString(),
      });

      const emergencyInfo = {
        id: response.data.emergencyId,
        userData,
        hospitals: response.data.hospitals || [],
        hospitalIds: response.data.alertedHospitals,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      setEmergencyData(emergencyInfo);
      setEmergencyActive(true);
      setAlertedHospitals(response.data.hospitals || []);
      
      // Save to localStorage for persistence
      localStorage.setItem('activeEmergency', JSON.stringify(emergencyInfo));

      toast.success('Emergency alert sent to nearby hospitals!');
      return response.data;
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      toast.error(handleApiError(error));
      throw error;
    }
  };

  const hospitalResponded = (hospital) => {
    setRespondedHospital(hospital);
    
    // Update emergency data
    const updatedEmergency = {
      ...emergencyData,
      respondedHospital: hospital,
      status: 'responded',
    };
    
    setEmergencyData(updatedEmergency);
    localStorage.setItem('activeEmergency', JSON.stringify(updatedEmergency));
    
    toast.success(`${hospital.name} has responded to your emergency!`);
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    setEmergencyData(null);
    setRespondedHospital(null);
    setAlertedHospitals([]);
    localStorage.removeItem('activeEmergency');
    toast.success('Emergency alert cancelled');
  };

  const value = {
    emergencyActive,
    emergencyData,
    respondedHospital,
    alertedHospitals,
    sendEmergencyAlert,
    hospitalResponded,
    cancelEmergency,
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
