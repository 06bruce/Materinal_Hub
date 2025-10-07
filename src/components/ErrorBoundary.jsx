import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f05d5dff 0%, #7405058b 100%);
  padding: var(--spacing-4);
`;

const ErrorCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-8);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--error-light);
  border-radius: 50%;
  margin: 0 auto var(--spacing-4);
  color: var(--error);
`;

const ErrorTitle = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
`;

const ErrorMessage = styled.p`
  color: var(--gray-600);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-6);
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-bottom: var(--spacing-6);
  text-align: left;
  
  summary {
    cursor: pointer;
    color: var(--gray-500);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-2);
  }
  
  pre {
    background: var(--gray-100);
    padding: var(--spacing-3);
    border-radius: var(--radius-md);
    font-size: var(--font-size-xs);
    overflow-x: auto;
    color: var(--gray-700);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &.primary {
    background: var(--primary);
    color: var(--white);
    
    &:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background: var(--gray-100);
    color: var(--gray-700);
    
    &:hover {
      background: var(--gray-200);
    }
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle size={40} />
            </ErrorIcon>
            
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            
            <ErrorMessage>
              We're sorry, but something unexpected happened. 
              Please try refreshing the page or contact support if the problem persists.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && (
              <ErrorDetails>
                <summary>Error Details (Development Only)</summary>
                <pre>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </ErrorDetails>
            )}

            <ButtonGroup>
              <Button className="primary" onClick={this.handleRetry}>
                <RefreshCw size={16} />
                Try Again
              </Button>
              <Button className="secondary" onClick={this.handleGoHome}>
                <Home size={16} />
                Go Home
              </Button>
            </ButtonGroup>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
