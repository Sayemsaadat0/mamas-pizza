"use client";

import { useCallback, useEffect, useState } from 'react';

const GUEST_ID_KEY = 'mamas_guest_id';

// Generate 16-digit guest ID with uppercase letters and numbers
const generateGuestId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

export const useGuestId = () => {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canOrder, setCanOrder] = useState<boolean>(false);

  // Memoized function to get or create guest ID
  const getOrCreateGuestId = useCallback(() => {
    try {
      // Check if guest ID already exists in localStorage
      const existingGuestId = localStorage.getItem(GUEST_ID_KEY);
      
      if (existingGuestId) {
        console.log('Existing guest ID found:', existingGuestId);
        setGuestId(existingGuestId);
        return existingGuestId;
      }
      
      // Generate new guest ID if none exists
      const newGuestId = generateGuestId();
      localStorage.setItem(GUEST_ID_KEY, newGuestId);
      console.log('New guest ID created:', newGuestId);
      setGuestId(newGuestId);
      return newGuestId;
      
    } catch (error) {
      console.error('Error handling guest ID:', error);
      // Fallback: generate ID without localStorage
      const fallbackId = generateGuestId();
      setGuestId(fallbackId);
      return fallbackId;
    }
  }, []);

  // Initialize guest ID on mount
  useEffect(() => {
    getOrCreateGuestId();
    setIsLoading(false);
  }, [getOrCreateGuestId]);

  return {
    guestId,
    isLoading,
    refreshGuestId: getOrCreateGuestId,
    canOrder,
    setCanOrder,
  };
};
