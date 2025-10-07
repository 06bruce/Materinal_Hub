import React from 'react';
import styled from 'styled-components';
import { Heart, Shield, Globe, Wifi } from 'lucide-react';

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

const ContentSection = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h2 {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  p {
    color: var(--gray-600);
    line-height: 1.6;
    margin-bottom: var(--spacing-3);
  }
`;

const AboutPage = () => {
  return (
    <Container>
      <Header>
        <h1>About Maternal Hub </h1>
        <p>Your trusted pregnancy and postpartum guide — anytime, anywhere, in your language.</p>
      </Header>

      <ContentSection>
        <h2>
          <Heart size={24} />
          Our Mission
        </h2>
        <p>
          We are dedicated to providing accessible, culturally relevant, and medically accurate 
          health information to Rwandan mothers and families. Our goal is to bridge the gap 
          in maternal health education and support, especially in rural areas where access 
          to healthcare information may be limited.
        </p>
      </ContentSection>

      <ContentSection>
        <h2>
          <Shield size={24} />
          Verified Information
        </h2>
        <p>
          All health information provided through our chatbot is evidence-based and reviewed by
          qualified healthcare professionals, aligned with local health standards. We continuously
          improve content quality to ensure accuracy and relevance.
        </p>
      </ContentSection>

      <ContentSection>
        <h2>
          <Globe size={24} />
          Multilingual Support
        </h2>
        <p>
          Our platform supports Kinyarwanda, English, and French to ensure that every mother 
          can access information in her preferred language. We believe that language should 
          never be a barrier to accessing important health information.
        </p>
      </ContentSection>

      <ContentSection>
        <h2>
          <Wifi size={24} />
          Offline Capability
        </h2>
        <p>
          Understanding the challenges of internet connectivity in rural areas, our app 
          includes offline functionality for essential health information and emergency 
          guidance. Your health information is always accessible when you need it most.
        </p>
      </ContentSection>
    </Container>
  );
};

export default AboutPage;
