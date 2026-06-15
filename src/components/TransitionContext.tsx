'use client';

import { createContext, useContext, useState } from 'react';

type TransitionContextType = {
  isExiting: boolean;
  setIsExiting: (val: boolean) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isExiting: false,
  setIsExiting: () => {}
});

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isExiting, setIsExiting] = useState(false);
  return (
    <TransitionContext.Provider value={{ isExiting, setIsExiting }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransitionState = () => useContext(TransitionContext);
