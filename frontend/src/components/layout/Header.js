import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Menu, 
  X, 
  Globe, 
  User, 
  Wifi,
  WifiOff
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useUser } from '../../context/UserContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(248, 243, 246, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  padding: 0 var(--spacing-4);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  text-decoration: none;
  color: var(--primary);
  font-weight: 700;
  font-size: var(--font-size-xl);

  svg {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: 20px; // adjust this value as needed
  }
`;


const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--gray-700);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-lg);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuItem = styled(Link)`
  display: block;
  padding: var(--spacing-3) 0;
  color: var(--gray-700);
  text-decoration: none;
  border-bottom: 1px solid var(--gray-100);
  font-weight: 500;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: var(--primary);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 500;
  
  ${props => props.isOffline ? `
    background: var(--error);
    color: var(--white);
  ` : `
    background: var(--success);
    color: var(--white);
  `}
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, isOffline } = useChat();
  const { user, logout } = useUser();

  const languages = [
    { code: 'rw', name: 'Kiny' },
    { code: 'en', name: 'Eng' },
    { code: 'fr', name: 'Fran' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <Heart />
          <span class='maternal'>Maternal Hub</span>
        </Logo>

        <HeaderActions>
          {/* Online/Offline Status */}
          <StatusIndicator isOffline={isOffline}>
            {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
            {isOffline ? 'Offline' : '' }
          </StatusIndicator>

          {/* Language Switcher */}
          <LanguageButton onClick={() => handleLanguageChange(language === 'rw' ? 'en' : language === 'en' ? 'fr' : 'rw')}>
            <Globe size={16} />
            {currentLanguage?.name}
          </LanguageButton>

          {/* User Menu */}
          {user ? (
            <UserMenuButton as={Link} to="/profile">
              <User size={16} />
              {user.name || 'User'}
            </UserMenuButton>
          ) : (
            <UserMenuButton as={Link} to="/login">
              <User size={16} />
              Login
            </UserMenuButton>
          )}

          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </HeaderActions>
      </HeaderContent>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <MobileMenuItem to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </MobileMenuItem>
          <MobileMenuItem to="/chat" onClick={() => setIsMobileMenuOpen(false)}>
            Chat with Assistant
          </MobileMenuItem>
          <MobileMenuItem to="/pregnancy-tracker" onClick={() => setIsMobileMenuOpen(false)}>
            Pregnancy Tracker
          </MobileMenuItem>
          <MobileMenuItem to="/dads-corner" onClick={() => setIsMobileMenuOpen(false)}>
            Dad's Corner
          </MobileMenuItem>
          <MobileMenuItem to="/health-centers" onClick={() => setIsMobileMenuOpen(false)}>
            Health Centers
          </MobileMenuItem>
          <MobileMenuItem to="/mental-health" onClick={() => setIsMobileMenuOpen(false)}>
            Mental Health
          </MobileMenuItem>
          {user && (
            <>
              <MobileMenuItem to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                Profile
              </MobileMenuItem>
              <MobileMenuItem as="button" onClick={handleLogout}>
                Logout
              </MobileMenuItem>
            </>
          )}
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;
