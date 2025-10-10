import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserPlus, Mail, Lock, Phone, User, Shield } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-6);
  
  h1 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    color: var(--gray-600);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--gray-700);
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) 40px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) 40px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: var(--spacing-3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  padding: var(--spacing-3);
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: var(--radius-lg);
  color: #0369a1;
  font-size: var(--font-size-sm);
`;

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      const response = await axios.post(
        `${API_URL}/api/admin/register`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Admin created successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <h1>Create New Admin</h1>
          <p>Only super admins can create new admin accounts</p>
        </Header>

        <InfoBox>
          ℹ️ This page is only accessible to super admins. New admins will receive their credentials and can login immediately.
        </InfoBox>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name *</Label>
            <InputWrapper>
              <User size={18} />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
            <InputWrapper>
              <Mail size={18} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password *</Label>
            <InputWrapper>
              <Lock size={18} />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <InputWrapper>
              <Phone size={18} />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+250 XXX XXX XXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="role">Admin Role *</Label>
            <InputWrapper>
              <Shield size={18} />
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="super_admin">Super Admin</option>
              </Select>
            </InputWrapper>
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size={20} /> : (
              <>
                <UserPlus size={20} />
                Create Admin Account
              </>
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AdminRegister;
