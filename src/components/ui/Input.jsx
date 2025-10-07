import styled from 'styled-components';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral.gray[700]};
  
  ${({ required, theme }) => required && `
    &::after {
      content: ' *';
      color: ${theme.colors.error.main};
    }
  `}
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return `${theme.spacing[2]} ${theme.spacing[3]}`;
      case 'lg': return `${theme.spacing[4]} ${theme.spacing[5]}`;
      default: return `${theme.spacing[3]} ${theme.spacing[4]}`;
    }
  }};
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.base;
    }
  }};
  color: ${({ theme }) => theme.colors.neutral.gray[900]};
  background: ${({ theme }) => theme.colors.neutral.white};
  border: 2px solid ${({ theme, error }) => 
    error ? theme.colors.error.main : theme.colors.neutral.gray[300]};
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all ${({ theme }) => theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => 
      error ? theme.colors.error.main : theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme, error }) => 
      error ? theme.colors.error.bg : theme.colors.primary.lighter};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.gray[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.gray[400]};
  }
  
  ${({ hasIcon }) => hasIcon && `
    padding-right: 2.5rem;
  `}
`;

const IconButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral.gray[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${({ theme }) => theme.transitions.base};
  
  &:hover {
    color: ${({ theme }) => theme.colors.neutral.gray[700]};
  }
`;

const HelperText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme, error }) => 
    error ? theme.colors.error.main : theme.colors.neutral.gray[600]};
`;

const Input = ({ 
  label,
  type = 'text',
  size = 'md',
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  value,
  onChange,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <InputWrapper>
      {label && (
        <Label required={required} htmlFor={props.id}>
          {label}
        </Label>
      )}
      
      <InputContainer>
        <StyledInput
          type={inputType}
          size={size}
          error={error}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          hasIcon={isPassword}
          {...props}
        />
        
        {isPassword && (
          <IconButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </IconButton>
        )}
      </InputContainer>
      
      {(helperText || error) && (
        <HelperText error={error}>
          {error || helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
};

export default Input;
