import React from 'react';
import styled from 'styled-components';
import { FileText, Shield, HelpCircle, Mail } from 'lucide-react';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: var(--primary-light);
    border-radius: 50%;
    margin-bottom: var(--spacing-4);
    color: var(--primary);
  }
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--gray-600);
  }
`;

const Content = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h2 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
  
  p {
    color: var(--gray-700);
    line-height: 1.6;
    margin-bottom: var(--spacing-4);
  }
  
  ul {
    list-style: disc;
    padding-left: var(--spacing-6);
    margin-bottom: var(--spacing-4);
    
    li {
      color: var(--gray-700);
      margin-bottom: var(--spacing-2);
    }
  }
`;

const InfoPage = ({ type = 'terms' }) => {
  const getIcon = () => {
    switch (type) {
      case 'terms':
        return <FileText size={40} />;
      case 'privacy':
        return <Shield size={40} />;
      case 'faq':
        return <HelpCircle size={40} />;
      case 'support':
        return <Mail size={40} />;
      default:
        return <FileText size={40} />;
    }
  };

  const getContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: 'Terms & Conditions',
          subtitle: 'Please read these terms carefully',
          sections: [
            {
              heading: 'Acceptance of Terms',
              content: 'By accessing and using the Maternal Health Hub, you accept and agree to be bound by these terms and conditions.'
            },
            {
              heading: 'Use of Service',
              content: 'This service is provided for informational purposes only. Always consult with qualified healthcare professionals for medical advice.'
            },
            {
              heading: 'User Responsibilities',
              content: 'You are responsible for maintaining the confidentiality of your account and for all activities under your account.'
            }
          ]
        };
      
      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Your privacy is important to us',
          sections: [
            {
              heading: 'Information We Collect',
              content: 'We collect information you provide directly, including your name, email, and pregnancy-related data you choose to share.'
            },
            {
              heading: 'How We Use Your Information',
              content: 'Your information is used to provide personalized maternal health guidance and improve our services.'
            },
            {
              heading: 'Data Security',
              content: 'We implement appropriate security measures to protect your personal information from unauthorized access.'
            }
          ]
        };
      
      case 'faq':
        return {
          title: 'Frequently Asked Questions',
          subtitle: 'Find answers to common questions',
          sections: [
            {
              heading: 'What is Maternal Health Hub?',
              content: 'Maternal Health Hub is a comprehensive platform providing health guidance and support for pregnant women in Rwanda.'
            },
            {
              heading: 'Is this service free?',
              content: 'Yes, our basic services are completely free to use. We believe maternal health information should be accessible to everyone.'
            },
            {
              heading: 'Can I use this in my language?',
              content: 'Yes! We support Kinyarwanda, English, and French to serve the Rwandan community.'
            },
            {
              heading: 'Is the chatbot a replacement for a doctor?',
              content: 'No. Our chatbot provides general information and guidance, but you should always consult with qualified healthcare professionals for medical advice.'
            }
          ]
        };
      
      case 'support':
        return {
          title: 'Support & Contact',
          subtitle: 'We\'re here to help',
          sections: [
            {
              heading: 'Get Help',
              content: 'If you need assistance or have questions about using Maternal Health Hub, we\'re here to help.'
            },
            {
              heading: 'Emergency Support',
              content: 'For medical emergencies, please call 912 or visit your nearest health center immediately.'
            },
            {
              heading: 'Technical Support',
              content: 'For technical issues or feedback, please reach out through our contact form or email us.'
            }
          ]
        };
      
      default:
        return {
          title: 'Information',
          subtitle: 'Welcome',
          sections: []
        };
    }
  };

  const content = getContent();

  return (
    <Container>
      <Header>
        <div className="icon">{getIcon()}</div>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </Header>

      <Content>
        {content.sections.map((section, index) => (
          <div key={index}>
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </Content>
    </Container>
  );
};

export default InfoPage;
