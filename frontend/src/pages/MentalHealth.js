import React from 'react';
import styled from 'styled-components';
import { Heart, MessageCircle, Phone, BookOpen } from 'lucide-react';

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

const MentalHealth = () => {
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
