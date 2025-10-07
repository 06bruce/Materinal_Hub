import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: ${({ maxWidth, theme }) => {
    switch (maxWidth) {
      case 'sm': return '640px';
      case 'md': return '768px';
      case 'lg': return '1024px';
      case 'xl': return '1280px';
      case '2xl': return '1536px';
      default: return '1200px';
    }
  }};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  
  ${({ theme }) => theme.media.md} {
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }
  
  ${({ theme }) => theme.media.lg} {
    padding: 0 ${({ theme }) => theme.spacing[8]};
  }
`;

export default Container;
