"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { useGuest } from "@/lib/guest/GuestProvider";

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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (isAuthenticated) {
        // Fetch user cart
        const response = await fetch(`${baseUrl}/api/v1/user/cart`, {
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
        
        const response = await fetch(`${baseUrl}/api/v1/guest/cart?guest_id=${guestId}`);
        
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (isAuthenticated) {
        // Update user cart item
        const response = await fetch(`${baseUrl}/api/v1/cart/${cartItemId}`, {
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
        
        const response = await fetch(`${baseUrl}/api/v1/guest/cart/${cartItemId}`, {
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (isAuthenticated) {
        // Delete user cart item
        const response = await fetch(`${baseUrl}/api/v1/cart/${cartItemId}`, {
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
        // Delete guest cart item - use same endpoint as user
        const response = await fetch(`${baseUrl}/api/v1/cart/${cartItemId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ guest_id: guestId })
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete cart item');
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
