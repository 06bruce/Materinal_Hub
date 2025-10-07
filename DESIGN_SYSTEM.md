# Design System Documentation

## Overview
This design system provides a comprehensive set of reusable components, theme configuration, and styling utilities for the Maternal Health Hub application.

---

## 🎨 Theme Configuration

### Colors

#### Primary Colors
```jsx
theme.colors.primary.main      // #f05d5d (Main brand color)
theme.colors.primary.light     // #ff8a8a (Lighter variant)
theme.colors.primary.dark      // #c73838 (Darker variant)
theme.colors.primary.lighter   // #ffe5e5 (Very light)
```

#### Secondary Colors
```jsx
theme.colors.secondary.main    // #ff69b4 (Hot pink)
theme.colors.secondary.light   // #ffb3d9
theme.colors.secondary.dark    // #cc4490
```

#### Semantic Colors
```jsx
theme.colors.success.main      // Green for success states
theme.colors.error.main        // Red for errors
theme.colors.warning.main      // Orange for warnings
theme.colors.info.main         // Blue for info
```

---

## 📦 Components

### Button

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`  
**Sizes:** `sm`, `md`, `lg`

```jsx
import { Button } from './components/ui';

// Primary button
<Button variant="primary" size="md">
  Click Me
</Button>

// Loading state
<Button isLoading>
  Processing...
</Button>

// Full width
<Button fullWidth>
  Submit
</Button>

// With icon
<Button>
  <Icon /> Text
</Button>
```

**Props:**
- `variant` - Button style variant
- `size` - Button size
- `fullWidth` - Makes button full width
- `isLoading` - Shows loading spinner
- `disabled` - Disables button
- `onClick` - Click handler

---

### Card

**Elevation:** `sm`, `base`, `md`, `lg`, `xl`  
**Padding:** `none`, `sm`, `md`, `lg`

```jsx
import { Card } from './components/ui';

<Card elevation="md" hoverable>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description text</Card.Description>
  </Card.Header>
  
  <Card.Content>
    Your content here
  </Card.Content>
  
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

**Props:**
- `elevation` - Shadow depth
- `padding` - Internal padding
- `hoverable` - Adds hover effect
- `bordered` - Adds border

---

### Input

**Sizes:** `sm`, `md`, `lg`

```jsx
import { Input } from './components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  helperText="We'll never share your email"
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password is required"
/>
```

**Props:**
- `label` - Input label
- `type` - Input type (text, email, password, etc.)
- `size` - Input size
- `error` - Error message
- `helperText` - Helper text below input
- `required` - Shows required indicator
- `disabled` - Disables input

---

### Container

```jsx
import { Container } from './components/ui';

<Container maxWidth="lg">
  Your content here
</Container>
```

**Props:**
- `maxWidth` - Maximum width (`sm`, `md`, `lg`, `xl`, `2xl`)

---

## 🎭 Animations

### FadeIn

```jsx
import { FadeIn } from './components/animations';

<FadeIn delay={0.2} duration={0.5}>
  <YourComponent />
</FadeIn>
```

### SlideIn

```jsx
import { SlideIn } from './components/animations';

<SlideIn direction="left" delay={0.3}>
  <YourComponent />
</SlideIn>
```

**Directions:** `left`, `right`, `up`, `down`

---

## 📐 Spacing

Use theme spacing for consistent spacing:

```jsx
padding: ${({ theme }) => theme.spacing[4]};  // 16px
margin: ${({ theme }) => theme.spacing[8]};   // 32px
gap: ${({ theme }) => theme.spacing[2]};      // 8px
```

**Available values:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32

---

## 🔤 Typography

### Font Sizes

```jsx
font-size: ${({ theme }) => theme.typography.fontSize.xs};    // 12px
font-size: ${({ theme }) => theme.typography.fontSize.sm};    // 14px
font-size: ${({ theme }) => theme.typography.fontSize.base};  // 16px
font-size: ${({ theme }) => theme.typography.fontSize.lg};    // 18px
font-size: ${({ theme }) => theme.typography.fontSize.xl};    // 20px
font-size: ${({ theme }) => theme.typography.fontSize['2xl']}; // 24px
```

### Font Weights

```jsx
font-weight: ${({ theme }) => theme.typography.fontWeight.normal};    // 400
font-weight: ${({ theme }) => theme.typography.fontWeight.medium};    // 500
font-weight: ${({ theme }) => theme.typography.fontWeight.semibold}; // 600
font-weight: ${({ theme }) => theme.typography.fontWeight.bold};     // 700
```

---

## 📱 Responsive Design

### Breakpoints

```jsx
${({ theme }) => theme.media.sm} {
  // Styles for screens >= 640px
}

${({ theme }) => theme.media.md} {
  // Styles for screens >= 768px
}

${({ theme }) => theme.media.lg} {
  // Styles for screens >= 1024px
}

${({ theme }) => theme.media.xl} {
  // Styles for screens >= 1280px
}
```

---

## 🎨 Shadows

```jsx
box-shadow: ${({ theme }) => theme.shadows.sm};   // Subtle shadow
box-shadow: ${({ theme }) => theme.shadows.base}; // Default shadow
box-shadow: ${({ theme }) => theme.shadows.md};   // Medium shadow
box-shadow: ${({ theme }) => theme.shadows.lg};   // Large shadow
box-shadow: ${({ theme }) => theme.shadows.xl};   // Extra large shadow
```

---

## 🔄 Transitions

```jsx
transition: all ${({ theme }) => theme.transitions.fast};   // 150ms
transition: all ${({ theme }) => theme.transitions.base};   // 200ms
transition: all ${({ theme }) => theme.transitions.slow};   // 300ms
transition: all ${({ theme }) => theme.transitions.slower}; // 500ms
```

---

## 📝 Usage Examples

### Creating a Custom Component

```jsx
import styled from 'styled-components';
import { Button, Card } from './components/ui';
import { FadeIn } from './components/animations';

const CustomSection = styled.section`
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.neutral.gray[50]};
  
  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.spacing[12]};
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const MyComponent = () => {
  return (
    <FadeIn>
      <CustomSection>
        <Title>Welcome</Title>
        <Card elevation="lg">
          <Card.Content>
            <p>Your content here</p>
            <Button variant="primary">Get Started</Button>
          </Card.Content>
        </Card>
      </CustomSection>
    </FadeIn>
  );
};
```

---

## 🚀 Quick Start

1. **Import theme in your component:**
```jsx
import { useTheme } from 'styled-components';

const MyComponent = () => {
  const theme = useTheme();
  // Use theme values
};
```

2. **Use UI components:**
```jsx
import { Button, Card, Input } from './components/ui';
```

3. **Add animations:**
```jsx
import { FadeIn, SlideIn } from './components/animations';
```

---

## 🎯 Best Practices

1. **Always use theme values** instead of hardcoded values
2. **Use semantic color names** (success, error, warning) for states
3. **Apply consistent spacing** using theme.spacing
4. **Use media queries** for responsive design
5. **Add animations** for better UX
6. **Reuse components** instead of creating duplicates
7. **Follow naming conventions** for consistency

---

## 📚 Resources

- **Theme File:** `/src/styles/theme.js`
- **Global Styles:** `/src/styles/GlobalStyles.js`
- **UI Components:** `/src/components/ui/`
- **Animations:** `/src/components/animations/`

---

## 🔧 Customization

To customize the theme, edit `/src/styles/theme.js`:

```jsx
export const theme = {
  colors: {
    primary: {
      main: '#your-color',
      // ...
    },
  },
  // ...
};
```

Changes will automatically apply across the entire application!
