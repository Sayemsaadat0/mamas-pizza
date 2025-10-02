"use client";

import React, { useState } from "react";
import { User, MapPin, MessageSquare } from "lucide-react";

export interface GuestOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: {
    address_line_1: string;
    address_line_2?: string;
    zip_code: string;
    details?: string;
  };
  special_instructions: string;
}

interface GuestOrderFormProps {
  onSubmit: (data: GuestOrderData) => void;
  loading?: boolean;
}

interface GuestOrderFormErrors {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_address?: {
    address_line_1?: string;
    address_line_2?: string;
    zip_code?: string;
    details?: string;
  };
  special_instructions?: string;
}

export default function GuestOrderForm({ onSubmit, loading = false }: GuestOrderFormProps) {
  const [formData, setFormData] = useState<GuestOrderData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: {
      address_line_1: "",
      address_line_2: "",
      zip_code: "",
      details: "",
    },
    special_instructions: "",
  });

  const [errors, setErrors] = useState<GuestOrderFormErrors>({});

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof GuestOrderData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field as keyof GuestOrderData]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: GuestOrderFormErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.customer_phone)) {
      newErrors.customer_phone = "Please enter a valid phone number";
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = "Please enter a valid email address";
    }

    if (!formData.delivery_address.address_line_1.trim()) {
      newErrors.delivery_address = { ...newErrors.delivery_address, address_line_1: "Address line 1 is required" };
    }

    if (!formData.delivery_address.zip_code.trim()) {
      newErrors.delivery_address = { ...newErrors.delivery_address, zip_code: "ZIP code is required" };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-orange-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-600" />
            Customer Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.customer_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1234567890"
              />
              {errors.customer_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange('customer_email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.customer_email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.customer_email && (
              <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Delivery Address
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              value={formData.delivery_address.address_line_1}
              onChange={(e) => handleInputChange('delivery_address.address_line_1', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.delivery_address?.address_line_1 ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main Street"
            />
            {errors.delivery_address?.address_line_1 && (
              <p className="text-red-500 text-sm mt-1">{errors.delivery_address.address_line_1}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.delivery_address.address_line_2}
              onChange={(e) => handleInputChange('delivery_address.address_line_2', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Apt 4B, Suite 200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.delivery_address.zip_code}
                onChange={(e) => handleInputChange('delivery_address.zip_code', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.delivery_address?.zip_code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="12345"
              />
              {errors.delivery_address?.zip_code && (
                <p className="text-red-500 text-sm mt-1">{errors.delivery_address.zip_code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <input
                type="text"
                value={formData.delivery_address.details}
                onChange={(e) => handleInputChange('delivery_address.details', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Ring doorbell twice"
              />
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            Special Instructions
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.special_instructions}
              onChange={(e) => handleInputChange('special_instructions', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              placeholder="Extra napkins please, or any other special requests..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </form>
    </div>
  );
}
