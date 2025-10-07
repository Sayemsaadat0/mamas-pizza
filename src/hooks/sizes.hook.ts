'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { SIZES_API, getSizeById } from '@/app/api';

// ==================== TYPES ====================
export interface Size {
  id: string;
  size: string | number;
  status: 'active' | 'inactive' | string | number;
  created_at: string;
  updated_at: string;
}

export interface CreateSizeData {
  size: string;
  status: 'active' | 'inactive';
}

export interface UpdateSizeData {
  size?: string;
  status?: 'active' | 'inactive';
}


// ==================== HOOKS ====================

// Hook to fetch all sizes
export function useSizes() {
  const { token, isAuthenticated } = useAuth();
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSizes = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(SIZES_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sizes');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setSizes(result.data);
        return result.data as Size[];
      } else {
        throw new Error(result.message || 'Failed to fetch sizes');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Initial fetch on component mount
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSizes();
    }
  }, [isAuthenticated, token, fetchSizes]);

  const refetch = useCallback(() => {
    return fetchSizes();
  }, [fetchSizes]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sizes,
    loading,
    error,
    fetchSizes,
    refetch,
    clearError,
  };
}

// Hook to create a new size
export function useCreateSize() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSize = useCallback(async (data: CreateSizeData): Promise<Size | null> => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(SIZES_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create size');
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result.data as Size;
      } else {
        throw new Error(result.message || 'Failed to create size');
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createSize,
    loading,
    error,
    clearError,
  };
}

// Hook to update an existing size
export function useUpdateSize() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSize = useCallback(async (id: string, data: UpdateSizeData): Promise<Size | null> => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getSizeById(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update size');
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result.data as Size;
      } else {
        throw new Error(result.message || 'Failed to update size');
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateSize,
    loading,
    error,
    clearError,
  };
}

// Hook to delete a size
export function useDeleteSize() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSize = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getSizeById(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete size');
      }

      const result = await response.json();
      return result.success || false;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    deleteSize,
    loading,
    error,
    clearError,
  };
}
