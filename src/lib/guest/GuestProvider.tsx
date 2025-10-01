"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useGuestId } from './useGuestId';

interface GuestContextType {
  guestId: string | null;
  isLoading: boolean;
  refreshGuestId: () => string;
  canOrder: boolean;
  setCanOrder: (value: boolean) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

interface GuestProviderProps {
  children: ReactNode;
}

export const GuestProvider: React.FC<GuestProviderProps> = ({ children }) => {
  const guestData = useGuestId();

  return (
    <GuestContext.Provider value={guestData}>
      {children}
    </GuestContext.Provider>
  );
};

// Custom hook to use guest context
export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);
  
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  
  return context;
};
