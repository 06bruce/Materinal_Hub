import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled, { ThemeProvider } from 'styled-components';

// Theme & Styles
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navigation from './components/layout/Navigation';
import ErrorBoundary from './components/ErrorBoundary';

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

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserEdit from './pages/AdminUserEdit';
import AdminPregnancy from './pages/AdminPregnancy';
import AdminRegister from './pages/AdminRegister';
import AdminLayout from './components/layout/AdminLayout';
import AdminRoute from './components/AdminRoute';

//Vercel Insight
import { SpeedInsights } from "@vercel/speed-insights/react"

// Context
import { ChatProvider } from './context/ChatContext';
import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.gradient};
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 70px;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ErrorBoundary>
        <AdminProvider>
          <UserProvider>
            <ChatProvider>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="users/:id/edit" element={<AdminUserEdit />} />
                        <Route path="pregnancy" element={<AdminPregnancy />} />
                        <Route path="register" element={<AdminRegister />} />
                      </Routes>
                    </AdminLayout>
                  </AdminRoute>
                } />

                {/* User Routes */}
                <Route path="/*" element={
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
                      <ErrorBoundary>
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
                          <Route path="/terms" element={<TermsPage />} />
                          <Route path="/faq" element={<FAQPage/>} />
                          <Route path="/privacy" element={<PrivacyPage/>} />
                          <Route path="/support" element={<SupportPage/>} />
                        </Routes>
                      </ErrorBoundary>
                    </MainContent>
                    
                    <Footer />
                  </AppContainer>
                } />
              </Routes>
            </ChatProvider>
          </UserProvider>
        </AdminProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
