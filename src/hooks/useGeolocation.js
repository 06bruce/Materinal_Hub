import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loaded: true,
        error: {
          code: 0,
          message: 'Geolocation not supported'
        }
      }));
      return;
    }

    const success = (position) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        error: null
      });
    };

    const error = (err) => {
      setLocation(prev => ({
        ...prev,
        loaded: true,
        error: {
          code: err.code,
          message: err.message
        }
      }));
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }, []);

  return location;
}
