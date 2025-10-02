"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Clock } from 'lucide-react';
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
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
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
        
        if (result.success) {
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
            <Link
              href="/"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Order is placed
            </h1>
            <p className="text-gray-600">
              {verificationResult?.message || 'Payment verification failed'}
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
