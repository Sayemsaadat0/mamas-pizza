"use client";

import React from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
  description: string;
  color: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  summary: {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
  };
  onConfirmOrder: () => void;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  summary, 
  onConfirmOrder 
}: CheckoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Confirm Your Order
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-gray-600">
            Review your order details and confirm your purchase
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-6 sm:mt-8">
          {/* Left Side - Order Details */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Items</h3>
            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl border border-orange-200">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 640px) 64px, 80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{item.name}</h4>
                    <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg text-gray-700 font-semibold">Qty: {item.qty}</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Payment & Summary */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Payment Summary</h3>
            
            {/* Order Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-orange-200">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-base sm:text-lg">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900 font-semibold">{summary.subtotal.toFixed(0)} USD</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg">
                  <span className="text-gray-700">Discount</span>
                  <span className="text-gray-700 font-semibold">{summary.discount.toFixed(0)} USD</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg">
                  <span className="text-gray-700">Delivery Fee</span>
                  <span className="text-gray-900 font-semibold">{summary.delivery.toFixed(2)} USD</span>
                </div>
                <div className="border-t-2 border-orange-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
                  <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>${summary.total.toFixed(0)} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200 mb-6 sm:mb-8">
              <Lock size={18} className="sm:w-5 sm:h-5 text-green-600" />
              <span className="text-sm sm:text-lg text-green-800 font-medium">
                Your payment information is secure and encrypted
              </span>
            </div>

            {/* Confirm Order Button */}
            <button
              onClick={onConfirmOrder}
              className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-lg sm:text-xl hover:from-orange-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Lock size={20} className="sm:w-6 sm:h-6" />
              Confirm Order
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
