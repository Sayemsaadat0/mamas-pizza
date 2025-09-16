"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
  description: string;
  color: string;
}

interface CartItemsProps {
  cart: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

export default function CartItems({ cart, onUpdateQty, onRemoveItem }: CartItemsProps) {
  if (cart.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-xl border border-orange-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Your cart is empty</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">Add some delicious food to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden sm:block px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="grid grid-cols-12 gap-4 sm:gap-6 text-sm sm:text-base font-semibold text-orange-800 uppercase tracking-wide">
          <div className="col-span-4">Food Items</div>
          <div className="col-span-3 text-center">Quantity</div>
          <div className="col-span-3 text-right">Total</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-orange-100">
        {cart.map((item) => (
          <div key={item.id} className="p-4 sm:px-6 lg:px-8 py-4 sm:py-6 hover:bg-orange-50/50 transition-colors duration-300">
            {/* Mobile Layout */}
            <div className="sm:hidden space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-300 hover:scale-110" 
                    sizes="(max-width: 640px) 64px, 80px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{item.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 border-2 border-orange-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 bg-white shadow-sm">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 grid place-items-center rounded-lg hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <span className="min-w-6 sm:min-w-8 text-center font-bold text-base sm:text-lg text-gray-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, +1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 grid place-items-center rounded-lg hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-300 group/remove"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} className="sm:w-5 sm:h-5 group-hover/remove:scale-110" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:grid grid-cols-12 gap-4 sm:gap-6 items-center">
              {/* Food Items Column */}
              <div className="col-span-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover transition-transform duration-300 hover:scale-110" 
                      sizes="(max-width: 640px) 64px, 80px"
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{item.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>

              {/* Quantity Column */}
              <div className="col-span-3 flex justify-center">
                <div className="flex items-center gap-2 sm:gap-3 border-2 border-orange-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 bg-white shadow-sm">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 grid place-items-center rounded-lg hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <span className="min-w-6 sm:min-w-8 text-center font-bold text-base sm:text-lg text-gray-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, +1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 grid place-items-center rounded-lg hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Total Column */}
              <div className="col-span-3 text-right">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>

              {/* Action Column */}
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-300 group/remove"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} className="sm:w-5 sm:h-5 group-hover/remove:scale-110" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
