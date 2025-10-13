import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Header = styled.div`
  margin-bottom: var(--spacing-6);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    color: var(--gray-600);
    font-size: var(--font-size-lg);
  }
`;

const SettingsCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-4);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  
  svg {
    color: var(--primary);
  }
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-4);
  
  label {
    display: block;
    font-weight: 500;
    color: var(--gray-700);
    margin-bottom: var(--spacing-2);
    font-size: var(--font-size-sm);
  }
  
  input {
    width: 100%;
    padding: var(--spacing-3);
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    &:disabled {
      background: var(--gray-100);
      cursor: not-allowed;
    }
  }
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
`;

const Button = styled.button`
  padding: var(--spacing-3) var(--spacing-5);
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--primary-dark);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: var(--gray-50);
  }
  
  .label {
    display: flex;
    flex-direction: column;
    
    .title {
      font-weight: 500;
      color: var(--gray-900);
      margin-bottom: var(--spacing-1);
    }
    
    .description {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }
  }
  
  input[type="checkbox"] {
    position: relative;
    width: 48px;
    height: 24px;
    appearance: none;
    background: var(--gray-300);
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s;
    
    &:checked {
      background: var(--primary);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s;
    }
    
    &:checked::after {
      transform: translateX(24px);
    }
  }
`;

const AdminSettings = () => {
  const { admin } = useAdmin();
  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newUserAlerts: true,
    appointmentAlerts: true,
    systemUpdates: false
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </Header>

      {/* Profile Information */}
      <SettingsCard>
        <SectionTitle>
          <User size={24} />
          Profile Information
        </SectionTitle>
        
        <InfoBadge>
          <Shield size={16} />
          Role: {admin?.role?.replace('_', ' ').toUpperCase()}
        </InfoBadge>
        
        <form onSubmit={handleProfileUpdate} style={{ marginTop: 'var(--spacing-4)' }}>
          <FormGroup>
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label>Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            <Save size={18} />
            Save Changes
          </Button>
        </form>
      </SettingsCard>

      {/* Change Password */}
      <SettingsCard>
        <SectionTitle>
          <Lock size={24} />
          Change Password
        </SectionTitle>
        
        <form onSubmit={handlePasswordUpdate}>
          <FormGroup>
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            <Lock size={18} />
            Update Password
          </Button>
        </form>
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard>
        <SectionTitle>
          <Bell size={24} />
          Notification Preferences
        </SectionTitle>
        
        <Toggle>
          <div className="label">
            <div className="title">Email Notifications</div>
            <div className="description">Receive email updates about system activity</div>
          </div>
          <input
            type="checkbox"
            checked={notifications.emailNotifications}
            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
          />
        </Toggle>
        
        <Toggle>
          <div className="label">
            <div className="title">New User Alerts</div>
            <div className="description">Get notified when new users register</div>
          </div>
          <input
            type="checkbox"
            checked={notifications.newUserAlerts}
            onChange={(e) => setNotifications({ ...notifications, newUserAlerts: e.target.checked })}
          />
        </Toggle>
        
        <Toggle>
          <div className="label">
            <div className="title">Appointment Alerts</div>
            <div className="description">Receive notifications for new appointments</div>
          </div>
          <input
            type="checkbox"
            checked={notifications.appointmentAlerts}
            onChange={(e) => setNotifications({ ...notifications, appointmentAlerts: e.target.checked })}
          />
        </Toggle>
        
        <Toggle>
          <div className="label">
            <div className="title">System Updates</div>
            <div className="description">Get notified about system maintenance and updates</div>
          </div>
          <input
            type="checkbox"
            checked={notifications.systemUpdates}
            onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
          />
        </Toggle>
      </SettingsCard>
    </Container>
  );
};

export default AdminSettings;
