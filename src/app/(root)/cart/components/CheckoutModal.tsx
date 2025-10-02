"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GuestOrderForm, { GuestOrderData } from "./GuestOrderForm";
import { useAuth } from "@/lib/auth/useAuth";
import { useCreateOrder } from "@/hooks/order.hook";
import { useCreateGuestOrder } from "@/hooks/guest-order.hook";
import { useCreateGuestStripeSession } from "@/hooks/guest-payment.hook";
import { useGuest } from "@/lib/guest/GuestProvider";
import { toast } from "sonner";

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
  onConfirmOrder: (guestData?: GuestOrderData) => void;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  summary, 
  onConfirmOrder 
}: CheckoutModalProps) {
  const { isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [guestData, setGuestData] = useState<GuestOrderData | null>(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  
  // Order creation hooks
  const { createOrder, loading: createOrderLoading } = useCreateOrder();
  const { createGuestOrder, loading: createGuestOrderLoading } = useCreateGuestOrder();
  const { createSession, loading: createSessionLoading } = useCreateGuestStripeSession();

  const handleGuestFormSubmit = (data: GuestOrderData) => {
    setGuestData(data);
    setShowGuestForm(false);
  };

  const handleConfirmOrder = async () => {
    if (!isAuthenticated && !guestData) {
      setShowGuestForm(true);
      return;
    }

    try {
      if (isAuthenticated) {
        // Create order for authenticated user
        const orderData = {
          delivery_address_id: 1, // TODO: Get from user's delivery addresses
          delivery_type: "delivery" as const,
          payment_method: "stripe" as const,
          tax_rate: 0,
          delivery_fee: 0,
          discount_amount: 0,
          special_instructions: "",
        };
        
        await createOrder(orderData);
        toast.success("Order created successfully!");
        onConfirmOrder();
      } else {
        // Create order for guest user
        if (!guestId) {
          toast.error("Guest ID not found. Please refresh and try again.");
          return;
        }

        const guestOrderData = {
          guest_id: guestId,
          delivery_type: "delivery" as const,
          customer_name: guestData!.customer_name,
          customer_phone: guestData!.customer_phone,
          customer_email: guestData!.customer_email,
          delivery_address: {
            fields: "Delivery Address", // Default field name
            address_line_1: guestData!.delivery_address.address_line_1,
            address_line_2: guestData!.delivery_address.address_line_2,
            zip_code: guestData!.delivery_address.zip_code,
            details: guestData!.delivery_address.details,
          },
          special_instructions: guestData!.special_instructions || "",
          payment_method: "stripe" as const,
          tax_rate: 0,
          delivery_fee: 0,
          discount_amount: 0,
        };

        const orderResult = await createGuestOrder(guestOrderData);
        toast.success("Order created successfully!");
        
        // Create payment session for guest order
        try {
          const paymentData: { order_id: number; guest_id: string } = {
            order_id: orderResult.id,
            guest_id: guestId,
          };
          
          const sessionResult = await createSession(paymentData);
          
          if (sessionResult.session_url) {
            toast.success("Redirecting to payment...");
            // Navigate to Stripe checkout session
            window.location.href = sessionResult.session_url;
          } else {
            toast.error("Payment session creation failed");
          }
        } catch (paymentError: any) {
          console.error("Error creating payment session:", paymentError);
          toast.error("Order created but payment session failed. Please contact support.");
        }
        
        onConfirmOrder(guestData || undefined);
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order. Please try again.");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Confirm Your Order
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-gray-600">
            Review your order details and confirm your purchase
          </DialogDescription>
        </DialogHeader>

        {showGuestForm ? (
          <div className="mt-6 sm:mt-8">
            <GuestOrderForm onSubmit={handleGuestFormSubmit} loading={createGuestOrderLoading} />
          </div>
        ) : (
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
                    <span className="text-gray-900 font-semibold">${summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg">
                    <span className="text-gray-700">Discount</span>
                    <span className="text-gray-700 font-semibold">${summary.discount.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-orange-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
                    <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>${summary.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      * Delivery fee and taxes will be calculated at checkout
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Information Display */}
              {!isAuthenticated && guestData && (
                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {guestData.customer_name}</p>
                    <p><strong>Phone:</strong> {guestData.customer_phone}</p>
                    <p><strong>Email:</strong> {guestData.customer_email}</p>
                    <p><strong>Address:</strong> {guestData.delivery_address.address_line_1}</p>
                    {guestData.delivery_address.address_line_2 && (
                      <p><strong>Address 2:</strong> {guestData.delivery_address.address_line_2}</p>
                    )}
                    <p><strong>ZIP:</strong> {guestData.delivery_address.zip_code}</p>
                    {guestData.special_instructions && (
                      <p><strong>Instructions:</strong> {guestData.special_instructions}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200 mb-6 sm:mb-8">
                <Lock size={18} className="sm:w-5 sm:h-5 text-green-600" />
                <span className="text-sm sm:text-lg text-green-800 font-medium">
                  Your payment information is secure and encrypted
                </span>
              </div>

              {/* Confirm Order Button */}
              <button
                onClick={handleConfirmOrder}
                disabled={createOrderLoading || createGuestOrderLoading || createSessionLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-lg sm:text-xl hover:from-orange-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {createOrderLoading || createGuestOrderLoading || createSessionLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {createSessionLoading ? "Creating Payment Session..." : "Creating Order..."}
                  </div>
                ) : (
                  <>
                    <Lock size={20} className="sm:w-6 sm:h-6" />
                    {!isAuthenticated && !guestData ? "Continue to Delivery Info" : "Confirm Order"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
