import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapPin, Phone, Clock, Star, Loader } from 'lucide-react';
import { apiRequest } from '../utils/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthCenters = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/health-centers');
        setCenters(data);
      } catch (err) {
        console.error('Failed to fetch health centers:', err);
        setError('Failed to load health centers. Please try again later.');
        
        // Fallback to static data
        setCenters([
          {
            name: "Kigali Central Hospital",
            location: "Kigali",
            phone: "+250 782 749 660",
            hours: "24/7 Emergency Services",
            rating: 4.5
          },
          {
            name: "King Faisal Hospital",
            location: "Kigali, Kacyiru",
            phone: "3939",
            hours: "Mon-Fri: 8AM-6PM",
            rating: 4.8
          },
          {
            name: "Rwanda Military Hospital",
            location: "Kigali, Kanombe",
            phone: "4060",
            hours: "24/7 Emergency Services",
            rating: 4.3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCenters();
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
      <Header>
        <h1>Health Centers</h1>
        <p>Find nearby health centers and hospitals</p>
      </Header>

      <CentersGrid>
        {centers.map((center, index) => (
          <CenterCard key={index}>
            <h3>{center.name}</h3>
            <div className="info-item">
              <MapPin />
              <span>{center.location}</span>
            </div>
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
    </Container>
  );
};

export default HealthCenters;