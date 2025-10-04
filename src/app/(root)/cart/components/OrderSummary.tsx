"use client";

import React from "react";

interface OrderSummaryProps {
  summary: {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
  };
  onCheckout: () => void;
}

export default function OrderSummary({ summary, onCheckout }: OrderSummaryProps) {

  return (
    <div className="space-y-6 sm:space-y-8 sticky top-4 lg:top-8">
      {/* Order Summary Card */}
      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl sm:rounded-2xl shadow-xl border border-orange-100 ">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

        {/* Summary Details */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between text-base sm:text-lg text-gray-600">
            <span>Sub Total</span>
            <span className="font-semibold">{summary.subtotal.toFixed(0)} USD</span>
          </div>
          <div className="flex justify-between text-base sm:text-lg text-gray-600">
            <span>Discount</span>
            <span className="text-gray-600 font-semibold">{summary.discount.toFixed(0)} USD</span>
          </div>
          
          <div className="border-t-2 border-orange-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-900">
              <span>Subtotal</span>
              <span>${summary.total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              * Delivery fee and taxes will be calculated at checkout
            </p>
          </div>
        </div>

        {/* Warranty Information */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl border border-orange-200">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm sm:text-base text-gray-700">
              {" 90 Day Limited Warranty against manufacturer's defects"}
              <button className="text-orange-600 hover:underline font-semibold">Details</button>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-orange-600 to-red-500 text-white py-2.5 sm:py-4 px-4 sm:px-8 rounded-lg sm:rounded-xl font-semibold text-base sm:text-xl hover:from-orange-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Checkout Now
        </button>
      </div>

    </div>
  );
}
