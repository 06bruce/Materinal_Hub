import React, { useState } from 'react';
import styled from 'styled-components';
import { Heart, MessageCircle, Phone, BookOpen, AlertTriangle, MapPin, Loader, Calendar } from 'lucide-react';
import useGeolocation from '../hooks/useGeolocation';
import toast from 'react-hot-toast';
import AppointmentModal from '../components/AppointmentModal';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-4);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--gray-600);
  }
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
`;

const ResourceCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  .icon {
    width: 64px;
    height: 64px;
    margin-bottom: var(--spacing-4);
    background: var(--primary-light);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
  }
  
  p {
    color: var(--gray-600);
    line-height: 1.6;
    margin-bottom: var(--spacing-4);
  }
  
  .contact {
    font-weight: 500;
    color: var(--primary);
  }
`;

const EmergencySection = styled.div`
  background: var(--red-50);
  border: 1px solid var(--red-200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
  transition: all var(--transition-slow);
  
  h2 {
    color: var(--red-700);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
    
    svg {
      animation: pulse 2s infinite;
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .emergency-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-4);
  }
  
  .emergency-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: var(--spacing-4);
    box-shadow: var(--shadow-sm);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-normal);
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    &:active {
      transform: scale(0.98);
    }
    
    &.primary {
      background: var(--red-500);
      color: var(--white);
      animation: gentlePulse 3s infinite;
    }
    
    @keyframes gentlePulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    
    .icon {
      width: 48px;
      height: 48px;
      margin: 0 auto var(--spacing-3);
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 24px;
        height: 24px;
      }
    }
    
    h3 {
      font-size: var(--font-size-lg);
      margin-bottom: var(--spacing-2);
    }
    
    p {
      font-size: var(--font-size-sm);
      opacity: 0.9;
    }
  }
  
  .location-status {
    margin-top: var(--spacing-4);
    font-size: var(--font-size-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    
    &.loading {
      color: var(--blue-600);
    }
    
    &.error {
      color: var(--red-600);
    }
    
    &.success {
      color: var(--green-600);
    }
  }
`;

const MentalHealth = () => {
  const location = useGeolocation();
  const [nearestHospitals, setNearestHospitals] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  
  // Mock function - replace with actual API call
  const findNearestHospitals = () => {
    if (location.loaded && location.coordinates.lat) {
      toast.success('Located nearest hospitals');
      setNearestHospitals([
        {
          id: 1,
          name: "Kigali Central Hospital",
          distance: "2.5 km",
          phone: "114",
          emergency: true
        },
        {
          id: 2,
          name: "King Faisal Hospital",
          distance: "3.1 km",
          phone: "3939",
          emergency: true
        }
      ]);
    } else {
      toast.error('Could not determine location');
    }
  };

  const handleBookAppointment = (hospital) => {
    setSelectedHospital(hospital);
    setShowAppointmentModal(true);
  };

  const resources = [
    {
      icon: MessageCircle,
      title: "Talk to Someone",
      content: "Don't hesitate to reach out to friends, family, or healthcare providers. Talking about your feelings is important.",
      contact: "Available 24/7"
    },
    {
      icon: Phone,
      title: "Crisis Hotline",
      content: "If you're experiencing a mental health crisis, call the emergency hotline immediately.",
      contact: "114"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      content: "Learn about postpartum depression, anxiety, and other mental health topics related to pregnancy.",
      contact: "Free resources available"
    },
    {
      icon: Heart,
      title: "Self-Care Tips",
      content: "Practice self-care through exercise, meditation, proper sleep, and healthy eating habits.",
      contact: "Daily reminders available",
    }
  ];

  return (
    <Container>
      <Header>
        <h1>Mental Health Support</h1>
        <p>Resources and support for your mental well-being during and after pregnancy</p>
      </Header>

      <EmergencySection>
        <h2><AlertTriangle /> Emergency Help</h2>
        {location.loaded ? (
          location.error ? (
            <div className="location-status error">
              <AlertTriangle size={16} />
              {location.error.message}
            </div>
          ) : (
            <div className="location-status success">
              <MapPin size={16} />
              Location ready
            </div>
          )
        ) : (
          <div className="location-status loading">
            <Loader size={16} className="animate-spin" />
            Checking location...
          </div>
        )}
        <div className="emergency-grid">
          <div 
            className="emergency-card primary"
            onClick={() => window.location.href = 'tel:114'}
          >
            <div className="icon"><Phone /></div>
            <h3>Call Emergency</h3>
            <p>Direct hotline to mental health emergency services</p>
          </div>
          
          <div 
            className="emergency-card"
            onClick={findNearestHospitals}
          >
            <div className="icon"><MapPin /></div>
            <h3>Find Hospitals</h3>
            <p>Locate nearest emergency mental health facilities</p>
          </div>
        </div>
        
        {nearestHospitals.length > 0 && (
          <div style={{ marginTop: 'var(--spacing-6)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-3)' }}>Nearest Emergency Hospitals:</h3>
            <ResourcesGrid>
              {nearestHospitals.map((hospital, index) => (
                <ResourceCard key={`hospital-${index}`}>
                  <div className="icon"><MapPin /></div>
                  <h3>{hospital.name}</h3>
                  <p>{hospital.distance} away</p>
                  <div className="contact">{hospital.phone}</div>
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--spacing-2)',
                    marginTop: 'var(--spacing-3)'
                  }}>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.name}`)}
                      style={{
                        padding: 'var(--spacing-2)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-1)'
                      }}
                    >
                      <MapPin size={16} /> Directions
                    </button>
                    
                    <button 
                      onClick={() => window.location.href = `tel:${hospital.phone}`}
                      style={{
                        padding: 'var(--spacing-2)',
                        background: 'var(--red-100)',
                        color: 'var(--red-600)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-1)'
                      }}
                    >
                      <Phone size={16} /> Call
                    </button>
                    
                    <button 
                      onClick={() => handleBookAppointment(hospital)}
                      style={{
                        padding: 'var(--spacing-2)',
                        background: 'var(--green-100)',
                        color: 'var(--green-600)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-1)'
                      }}
                    >
                      <Calendar size={16} /> Book
                    </button>
                  </div>
                </ResourceCard>
              ))}
            </ResourcesGrid>
          </div>
        )}
      </EmergencySection>

      {showAppointmentModal && selectedHospital && (
        <AppointmentModal 
          centerId={selectedHospital.id} 
          centerName={selectedHospital.name}
          onClose={() => setShowAppointmentModal(false)}
          onSuccess={() => toast.success('Appointment booked!')}
        />
      )}

      <ResourcesGrid>
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <ResourceCard key={index}>
              <div className="icon">
                <Icon size={32} />
              </div>
              <h3>{resource.title}</h3>
              <p>{resource.content}</p>
              <div className="contact">{resource.contact}</div>
            </ResourceCard>
          );
        })}
      </ResourcesGrid>
    </Container>
  );
};

export default MentalHealth;
