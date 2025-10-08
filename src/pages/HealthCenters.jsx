import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapPin, Phone, Clock, Star, Loader, Navigation } from 'lucide-react';
import { api } from '../utils/api';
import SectorSelectionModal from '../components/SectorSelectionModal';
import toast from 'react-hot-toast';

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

const LocationBanner = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
  padding: var(--spacing-4);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-lg);
  
  .location-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    
    svg {
      width: 24px;
      height: 24px;
    }
    
    div {
      h3 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-bottom: var(--spacing-1);
      }
      
      p {
        font-size: var(--font-size-sm);
        opacity: 0.9;
      }
    }
  }
  
  button {
    background: var(--white);
    color: var(--primary);
    border: none;
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: var(--radius-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
`;

const CentersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-6);
`;

const CenterCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-2);
    color: var(--gray-600);
    
    svg {
      color: var(--primary);
      width: 16px;
      height: 16px;
    }
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    margin-top: var(--spacing-3);
    
    .stars {
      display: flex;
      gap: 2px;
    }
  }
`;

const HealthCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSectorModal, setShowSectorModal] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchHealthCentersBySector = async (district, sector) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API with sector parameter
      const response = await api.health.getCentersBySector(district, sector);
      setCenters(response.data.hospitals || []);
      
      if (response.data.hospitals.length === 0) {
        toast.error('No hospitals found in this sector. Showing nearby options.');
      }
    } catch (err) {
      console.error('Failed to fetch health centers:', err);
      setError('Failed to load health centers. Please try again later.');
      toast.error('Failed to load hospitals');
      
      // Fallback to static data
      setCenters([
        {
          name: "Kigali Central Hospital",
          location: "Kigali",
          sector: "Nyarugenge",
          district: "Nyarugenge",
          phone: "+250 782 749 660",
          hours: "24/7 Emergency Services",
          rating: 4.5,
          distance: "2.5 km"
        },
        {
          name: "King Faisal Hospital",
          location: "Kacyiru",
          sector: "Kacyiru",
          district: "Gasabo",
          phone: "3939",
          hours: "Mon-Fri: 8AM-6PM",
          rating: 4.8,
          distance: "3.1 km"
        },
        {
          name: "Rwanda Military Hospital",
          location: "Kanombe",
          sector: "Kanombe",
          district: "Kicukiro",
          phone: "4060",
          hours: "24/7 Emergency Services",
          rating: 4.3,
          distance: "4.2 km"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSector = (location) => {
    setSelectedLocation(location);
    setShowSectorModal(false);
    fetchHealthCentersBySector(location.district, location.sector);
    
    // Save to localStorage for future visits
    localStorage.setItem('userSector', JSON.stringify(location));
  };

  useEffect(() => {
    // Check if user has previously selected a sector
    const savedSector = localStorage.getItem('userSector');
    if (savedSector) {
      const location = JSON.parse(savedSector);
      setSelectedLocation(location);
      setShowSectorModal(false);
      fetchHealthCentersBySector(location.district, location.sector);
    }
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= rating ? "gold" : "none"}
          color={i <= rating ? "gold" : "#ccc"}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <h1>Health Centers</h1>
          <p>Loading health centers...</p>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader size={48} className="animate-spin" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <h1>Health Centers</h1>
          <p style={{ color: 'red' }}>{error}</p>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <SectorSelectionModal
        isOpen={showSectorModal}
        onClose={() => setShowSectorModal(false)}
        onSelectSector={handleSelectSector}
      />

      <Header>
        <h1>Health Centers</h1>
        <p>Find nearby health centers and hospitals</p>
      </Header>

      {selectedLocation && (
        <LocationBanner>
          <div className="location-info">
            <Navigation />
            <div>
              <h3>{selectedLocation.sector} Sector</h3>
              <p>{selectedLocation.district} District</p>
            </div>
          </div>
          <button onClick={() => setShowSectorModal(true)}>
            Change Location
          </button>
        </LocationBanner>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader size={48} className="animate-spin" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>
            Finding hospitals in your area...
          </p>
        </div>
      )}

      {!loading && centers.length > 0 && (
        <CentersGrid>
          {centers.map((center, index) => (
            <CenterCard key={index}>
              <h3>{center.name}</h3>
              <div className="info-item">
                <MapPin />
                <span>{center.location}</span>
              </div>
              {center.distance && (
                <div className="info-item">
                  <Navigation />
                  <span>{center.distance} away</span>
                </div>
              )}
              <div className="info-item">
                <Phone />
                <span>{center.phone}</span>
              </div>
              <div className="info-item">
                <Clock />
                <span>{center.hours}</span>
              </div>
              <div className="rating">
                <span>Rating: </span>
                <div className="stars">
                  {renderStars(center.rating)}
                </div>
                <span>({center.rating})</span>
              </div>
            </CenterCard>
          ))}
        </CentersGrid>
      )}

      {!loading && centers.length === 0 && !showSectorModal && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-600)' }}>
          <p>No hospitals found in your selected area.</p>
          <button 
            onClick={() => setShowSectorModal(true)}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Select Different Location
          </button>
        </div>
      )}
    </Container>
  );
};

export default HealthCenters;