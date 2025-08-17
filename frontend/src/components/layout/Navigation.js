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

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--white);
  border-top: 1px solid var(--gray-200);
  padding: var(--spacing-2) 0;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 769px) {
    display: none;
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
  padding: var(--spacing-2);
  color: ${props => props.active ? 'var(--primary)' : 'var(--gray-600)'};
  text-decoration: none;
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: all var(--transition-normal);
  border-radius: var(--radius-lg);
  
  &:hover {
    color: var(--primary);
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

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      exact: true
    },
    {
      path: '/chat',
      icon: MessageCircle,
      label: 'Chat'
    },
    {
      path: '/pregnancy-tracker',
      icon: Calendar,
      label: 'Tracker'
    },
    {
      path: '/dads-corner',
      icon: Users,
      label: 'Dads'
    },
    {
      path: '/health-centers',
      icon: MapPin,
      label: 'Centers'
    },
    {
      path: '/mental-health',
      icon: Brain,
      label: 'Mental'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <NavigationContainer className='text-'>
      <NavigationList>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          
          return (
            <NavigationItem key={item.path}>
              <NavigationLink to={item.path} active={active}>
                <Icon />
                <span>{item.label}</span>
              </NavigationLink>
            </NavigationItem>
          );
        })}
      </NavigationList>
    </NavigationContainer>
  );
};

export default Navigation;
