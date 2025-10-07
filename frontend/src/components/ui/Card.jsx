import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.radius['2xl']};
  box-shadow: ${({ theme, elevation }) => {
    switch (elevation) {
      case 'sm': return theme.shadows.sm;
      case 'md': return theme.shadows.md;
      case 'lg': return theme.shadows.lg;
      case 'xl': return theme.shadows.xl;
      default: return theme.shadows.base;
    }
  }};
  padding: ${({ theme, padding }) => {
    switch (padding) {
      case 'sm': return theme.spacing[4];
      case 'lg': return theme.spacing[8];
      case 'none': return '0';
      default: return theme.spacing[6];
    }
  }};
  transition: all ${({ theme }) => theme.transitions.base};
  overflow: hidden;
  
  ${({ hoverable, theme }) => hoverable && `
    cursor: pointer;
    
    &:hover {
      box-shadow: ${theme.shadows.lg};
      transform: translateY(-2px);
    }
  `}
  
  ${({ bordered, theme }) => bordered && `
    border: 1px solid ${theme.colors.neutral.gray[200]};
  `}
`;

const CardHeader = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral.gray[900]};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral.gray[600]};
  margin: ${({ theme }) => theme.spacing[2]} 0 0;
`;

const CardContent = styled.div`
  /* Content styles */
`;

const CardFooter = styled.div`
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.gray[200]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Card = ({ 
  children, 
  elevation = 'base',
  padding = 'md',
  hoverable = false,
  bordered = false,
  ...props 
}) => {
  return (
    <StyledCard
      elevation={elevation}
      padding={padding}
      hoverable={hoverable}
      bordered={bordered}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
