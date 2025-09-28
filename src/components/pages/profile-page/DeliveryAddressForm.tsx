"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Save, X, Edit3 } from 'lucide-react';
import { useCreateDeliveryAddress, useUpdateDeliveryAddress, DeliveryAddress } from '@/hooks/delivery-address.hook';
import { useNotification } from '@/components/ui/NotificationProvider';
// import { useNotification } from '@/lib/auth/useAuth';

interface DeliveryAddressFormProps {
  address?: DeliveryAddress | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function DeliveryAddressForm({ 
  address, 
  onSuccess, 
  onCancel, 
  isEditing = false 
}: DeliveryAddressFormProps) {
  const { showNotification } = useNotification();
  const { createAddress, loading: createLoading } = useCreateDeliveryAddress();
  const { updateAddress, loading: updateLoading } = useUpdateDeliveryAddress();
  
  const [formData, setFormData] = useState({
    fields: '',
    city: '',
    country: '',
    zip_code: '',
    road_no: '',
    house_no: '',
    details: '',
  });

  const loading = createLoading || updateLoading;

  // Initialize form data when address is provided
  useEffect(() => {
    if (address) {
      setFormData({
        fields: address.fields || '',
        city: address.city || '',
        country: address.country || '',
        zip_code: address.zip_code || '',
        road_no: address.road_no || '',
        house_no: address.house_no || '',
        details: address.details || '',
      });
    }
  }, [address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      
      if (isEditing && address) {
        // Update existing address
        result = await updateAddress(address.id, formData);
      } else {
        // Create new address
        result = await createAddress(formData);
      }

      if (result?.success) {
        showNotification({
          type: 'success',
          title: 'Success',
          message: isEditing 
            ? 'Delivery address updated successfully' 
            : 'Delivery address created successfully',
        });
        onSuccess?.();
      } else {
        showNotification({
          type: 'error',
          title: 'Error',
          message: result?.message || 'Failed to save delivery address',
        });
      }
    } catch (error: any) {
      console.error('Error saving delivery address:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save delivery address',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Delivery Address' : 'Add Delivery Address'}
          </h3>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Area/Fields *
            </label>
            <input
              type="text"
              name="fields"
              value={formData.fields}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Residential Area, Downtown"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Dhaka"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Bangladesh"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., 1200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Road Number *
            </label>
            <input
              type="text"
              name="road_no"
              value={formData.road_no}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Road 5"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              House Number *
            </label>
            <input
              type="text"
              name="house_no"
              value={formData.house_no}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., House 10"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Details
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
            placeholder="e.g., Near the main gate, 2nd floor, Landmark details..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isEditing ? 'Update Address' : 'Save Address'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

