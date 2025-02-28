import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPageProps {
  children: ReactNode;
  direction?: 'right' | 'left';
  isVisible: boolean;
  onExitComplete?: () => void;
  className?: string;
  useFixedPosition?: boolean;
}

const slideVariants = {
  rightEntry: {
    x: '100%',
    zIndex: 10,
  },
  leftExit: {
    x: '-100%',
    zIndex: 10,
  },
  center: {
    x: 0,
    zIndex: 10,
  },
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  direction = 'right',
  isVisible,
  onExitComplete,
  className = '',
  useFixedPosition = true,
}) => {
  const positionClass = useFixedPosition
    ? 'fixed top-0 right-0 bottom-0 left-0 z-50 w-[400px] h-[600px]'
    : 'absolute inset-0 w-full h-full';

  return (
    <AnimatePresence mode='wait' onExitComplete={onExitComplete}>
      {isVisible && (
        <motion.div
          className={`${positionClass} ${className} bg-white`}
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
