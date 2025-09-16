"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export interface Restaurant {
  id: number;
  name: string;
  shop_status: 'open' | 'closed';
  about: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  privacy_policy: string | null;
  refund_policy: string | null;
  terms_of_service: string | null;
  created_at: string;
  updated_at: string;
}

// GET restaurants
export function useRestaurants() {
  const { token } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/my-restaurants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      setRestaurants(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRestaurants();
  }, [token, fetchRestaurants]);

  return { restaurants, loading, error, refetch: fetchRestaurants };
}

// CREATE restaurant
export function useCreateRestaurant() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRestaurant = async (restaurantData: any) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/my-restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(restaurantData),
      });
      
      const data = await response.json();
      return data.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createRestaurant, loading, error };
}

// UPDATE restaurant
export function useUpdateRestaurant() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRestaurant = async (id: number, restaurantData: any) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/my-restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(restaurantData),
      });
      
      const data = await response.json();
      return data.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateRestaurant, loading, error };
}

// DELETE restaurant
export function useDeleteRestaurant() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRestaurant = async (id: number) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/my-restaurants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRestaurant, loading, error };
}
