import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPageProps {
  children: ReactNode;
  direction?: 'right' | 'left';
  isVisible: boolean;
  onExitComplete?: () => void;
  className?: string;
}

const slideVariants = {
  rightEntry: {
    x: '100%',
  },
  leftExit: {
    x: '-100%',
  },
  center: {
    x: 0,
  },
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  direction = 'right',
  isVisible,
  onExitComplete,
  className = '',
}) => {
  return (
    <AnimatePresence mode='wait' onExitComplete={onExitComplete}>
      {isVisible && (
        <motion.div
          className={`fixed top-0 right-0 bottom-0 left-0 z-50 w-[400px] h-[600px] ${className}`}
          initial={direction === 'right' ? slideVariants.rightEntry : slideVariants.center}
          animate={slideVariants.center}
          exit={slideVariants.leftExit}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedPage;
