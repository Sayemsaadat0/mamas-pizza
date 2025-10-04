"use client";

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useCart, useUpdateCartItem, useDeleteCartItem, useDeleteGuestCartItem } from "@/hooks/cart.hook";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";
import OrderSummary from "./components/OrderSummary";
import CheckoutModal from "./components/CheckoutModal";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   qty: number;
//   description: string;
//   color: string;
// }

export default function CartPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: string }>({});
  
  // Auth hook
  const { isAuthenticated } = useAuth();
  
  // Cart hooks
  const { cartItems, loading, error, grandTotal,  refetch, updateCartItemLocally, removeCartItemLocally } = useCart();
  const { updateCartItem,  } = useUpdateCartItem();
  const { deleteCartItem,  } = useDeleteCartItem();
  const { deleteGuestCartItem,  } = useDeleteGuestCartItem();

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
    const delivery = 0; // Delivery fee will be calculated by backend
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
      } catch (error ) {
        console.error('Error updating cart item:', error);
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
    try {
      // Set loading state
      setLoadingItems(prev => new Set(prev).add(cartItemId));
      
      // Update UI immediately for better UX
      removeCartItemLocally(cartItemId);
      
      // Make API call based on authentication status
      if (isAuthenticated) {
        await deleteCartItem(cartItemId);
      } else {
        await deleteGuestCartItem(cartItemId);
      }
      
      toast.success('Item removed from cart');
    } catch (error ) {
      console.error('Error removing item from cart:', error);
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

  const handleConfirmOrder = (guestData?: any) => {
    // Handle order confirmation logic here
    const orderData = {
      cart,
      summary,
      guestData,
      isAuthenticated
    };
    console.log("Order confirmed:", orderData);
    setIsModalOpen(false);
    // You can add navigation to success page or other logic
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Shopping cart background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4">
              YOUR CART
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
            <p className="text-xl sm:text-2xl text-gray-200 mt-6 max-w-2xl mx-auto">
              Review your delicious selections and proceed to checkout
            </p>
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
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Shopping cart background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4">
              YOUR CART
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
            <p className="text-xl sm:text-2xl text-gray-200 mt-6 max-w-2xl mx-auto">
              Review your delicious selections and proceed to checkout
            </p>
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
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Shopping cart background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4">
            YOUR CART
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
          <p className="text-xl sm:text-2xl text-gray-200 mt-6 max-w-2xl mx-auto">
            Review your delicious selections and proceed to checkout
          </p>
        </div>
      </div>
    
      <div className="ah-container px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Side - Cart Items (3/5 width on desktop) */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Cart Items</h2>
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-lg font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-sm sm:text-lg font-semibold text-orange-600">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-2 border-2 border-orange-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-white shadow-sm">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          disabled={loadingItems.has(item.id)}
                          className="w-5 h-5 sm:w-6 sm:h-6 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          {loadingItems.has(item.id) ? (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.qty}
                          onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                          onBlur={() => handleQuantityInputBlur(item.id)}
                          className="min-w-6 sm:min-w-8 max-w-[60px] sm:max-w-[80px] text-center font-semibold text-xs sm:text-sm text-gray-900 bg-transparent border-none outline-none"
                          disabled={loadingItems.has(item.id)}
                        />
                        <button
                          onClick={() => updateQty(item.id, +1)}
                          disabled={loadingItems.has(item.id)}
                          className="w-5 h-5 sm:w-6 sm:h-6 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          {loadingItems.has(item.id) ? (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loadingItems.has(item.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Remove item"
                      >
                        {loadingItems.has(item.id) ? (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Order Summary (2/5 width on desktop) */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <OrderSummary 
                summary={summary} 
                onCheckout={handleCheckout}
              />
            </div>
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
