"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Clock, UserPlus, Star } from 'lucide-react';
import Link from 'next/link';
import { useGuest } from '@/lib/guest/GuestProvider';
import { toast } from 'sonner';
import { GUEST_STRIPE_VERIFY_PAYMENT_API } from '@/app/api';

interface PaymentVerificationResult {
  success: boolean;
  message: string;
  data?: {
    order_id: number;
    order_number: string;
    payment_status: string;
    total_amount: string;
    customer_email?: string;
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { guestId } = useGuest();
  
  const [verificationResult, setVerificationResult] = useState<PaymentVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !guestId) {
        setVerificationResult({
          success: false,
          message: 'Missing session ID or guest ID'
        });
        setIsVerifying(false);
        return;
      }

      // Create cache key based on session ID and guest ID
      const cacheKey = `payment_verification_${sessionId}_${guestId}`;
      
      // Check if we have cached data first
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          // Check if cache is not too old (24 hours)
          const cacheTime = parsedCache.timestamp;
          const now = Date.now();
          const cacheAge = now - cacheTime;
          const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (cacheAge < maxCacheAge) {
            // Use cached data
            setVerificationResult(parsedCache.data);
            if (parsedCache.data.success) {
              toast.success('Payment verified successfully!');
            } else {
              toast.error(parsedCache.data.message || 'Payment verification failed');
            }
            setIsVerifying(false);
            return;
          } else {
            // Cache is too old, remove it
            localStorage.removeItem(cacheKey);
          }
        }
      } catch (error) {
        // If there's an error parsing cached data, remove it and continue with API call
        console.warn('Error parsing cached payment data:', error);
        localStorage.removeItem(cacheKey);
      }

      // No valid cache found, make API call
      try {
        const response = await fetch(GUEST_STRIPE_VERIFY_PAYMENT_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId, guest_id: guestId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to verify guest payment');
        }

        const result = await response.json();
        setVerificationResult(result);
        
        // Cache the successful result
        if (result.success) {
          const cacheData = {
            data: result,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          toast.success('Payment verified successfully!');
        } else {
          toast.error(result.message || 'Payment verification failed');
        }
      } catch (err: any) {
        setVerificationResult({
          success: false,
          message: err.message || 'Payment verification failed'
        });
        toast.error('Payment verification failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, guestId]);

  const handleLoginClick = () => {
    // Save email to localStorage if available
    if (verificationResult?.data?.customer_email) {
      localStorage.setItem('loginEmail', verificationResult.data.customer_email);
    }
    // Navigate to login page
    router.push('/login');
  };

  // Function to clear cache (can be called when needed)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clearPaymentCache = () => {
    if (sessionId && guestId) {
      const cacheKey = `payment_verification_${sessionId}_${guestId}`;
      localStorage.removeItem(cacheKey);
    }
  };

  // Utility function to clear all payment verification caches
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clearAllPaymentCaches = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('payment_verification_')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Clear cache when component unmounts (optional - uncomment if needed)
  // useEffect(() => {
  //   return () => {
  //     clearPaymentCache();
  //   };
  // }, [sessionId, guestId]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {isVerifying ? (
          <div className="space-y-6">
            <Clock className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              Order is placed
            </h1>
            <p className="text-gray-600">
              Verifying your payment...
            </p>
          </div>
        ) : verificationResult?.success && verificationResult.data ? (
          <div className="space-y-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              Order is placed
            </h1>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold text-gray-900">
                  {verificationResult.data.order_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-900">
                  {verificationResult.data.order_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-semibold text-green-600 capitalize">
                  {verificationResult.data.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">
                  ${verificationResult.data.total_amount}
                </span>
              </div>
            </div>
            
            {/* Login Attraction Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-orange-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Join Our Family!
                </h3>
                <Star className="w-6 h-6 text-orange-500 ml-2" />
              </div>
              <p className="text-gray-700 mb-4 text-sm">
                Create an account to track your orders, save your favorite items, 
                and get exclusive deals and promotions!
              </p>
              <button
                onClick={handleLoginClick}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up / Login
              </button>
            </div>

            <Link
              href="/"
              className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Please wait while we verify your order...
            </h1>
            <p className="text-gray-600">
              We are confirming your payment. This may take a few moments.
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <Clock className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900">
            Order is placed
          </h1>
          <p className="text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
