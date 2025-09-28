"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/useAuth';

export interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  details: string;
  main_price: number;
  prev_price: number;
  thumbnail: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  pagination: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

// GET menus
export function useMenus() {
  const { token } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<MenuResponse['pagination'] | null>(null);

  const fetchMenus = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const responseData = await response.json();
      // Handle the API response structure: {success: true, message: "...", data: []}
      if (responseData.success && Array.isArray(responseData.data)) {
        setMenus(responseData.data);
      } else {
        setMenus([]);
      }
      setPagination(null); // API doesn't return pagination in this format
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMenus();
  }, [token, fetchMenus]);

  return { menus, loading, error, pagination, refetch: fetchMenus };
}

// CREATE menu
export function useCreateMenu() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMenu = async (menuData: {
    title: string;
    category_id: string;
    description: string;
    short_description: string;
    regular_price: string;
    actual_price: string;
    thumbnail?: string;
    status?: 'active' | 'inactive';
  }) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(menuData),
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

  return { createMenu, loading, error };
}

// UPDATE menu
export function useUpdateMenu() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMenu = async (id: string, menuData: {
    title?: string;
    category_id?: string;
    description?: string;
    short_description?: string;
    regular_price?: string;
    actual_price?: string;
    thumbnail?: string;
    status?: 'active' | 'inactive';
  }) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(menuData),
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

  return { updateMenu, loading, error };
}

// DELETE menu
export function useDeleteMenu() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMenu = async (id: string) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${base}/api/v1/items/${id}`, {
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

  return { deleteMenu, loading, error };
}
