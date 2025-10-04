"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { ADMIN_ORDERS_API, getAdminOrderById, cancelAdminOrder } from '@/app/api';

export interface AdminOrder {
  id: number;
  order_number: string;
  user_id?: number;
  guest_id?: string;
  user_type: 'authenticated' | 'guest';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'stripe' | 'cash' | 'card';
  total_amount: number;
  delivery_fee: number;
  tax_amount: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    total_price: number;
  }>;
  delivery_address?: {
    address_line_1: string;
    address_line_2?: string;
    post_code: string;
    fields: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AdminOrderFilters {
  status?: string;
  payment_status?: string;
  user_type?: string;
  payment_method?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

// GET all admin orders with filters
export function useAdminOrders(filters?: AdminOrderFilters) {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  } | null>(null);

  const fetchAdminOrders = useCallback(async (queryFilters?: AdminOrderFilters) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      const activeFilters = queryFilters || filters;
      
      if (activeFilters) {
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${ADMIN_ORDERS_API}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin orders');
      }

      const result = await response.json();
      setOrders(result.data || []);
      setPagination(result.pagination || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, filters]);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchAdminOrders,
  };
}

// GET admin order by ID
export function useAdminOrder(orderId: string) {
  const { token, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminOrder = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getAdminOrderById(orderId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin order');
      }

      const result = await response.json();
      setOrder(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, orderId]);

  return {
    order,
    loading,
    error,
    fetchAdminOrder,
  };
}

// UPDATE admin order status
export function useUpdateAdminOrderStatus() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrderStatus = async (orderId: number, status: string) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getAdminOrderById(orderId.toString()), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateOrderStatus,
    loading,
    error,
  };
}

// CANCEL admin order
export function useCancelAdminOrder() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelOrder = async (orderId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(cancelAdminOrder(orderId.toString()), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel order');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cancelOrder,
    loading,
    error,
  };
}
