import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  MessageCircle, 
  Calendar, 
  Users, 
  MapPin, 
  Brain
} from 'lucide-react';
import { useChat } from '../../context/ChatContext'; // ✅ same context as Header

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(254, 253, 254, 0.31);
  height: 60px;
  width: 100%
  border-top: 1px solid var(--gray-200);
  border-radius: 20px 20px 20px 20px;
  padding: var(--spacing-3) var(--spacing-5);
  box-shadow: 0 -6px 12px rgba(255, 255, 255, 0.47);
  backdrop-filter: blur(45%);
  transition: all 0.3s ease-in-out;
  margin-bottom: 10px;
  
  @media (min-width: 769px) {
    display: block;
    border-radius: 10px 10px ;
    } 
`;

const NavigationList = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0 var(--spacing-4);
`;

const NavigationItem = styled.li`
  flex: 1;
  text-align: center;
`;

const NavigationLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);
  padding: 5;
  color: ${props => props.active ? 'var(--primary)' : 'var(--white-600)'};
  text-decoration: none;
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: all var(--transition-normal);
  border-radius: var(--radius-lg);
  
  &:hover {
    color: black;
    background: var(--primary-light);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  @media(max-width:720px){
   
  }  
`;

const Navigation = () => {
  const location = useLocation();
  const { language } = useChat(); // ✅ now reading from context, not local state

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: { en: 'Home' },
      exact: true
    },
    {
      path: '/chat',
      icon: MessageCircle,
      label: { en: 'Chat'}
    },
    {
      path: '/pregnancy-tracker',
      icon: Calendar,
      label: { en: 'Tracker' }
    },
    {
      path: '/dads-corner',
      icon: Users,
      label: { en: 'Dads' }
    },
    {
      path: '/health-centers',
      icon: MapPin,
      label: { en: 'Centers' }
    },
    {
      path: '/mental-health',
      icon: Brain,
      label: { en: 'Mental' }
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <NavigationContainer>
      <NavigationList>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <NavigationItem key={item.path}>
              <NavigationLink to={item.path} active={active}>
                <Icon />
                <span>{item.label[language] || item.label.en}</span>
              </NavigationLink>
            </NavigationItem>
          );
        })}
      </NavigationList>
    </NavigationContainer>
  );
};

export default Navigation;
