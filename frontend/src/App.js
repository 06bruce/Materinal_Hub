import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navigation from './components/layout/Navigation';

// Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import PregnancyTracker from './pages/PregnancyTracker';
import DadsCorner from './pages/DadsCorner';
import HealthCenters from './pages/HealthCenters';
import MentalHealth from './pages/MentalHealth';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SupportPage from './pages/SupportPage';
import FAQPage from './pages/FAQPage';

// Context
import { ChatProvider } from './context/ChatContext';
import { UserProvider } from './context/UserContext';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-light) 100%);
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; // Account for fixed header
`;

function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <AppContainer>
          <Helmet>
            <title>Maternal Hub Chatbot - Kinyarwanda Guide</title>
            <meta name="description" content="Your trusted pregnancy and postpartum guide — anytime, anywhere, in your language." />
            <meta name="keywords" content="maternal health, pregnancy, postpartum, Rwanda, Kinyarwanda, chatbot, health guide" />
            <meta property="og:title" content="Maternal Hub" />
            <meta property="og:description" content="Your trusted pregnancy and postpartum guide — anytime, anywhere, in your language." />
            <meta property="og:type" content="website" />
          </Helmet>
          
          <Header />
          <Navigation />
          
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/pregnancy-tracker" element={<PregnancyTracker />} />
              <Route path="/dads-corner" element={<DadsCorner />} />
              <Route path="/health-centers" element={<HealthCenters />} />
              <Route path="/mental-health" element={<MentalHealth />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/term & conditions" element={<TermsPage />} />
              <Route path="/faq" element={<FAQPage/>} />
              <Route path="privacy" element={<PrivacyPage/>} />
              <Route path="support" element={<SupportPage/>} />
            </Routes>
          </MainContent>
          
          <Footer />
        </AppContainer>
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
