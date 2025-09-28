"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/useAuth';

export interface DeliveryAddress {
  id: string;
  fields: string;
  city: string;
  country: string;
  zip_code: string;
  road_no: string;
  house_no: string;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryAddressResponse {
  success: boolean;
  data: DeliveryAddress[];
  message?: string;
}

// GET delivery addresses
export function useDeliveryAddresses() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/delivery-addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const responseData = await response.json();
      // Handle the API response structure: {success: true, message: "...", data: []}
      if (responseData.success && Array.isArray(responseData.data)) {
        setAddresses(responseData.data);
      } else {
        setAddresses([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [token, fetchAddresses]);

  return { addresses, loading, error, refetch: fetchAddresses };
}

// CREATE delivery address
export function useCreateDeliveryAddress() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAddress = async (addressData: {
    fields: string;
    city: string;
    country: string;
    zip_code: string;
    road_no: string;
    house_no: string;
    details: string;
  }) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/delivery-addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
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

  return { createAddress, loading, error };
}

// UPDATE delivery address
export function useUpdateDeliveryAddress() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAddress = async (id: string, addressData: {
    fields?: string;
    city?: string;
    country?: string;
    zip_code?: string;
    road_no?: string;
    house_no?: string;
    details?: string;
  }) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/delivery-addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
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

  return { updateAddress, loading, error };
}

// DELETE delivery address
export function useDeleteDeliveryAddress() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAddress = async (id: string) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/delivery-addresses/${id}`, {
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

  return { deleteAddress, loading, error };
}

