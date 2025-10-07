import { motion } from 'framer-motion';

const SlideIn = ({ 
  children, 
  direction = 'left', 
  delay = 0, 
  duration = 0.5,
  ...props 
}) => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
