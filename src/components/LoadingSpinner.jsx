import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader2 } from 'lucide-react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6);
  min-height: ${props => props.$fullHeight ? '100vh' : '200px'};
  background: ${props => props.$overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  position: ${props => props.$overlay ? 'fixed' : 'relative'};
  top: ${props => props.$overlay ? '0' : 'auto'};
  left: ${props => props.$overlay ? '0' : 'auto'};
  right: ${props => props.$overlay ? '0' : 'auto'};
  bottom: ${props => props.$overlay ? '0' : 'auto'};
  z-index: ${props => props.$overlay ? '9999' : 'auto'};
`;

const Spinner = styled.div`
  display: inline-block;
  animation: ${spin} 1s linear infinite;
  color: var(--primary);
  margin-bottom: ${props => props.withText ? 'var(--spacing-3)' : '0'};
`;

const LoadingText = styled.p`
  color: var(--gray-600);
  font-size: var(--font-size-base);
  font-weight: 500;
  margin: 0;
  text-align: center;
`;

const LoadingSpinner = ({ 
  size = 32, 
  text = '', 
  fullHeight = false, 
  overlay = false 
}) => {
  return (
    <LoadingContainer $fullHeight={fullHeight} $overlay={overlay}>
      <Spinner withText={!!text}>
        <Loader2 size={size} />
      </Spinner>
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default LoadingSpinner;
