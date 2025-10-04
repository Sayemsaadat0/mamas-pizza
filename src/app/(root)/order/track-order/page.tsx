"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGuest } from '@/lib/guest/GuestProvider';
import { Clock, Phone, Mail, Package, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/app/api';

const OrderTrackingContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id') || searchParams.get('id');
    const { guestId } = useGuest();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || !guestId) {
                setError('Order ID and Guest ID are required');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const url = `${API_BASE_URL}/api/v1/guest/orders/${orderId}?guest_id=${guestId}`;
                console.log('Fetching order:', url);

                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Order not found');
                    }
                    throw new Error('Failed to fetch order');
                }

                const result = await response.json();
                console.log('Order data:', result);
                setOrder(result.data);
            } catch (err: any) {
                console.error('Error fetching order:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, guestId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <Clock className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-medium text-white mb-2">Loading Order</h2>
                        <p className="text-orange-100">Please wait while we fetch your order...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-medium text-white mb-2">Order Not Found</h2>
                        <p className="text-orange-100 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-gray-900 mb-2">No Order Found</h2>
                    <p className="text-gray-600">The order doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' };
            case 'confirmed':
                return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Confirmed' };
            case 'preparing':
                return { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Preparing' };
            case 'ready':
                return { color: 'text-green-600', bg: 'bg-green-50', label: 'Ready' };
            case 'out_for_delivery':
                return { color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Out for Delivery' };
            case 'delivered':
                return { color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' };
            case 'cancelled':
                return { color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' };
            default:
                return { color: 'text-gray-600', bg: 'bg-gray-50', label: status };
        }
    };

    const getPaymentStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return { color: 'text-green-600', bg: 'bg-green-50', label: 'Paid' };
            case 'pending':
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' };
            case 'failed':
                return { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' };
            case 'refunded':
                return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Refunded' };
            default:
                return { color: 'text-gray-600', bg: 'bg-gray-50', label: status };
        }
    };

    const orderStatus = getStatusInfo(order.status);
    const paymentStatus = getPaymentStatusInfo(order.payment_status);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
                <div className="max-w-4xl pt-20 md:pt-40 mx-auto px-4 text-center">
                    {/* <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div> */}
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Order #{order.order_number}</h1>
                    <p className="text-xl text-orange-100">Track your delicious order</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Status Card */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <p className="text-sm text-gray-600 mb-2">Order Status</p>
                            <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${orderStatus.bg} ${orderStatus.color}`}>
                                {orderStatus.label}
                            </span>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                            <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${paymentStatus.bg} ${paymentStatus.color}`}>
                                {paymentStatus.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                    <div className="space-y-4">
                        {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.item_name}</h3>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-gray-900">${item.total_price}</p>
                                    <p className="text-sm text-gray-500">${item.unit_price} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Layout for Summary and Customer Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Order Summary */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="font-medium text-gray-900">${order.subtotal}</span>
                            </div>
                            {parseFloat(order.delivery_fee) > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-700">Delivery Fee</span>
                                    <span className="font-medium text-gray-900">${order.delivery_fee}</span>
                                </div>
                            )}
                            {parseFloat(order.tax_amount) > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-700">Tax</span>
                                    <span className="font-medium text-gray-900">${order.tax_amount}</span>
                                </div>
                            )}
                            {parseFloat(order.discount_amount) > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-700">Discount</span>
                                    <span className="font-semibold text-green-600">-${order.discount_amount}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between">
                                    <span className="text-xl font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-orange-600">${order.total_amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{order.customer_email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium text-gray-900">{order.customer_phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Special Instructions */}
                {order.special_instructions && (
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Instructions</h2>
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <p className="text-gray-800">{order.special_instructions}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderTrackingPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
                    <div className="max-w-4xl pt-20 md:pt-40 mx-auto px-4 text-center">
                        <Clock className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-medium text-white mb-2">Loading Order</h2>
                        <p className="text-orange-100">Please wait while we fetch your order...</p>
                    </div>
                </div>
            </div>
        }>
            <OrderTrackingContent />
        </Suspense>
    );
};

export default OrderTrackingPage;