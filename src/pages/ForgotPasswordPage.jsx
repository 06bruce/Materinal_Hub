import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { api, handleApiError } from '../utils/api';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--white) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
`;

const Card = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-8);
  width: 100%;
  max-width: 450px;
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: var(--spacing-4);
  left: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-normal);
  
  &:hover {
    color: var(--primary);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-4);
    color: var(--primary);
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
  
  h1 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    color: var(--gray-600);
    font-size: var(--font-size-base);
    line-height: 1.6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const InputGroup = styled.div`
  position: relative;
  
  .input-icon {
    position: absolute;
    left: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
    z-index: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  padding-left: var(--spacing-12);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
  background: var(--white);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: var(--spacing-4);
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-top: var(--spacing-4);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: var(--gray-300);
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: var(--success-light);
  border: 2px solid var(--success);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-4);
  display: flex;
  align-items: start;
  gap: var(--spacing-3);
  
  svg {
    color: var(--success);
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
    
    h3 {
      color: var(--success-dark);
      font-weight: 600;
      margin-bottom: var(--spacing-2);
    }
    
    p {
      color: var(--gray-700);
      font-size: var(--font-size-sm);
      line-height: 1.5;
    }
  }
`;

const InfoBox = styled.div`
  background: var(--primary-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-top: var(--spacing-4);
  
  p {
    color: var(--gray-700);
    font-size: var(--font-size-sm);
    line-height: 1.6;
  }
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.auth.forgotPassword({ email });
      
      if (response.data.success) {
        setEmailSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton to="/login">
          <ArrowLeft size={16} />
          Back to Login
        </BackButton>

        <Header>
          <div className="logo">
            <Heart />
            <span>Maternal Health</span>
          </div>
          <h1>Forgot Password?</h1>
          <p>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </Header>

        {emailSent ? (
          <>
            <SuccessMessage
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle size={24} />
              <div className="content">
                <h3>Check Your Email</h3>
                <p>
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions.
                </p>
              </div>
            </SuccessMessage>

            <InfoBox>
              <p>
                <strong>Didn't receive the email?</strong>
                <br />
                • Check your spam/junk folder
                <br />
                • Make sure you entered the correct email
                <br />
                • Wait a few minutes and try again
                <br />
                • The link expires in 1 hour
              </p>
            </InfoBox>

            <SubmitButton
              type="button"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              Send Another Email
            </SubmitButton>
          </>
        ) : (
          <>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Mail className="input-icon" size={20} />
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </SubmitButton>
            </Form>

            <InfoBox>
              <p>
                You will receive an email with instructions on how to reset your password.
                The reset link will be valid for 1 hour.
              </p>
            </InfoBox>
          </>
        )}
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;
