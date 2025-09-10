import React from 'react';
import styled from 'styled-components';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const FooterContainer = styled.footer`
  background: var(--gray-900);
  color: var(--white);
  padding: var(--spacing-12) 0 var(--spacing-8);
  margin-top: auto;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    padding: var(--spacing-8) 0 var(--spacing-6);
    margin-bottom: 80px; // Account for bottom navigation
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-8);
`;

const FooterSection = styled.div`
  h3 {
    color: var(--primary);
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-4);
  }
  
  p {
    color: var(--gray-300);
    line-height: 1.6;
    margin-bottom: var(--spacing-3);
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: var(--spacing-2);
  }
  
  a {
    color: var(--gray-300);
    text-decoration: none;
    transition: color var(--transition-normal);
    
    &:hover {
      color: var(--primary);
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
  color: var(--gray-300);
  
  svg {
    color: var(--primary);
    width: 16px;
    height: 16px;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--gray-700);
  padding-top: var(--spacing-6);
  text-align: center;
  color: var(--gray-400);
  font-size: var(--font-size-sm);
  
  .heart {
    color: var(--primary);
    display: inline-block;
    margin: 0 var(--spacing-1);
  }
`;

const EmergencyBanner = styled.div`
  background: linear-gradient(135deg, var(--error) 0%, #d32f2f 100%);
  color: var(--white);
  padding: var(--spacing-4);
  text-align: center;
  margin-bottom: var(--spacing-8);
  border-radius: var(--radius-lg);
  
  h4 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-2);
  }
  
  p {
    margin-bottom: var(--spacing-3);
  }
  
  .emergency-number {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--white);
    text-decoration: none;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* Emergency Banner */}
        <EmergencyBanner>
          <h4>🚨 Emergency Contact</h4>
          <p>If you're experiencing a medical emergency, call immediately:</p>
          <a href="112" className="emergency-number">
            114
          </a>
        </EmergencyBanner>

        <FooterGrid>
          <FooterSection>
            <h3>About Maternal Health</h3>
            <p>
              Your trusted pregnancy and postpartum guide — anytime, anywhere, 
              in your language. We provide culturally relevant health information 
              for Rwandan mothers and families.
            </p>
          </FooterSection>

          <FooterSection>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/chat">Chat with Assistant</a></li>
              <li><a href="/pregnancy-tracker">Pregnancy Tracker</a></li>
              <li><a href="/dads-corner">Dad's Corner</a></li>
              <li><a href="/health-centers">Find Health Centers</a></li>
              <li><a href="/mental-health">Mental Health Support</a></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Contact Information</h3>
            <ContactItem>
              <Phone />
              <span>116</span>
            </ContactItem>
            <ContactItem>
              <Mail />
              <span>support@maternalhealth.rw</span>
            </ContactItem>
            <ContactItem>
              <MapPin />
              <span>Kigali, Rwanda</span>
            </ContactItem>
          </FooterSection>

          <FooterSection>
            <h3>Resources</h3>
            <ul>
              <li><a href="/">About Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <p>
            © 2025 Maternal Health Chatbot. Made with 
            <Heart className="heart" size={16} /> 
            for Rwandan mothers and families.
          </p>
          <p>
            This application provides health information but is not a substitute 
            for professional medical advice. Always consult with healthcare providers.
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
