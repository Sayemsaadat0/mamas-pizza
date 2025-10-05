"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { useGuest } from "@/lib/guest/GuestProvider";
import { USER_CART_API, GUEST_CART_API, CART_SUMMARY_API } from "@/app/api";

export interface CartItemData {
  id: number;
  user_id: number | null;
  guest_id: string | null;
  item_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  total_price: number;
  item: {
    id: number;
    name: string;
    thumbnail: string;
    main_price: string;
    prev_price: string;
    details: string;
    category_id: number;
    created_at: string;
    updated_at: string;
    category: {
      id: number;
      name: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    items: CartItemData[];
    grand_total: number;
    item_count: number;
  };
}

// GET cart items
export function useCart() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Function to update cart item quantity locally
  const updateCartItemLocally = (cartItemId: number, newQuantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === cartItemId 
          ? { ...item, quantity: newQuantity, total_price: parseFloat(item.item.main_price) * newQuantity }
          : item
      )
    );
    
    // Recalculate totals
    const updatedItems = cartItems.map(item => 
      item.id === cartItemId 
        ? { ...item, quantity: newQuantity, total_price: parseFloat(item.item.main_price) * newQuantity }
        : item
    );
    
    const newGrandTotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
    const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setGrandTotal(newGrandTotal);
    setItemCount(newItemCount);
  };

  // Function to remove cart item locally
  const removeCartItemLocally = (cartItemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    
    // Recalculate totals
    const updatedItems = cartItems.filter(item => item.id !== cartItemId);
    const newGrandTotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
    const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setGrandTotal(newGrandTotal);
    setItemCount(newItemCount);
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      
      if (isAuthenticated) {
        // Fetch user cart
        const response = await fetch(USER_CART_API, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user cart');
        }
        
        const data: CartResponse = await response.json();
        
        if (data.success) {
          setCartItems(data.data.items);
          setGrandTotal(data.data.grand_total);
          setItemCount(data.data.item_count);
        } else {
          setCartItems([]);
          setGrandTotal(0);
          setItemCount(0);
        }
      } else {
        // Fetch guest cart
        if (!guestId) {
          setCartItems([]);
          setGrandTotal(0);
          setItemCount(0);
          return;
        }
        
        const response = await fetch(`${GUEST_CART_API}?guest_id=${guestId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch guest cart');
        }
        
        const data: CartResponse = await response.json();
        
        if (data.success) {
          setCartItems(data.data.items);
          setGrandTotal(data.data.grand_total);
          setItemCount(data.data.item_count);
        } else {
          setCartItems([]);
          setGrandTotal(0);
          setItemCount(0);
        }
      }
    } catch (err: any) {
      setError(err.message);
      setCartItems([]);
      setGrandTotal(0);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, guestId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { 
    cartItems, 
    loading, 
    error, 
    grandTotal, 
    itemCount, 
    refetch: fetchCart,
    updateCartItemLocally,
    removeCartItemLocally
  };
}

// UPDATE cart item quantity
export function useUpdateCartItem() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    setError(null);

    try {
      
      if (isAuthenticated) {
        // Update user cart item
        const response = await fetch(`${USER_CART_API}/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart item');
        }
        
        return await response.json();
      } else {
        // Update guest cart item
        if (!guestId) {
          throw new Error('Guest ID not available');
        }
        
        const response = await fetch(`${GUEST_CART_API}/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            guest_id: guestId,
            quantity 
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart item');
        }
        
        return await response.json();
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCartItem, loading, error };
}

// DELETE cart item
export function useDeleteCartItem() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCartItem = async (cartItemId: number) => {
    setLoading(true);
    setError(null);

    try {
      
      if (isAuthenticated) {
        // Delete user cart item
        const response = await fetch(`${USER_CART_API}/${cartItemId}`, {
          method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete cart item');
        }
        
        return await response.json();
      } else {
        // Delete guest cart item using guest cart endpoint
        if (!guestId) {
          throw new Error('Guest ID is required');
        }
        
        const response = await fetch(`${GUEST_CART_API}/${cartItemId}?guest_id=${guestId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete guest cart item');
        }
        
        return await response.json();
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCartItem, loading, error };
}

// DELETE guest cart item (dedicated hook for guest users)
export function useDeleteGuestCartItem() {
  const { guestId } = useGuest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGuestCartItem = async (cartItemId: number) => {
    if (!guestId) {
      throw new Error('Guest ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${GUEST_CART_API}/${cartItemId}?guest_id=${guestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete guest cart item');
      }
      
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteGuestCartItem, loading, error };
}

// GET cart summary
export function useCartSummary() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [summary, setSummary] = useState<{
    total_items: number;
    subtotal: number;
    delivery_fee: number;
    tax_amount: number;
    total_amount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartSummary = useCallback(async () => {
    if (!isAuthenticated && !guestId) {
      setError('User not authenticated and no guest ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = new URLSearchParams();
      if (guestId) {
        params.append('guest_id', guestId);
      }

      const url = `${CART_SUMMARY_API}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch cart summary');
      }

      const result = await response.json();
      setSummary(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, guestId]);

  return {
    summary,
    loading,
    error,
    fetchCartSummary,
  };
}
