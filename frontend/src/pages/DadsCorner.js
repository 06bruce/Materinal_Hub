import React from 'react';
import styled from 'styled-components';
import { Heart, Calendar, BookOpen, MessageCircle } from 'lucide-react';

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

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
`;

const TipCard = styled.div`
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
  }
`;

const DadsCorner = () => {
  const tips = [
    {
      icon: Heart,
      title: "Support Your Partner",
      content: "Be there for your partner emotionally and physically. Listen to her concerns and help with daily tasks."
    },
    {
      icon: Calendar,
      title: "Attend Appointments",
      content: "Go to prenatal appointments together. This shows your commitment and helps you stay informed."
    },
    {
      icon: BookOpen,
      title: "Learn About Pregnancy",
      content: "Read books and articles about pregnancy and childbirth. Knowledge will help you be a better support."
    },
    {
      icon: MessageCircle,
      title: "Communicate Openly",
      content: "Talk about your feelings and concerns. Open communication strengthens your relationship."
    }
  ];

  return (
    <Container>
      <Header>
        <h1>Dad's Corner</h1>
        <p>Tips and support for fathers during pregnancy and beyond</p>
      </Header>

      <TipsGrid>
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <TipCard key={index}>
              <div className="icon">
                <Icon size={32} />
              </div>
              <h3>{tip.title}</h3>
              <p>{tip.content}</p>
            </TipCard>
          );
        })}
      </TipsGrid>
    </Container>
  );
};

export default DadsCorner;
