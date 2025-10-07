import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return `${theme.spacing[2]} ${theme.spacing[4]}`;
      case 'lg': return `${theme.spacing[4]} ${theme.spacing[8]}`;
      default: return `${theme.spacing[3]} ${theme.spacing[6]}`;
    }
  }};
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.base;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  white-space: nowrap;
  
  /* Variant Styles */
  ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.main};
          color: ${theme.colors.neutral.white};
          box-shadow: ${theme.shadows.sm};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.dark};
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      
      case 'secondary':
        return `
          background: ${theme.colors.secondary.main};
          color: ${theme.colors.neutral.white};
          box-shadow: ${theme.shadows.sm};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.secondary.dark};
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }
        `;
      
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary.main};
          border: 2px solid ${theme.colors.primary.main};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.lighter};
            border-color: ${theme.colors.primary.dark};
          }
        `;
      
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary.main};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.lighter};
          }
        `;
      
      case 'danger':
        return `
          background: ${theme.colors.error.main};
          color: ${theme.colors.neutral.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error.dark};
          }
        `;
      
      default:
        return `
          background: ${theme.colors.neutral.gray[200]};
          color: ${theme.colors.neutral.gray[900]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.neutral.gray[300]};
          }
        `;
    }
  }}
  
  /* Full Width */
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
  
  /* Disabled State */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Loading State */
  ${({ isLoading }) => isLoading && `
    position: relative;
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.6s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
