"use client";

import React, { useMemo, useState } from "react";
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

const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Furniture Set",
    price: 109.25,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    qty: 4,
    description: "Set : Colour: Coffee",
    color: "Coffee"
  },
  {
    id: 2,
    name: "Vintage Dining Set",
    price: 472.50,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    qty: 2,
    description: "Set : Colour: Brown",
    color: "Brown"
  },
  {
    id: 3,
    name: "Studio Chair",
    price: 85.29,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    qty: 7,
    description: "Set : Colour: Deep Green",
    color: "Deep Green"
  }
];

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const summary = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = 0; // No discount applied
    const delivery = 8.99;
    const total = subtotal - discount + delivery;
    return { subtotal, discount, delivery, total };
  }, [cart]);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    // Handle order confirmation logic here
    console.log("Order confirmed:", { cart, summary });
    setIsModalOpen(false);
    // You can add navigation to success page or other logic
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="ah-container px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600">Review your items and proceed to checkout</p>
        </div>
      </div>

      <div className="ah-container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 xl:py-40">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {/* Left Side - Cart Items */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <CartItems 
              cart={cart} 
              onUpdateQty={updateQty} 
              onRemoveItem={removeItem} 
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
