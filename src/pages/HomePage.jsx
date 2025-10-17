import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  MapPin, 
  Brain, 
  ArrowRight,
  Shield
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import EmergencyButton from '../components/EmergencyButton';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  color: var(--white);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-20) 0 var(--spacing-16);
  overflow: hidden;

  /* Background Image */
  background: url('https://media.istockphoto.com/id/2158853819/photo/happy-family-embracing-in-nature.jpg?s=612x612&w=0&k=20&c=EHRo4237ZBdKJwCzFm3r90OUriXNMTvtwZGZh1-2RIs=') center/cover repeat;

  /* Dark overlay for better text readability */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: var(--spacing-12) 0 var(--spacing-8);
  } 
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  position: relative;
  z-index: 2; /* ensures text is above overlay */
`;


const HeroTitle = styled(motion.h1)`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-6);
  line-height: 1.2;
  color: var(--white);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-3xl);
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-8);
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: var(--white);
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4) var(--spacing-8);
  border-radius: var(--radius-xl);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-normal);
  font-size: var(--font-size-lg);
  
  &.primary {
    background: var(--white);
    color: var(--primary);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--white);
    border: 2px solid var(--white);
    
    &:hover {
      background: var(--white);
      color: var(--primary);
    }
  }
`;

const FeaturesSection = styled.section`
  padding: var(--spacing-16) 0;
  background: var(--white);
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-4);
  color: var(--gray-900);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-8);
  margin-top: var(--spacing-12);
`;

const FeatureCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  transition: all var(--transition-normal);
  text-align: center;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
  
  .icon {
    width: 64px;
    height: 64px;
    margin: 0 auto var(--spacing-6);
    background: var(--primary-light);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-4);
    color: var(--gray-900);
  }
  
  p {
    color: var(--gray-600);
    line-height: 1.6;
    margin-bottom: var(--spacing-6);
  }
  
  .feature-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
  }
`;

const HomePage = () => {
  const { language } = useChat();
  const { isAuthenticated } = useUser();

  const content = {
    rw: {
      title: "Turagufasha Kugenzura ubuzima bwawe n'ubwa bana bawe",
      subtitle: "Fungura konti kugira ngo ubone serivisi zuzuye z'ubuzima bwawe — buri gihe, aho aho, mu rurimi rwawe.",
      startChat: "Injira/Iyandikishe",
      startChatAuth: "Tangira kuvugana",
      learnMore: "Menya byinshi",
      features: [
        {
          icon: MessageCircle,
          title: "Chatbot ya Kinyarwanda",
          description: "Vugana na chatbot yawe mu Kinyarwanda kugira ngo ubone amakuru y'ubuzima.",
          link: "/chat",
          linkText: "Tangira chat"
        },
        {
          icon: Calendar,
          title: "Kugenzura ubuzima",
          description: "Reba uko ubuzima bwawe n'ubw'abana bawe bukomeje buri munsi.",
          link: "/pregnancy-tracker",
          linkText: "Reba tracker"
        },
        { 
          icon: Users,
          title: "Icyicaro cy'Abagabo",
          description: "Amakuru n'ubufasha ku basore bashaka gufasha abagore babo.",
          link: "/dads-corner",
          linkText: "Menya byinshi"
        },
        {
          icon: MapPin,
          title: "Gusanga Ibitaro",
          description: "Menya aho ibitaro biherereye hafi yawe kandi ubone amakuru yabyo.",
          link: "/health-centers",
          linkText: "Reba ibitaro"
        },
        {
          icon: Brain,
          title: "Ubuzima bw'ubwenge",
          description: "Ubufasha n'amakuru ku buzima bw'ubwenge mu gihe cyo gutwita n'inyuma.",
          link: "/mental-health",
          linkText: "Menya byinshi"
        },
        {
          icon: Shield,
          title: "Amakuru yizewe",
          description: "Amakuru yose ashingiye ku bimenyetso kandi yagenzuwe n'inzobere n'inzego z'ubuzima.",
          link: "/about",
          linkText: "Menya byinshi"
        }
      ]
    },
    en: {
      title: "Your trusted pregnancy and postpartum guide",
      subtitle: "Create an account to access full health services — anytime, anywhere, in your language.",
      startChat: "Login/Sign Up",
      startChatAuth: "Start Chatting",
      learnMore: "Learn More",
      features: [
        {
          icon: MessageCircle,
          title: "Kinyarwanda Chatbot",
          description: "Chat with your assistant in Kinyarwanda to get health information.",
          link: "/chat",
          linkText: "Start Chat"
        },
        {
          icon: Calendar,
          title: "Pregnancy Tracker",
          description: "Monitor your pregnancy and baby's health day by day.",
          link: "/pregnancy-tracker",
          linkText: "View Tracker"
        },
        {
          icon: Users,
          title: "Dad's Corner",
          description: "Information and support for fathers wanting to help their partners.",
          link: "/dads-corner",
          linkText: "Learn More"
        },
        {
          icon: MapPin,
          title: "Find Health Centers",
          description: "Find nearby health centers and get their information.",
          link: "/health-centers",
          linkText: "View Centers"
        },
        {
          icon: Brain,
          title: "Mental Health",
          description: "Support and information for mental health during and after pregnancy.",
          link: "/mental-health",
          linkText: "Learn More"
        },
        {
          icon: Shield,
          title: "Verified Information",
          description: "All information is evidence-based and reviewed by trusted health professionals and authorities.",
          link: "/about",
          linkText: "Learn More"
        }
      ]
    }
  };

  const currentContent = content[language] || content.en;

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {currentContent.title}
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {currentContent.subtitle}
          </HeroSubtitle>
          
          <HeroButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {isAuthenticated && <EmergencyButton />}
            <HeroButton to={isAuthenticated ? "/chat" : "/login"} className="primary">
              <MessageCircle size={20} />
              {isAuthenticated ? currentContent.startChatAuth : currentContent.startChat}
            </HeroButton>
            <HeroButton to="/about" className="secondary">
              <ArrowRight size={20} />
              {currentContent.learnMore}
            </HeroButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {language === 'rw' ? 'Ibikorwa byacu' : 'Our Features'}
          </SectionTitle>

          <FeaturesGrid>
            {currentContent.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FeatureCard
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="icon">
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link to={feature.link} className="feature-link">
                    {feature.linkText}
                    <ArrowRight size={16} />
                  </Link>
                </FeatureCard>
              );
            })}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default HomePage;
