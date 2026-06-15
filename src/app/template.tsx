'use client';

import { motion } from 'framer-motion';
import { useTransitionState } from '@/components/TransitionContext';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const { isExiting, setIsExiting } = useTransitionState();
  const pathname = usePathname();

  useEffect(() => {
    // Reset exiting state whenever the pathname changes (new page mounted)
    setIsExiting(false);
  }, [pathname, setIsExiting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ 
        opacity: isExiting ? 0 : 1, 
        y: isExiting ? -10 : 0,
        scale: isExiting ? 0.98 : 1
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
