"use client";

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useCart, useUpdateCartItem, useDeleteCartItem } from "@/hooks/cart.hook";
import { toast } from "sonner";
import CartItems from "./components/CartItems";
import OrderSummary from "./components/OrderSummary";
import CheckoutModal from "./components/CheckoutModal";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
  description: string;
  color: string;
}

export default function CartPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: string }>({});
  
  // Cart hooks
  const { cartItems, loading, error, grandTotal,  refetch, updateCartItemLocally, removeCartItemLocally } = useCart();
  const { updateCartItem, loading: updateLoading } = useUpdateCartItem();
  const { deleteCartItem, loading: deleteLoading } = useDeleteCartItem();

  // Transform cart data to match CartItems component interface
  const cart = useMemo(() => {
    return cartItems.map(item => ({
      id: item.id,
      name: item.item.name,
      price: parseFloat(item.item.main_price),
      image: `${process.env.NEXT_PUBLIC_API_URL}/${item.item.thumbnail}`,
      qty: item.quantity,
      description: item.item.details,
      color: item.item.category.name
    }));
  }, [cartItems]);

  const summary = useMemo(() => {
    const subtotal = grandTotal;
    const discount = 0; // No discount applied
    const delivery = 8.99;
    const total = subtotal - discount + delivery;
    return { subtotal, discount, delivery, total };
  }, [grandTotal]);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced update function
  const debouncedUpdateQty = useCallback((cartItemId: number, newQuantity: number) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Set loading state
        setLoadingItems(prev => new Set(prev).add(cartItemId));
        
        // Update UI immediately for better UX
        updateCartItemLocally(cartItemId, newQuantity);
        
        // Make API call
        await updateCartItem(cartItemId, newQuantity);
        
        toast.success('Cart updated successfully');
      } catch (error) {
        // Revert the local change if API call fails
        const currentItem = cartItems.find(item => item.id === cartItemId);
        if (currentItem) {
          updateCartItemLocally(cartItemId, currentItem.quantity);
        }
        toast.error('Failed to update cart item');
      } finally {
        // Remove loading state
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      }
    }, 1000);
  }, [cartItems, updateCartItemLocally, updateCartItem]);

  const updateQty = (cartItemId: number, delta: number) => {
    const currentItem = cartItems.find(item => item.id === cartItemId);
    if (!currentItem) return;
    
    const newQuantity = Math.max(1, currentItem.quantity + delta);
    debouncedUpdateQty(cartItemId, newQuantity);
  };

  const handleQuantityInputChange = (cartItemId: number, value: string) => {
    setQuantityInputs(prev => ({ ...prev, [cartItemId]: value }));
  };

  const handleQuantityInputBlur = (cartItemId: number) => {
    const inputValue = quantityInputs[cartItemId];
    if (inputValue) {
      const newQuantity = Math.max(1, parseInt(inputValue) || 1);
      debouncedUpdateQty(cartItemId, newQuantity);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const removeItem = async (cartItemId: number) => {
    // Store the item to restore if API call fails
    const itemToRemove = cartItems.find(item => item.id === cartItemId);
    
    try {
      // Set loading state
      setLoadingItems(prev => new Set(prev).add(cartItemId));
      
      // Update UI immediately for better UX
      removeCartItemLocally(cartItemId);
      
      // Make API call
      await deleteCartItem(cartItemId);
      
      toast.success('Item removed from cart');
    } catch (error) {
      // Revert the local change if API call fails - refetch to restore original state
      refetch();
      toast.error('Failed to remove item from cart');
    } finally {
      // Remove loading state
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    // Handle order confirmation logic here
    console.log("Order confirmed:", { cart, summary });
    setIsModalOpen(false);
    // You can add navigation to success page or other logic
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen mt-20 bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="ah-container px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="mt-2 text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600">Review your items and proceed to checkout</p>
          </div>
        </div>
        
        <div className="ah-container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 xl:py-40">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
              <p className="text-orange-600 mt-4 font-medium">Loading your cart...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="ah-container px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="mt-2 text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600">Review your items and proceed to checkout</p>
          </div>
        </div>
        
        <div className="ah-container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 xl:py-40">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Cart</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 mt-32">
    
      <div className="ah-container px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Side - Cart Items */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <CartItems 
              cart={cart} 
              onUpdateQty={updateQty} 
              onRemoveItem={removeItem}
              loadingItems={loadingItems}
              quantityInputs={quantityInputs}
              onQuantityInputChange={handleQuantityInputChange}
              onQuantityInputBlur={handleQuantityInputBlur}
            />
          </div>

          {/* Right Side - Order Summary */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <OrderSummary 
              summary={summary} 
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cart={cart}
        summary={summary}
        onConfirmOrder={handleConfirmOrder}
      />
    </main>
  );
}
