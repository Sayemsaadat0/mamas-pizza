"use client";

import { useState, useEffect } from 'react';
import { useDeliveryAddresses, useCreateDeliveryAddress, useUpdateDeliveryAddress, DeliveryAddress, CreateDeliveryAddressData } from '@/hooks/delivery-address.hook';
import { useMeAPI } from '@/hooks/useMeAPI.hook';
import { useAuth } from '@/lib/auth/useAuth';
import { useNotification } from '@/components/ui/NotificationProvider';
import { MapPin, Home, Hash, MessageSquare, Save, Edit3, X } from 'lucide-react';

const DeliveryAddressForm = () => {
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const { refetch: refetchMe, loading: meLoading } = useMeAPI();
  const { addresses, loading: fetchLoading, fetchAddresses } = useDeliveryAddresses();
  const { createAddress, loading: createLoading } = useCreateDeliveryAddress();
  const { updateAddress, loading: updateLoading } = useUpdateDeliveryAddress();

  const [formData, setFormData] = useState({
    address_line_1: '',
    address_line_2: '',
    post_code: '',
    details: ''
  });

  const [existingAddress, setExistingAddress] = useState<DeliveryAddress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing delivery address on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  // Set form data when addresses are fetched
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const firstAddress = addresses[0];
      setExistingAddress(firstAddress);
      setFormData({
        address_line_1: firstAddress.address_line_1 || '',
        address_line_2: firstAddress.address_line_2 || '',
        post_code: firstAddress.post_code || '',
        details: firstAddress.details || ''
      });
    } else {
      // Reset form if no addresses found
      setExistingAddress(null);
      setFormData({
        address_line_1: '',
        address_line_2: '',
        post_code: '',
        details: ''
      });
      setIsEditing(true); // Allow editing for new addresses
    }
  }, [addresses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showNotification({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to save your delivery address',
      });
      return;
    }

    // Basic validation
    if (!formData.address_line_1.trim() || !formData.post_code.trim()) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Address line 1 and post code are required',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingAddress) {
        // Update existing address
        await updateAddress(existingAddress.id, formData);
        showNotification({
          type: 'success',
          title: 'Success',
          message: 'Delivery address updated successfully!',
        });
      } else {
        // Create new address
        const addressData: CreateDeliveryAddressData = {
          address_line_1: formData.address_line_1.trim(),
          address_line_2: formData.address_line_2.trim(),
          post_code: formData.post_code.trim(),
          details: formData.details.trim()
        };
        await createAddress(addressData);
        showNotification({
          type: 'success',
          title: 'Success',
          message: 'Delivery address created successfully!',
        });
      }
      
      // Refresh addresses and user data after successful operation
      await Promise.all([
        fetchAddresses(),
        refetchMe()
      ]);
      setIsEditing(false);
    } catch (error: any) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save delivery address',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (existingAddress) {
      setFormData({
        address_line_1: existingAddress.address_line_1 || '',
        address_line_2: existingAddress.address_line_2 || '',
        post_code: existingAddress.post_code || '',
        details: existingAddress.details || ''
      });
    }
  };

  const isLoading = fetchLoading || createLoading || updateLoading || isSubmitting || meLoading;

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-600">Please log in to manage your delivery address.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Delivery Address</h3>
        
        {existingAddress && !isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Edit3 size={16} />
            Edit Address
          </button>
        ) : existingAddress && isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-sm text-gray-600 mb-6">
        {existingAddress 
          ? 'Manage your delivery address information below.' 
          : 'Add your delivery address information below.'
        }
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Line 1 */}
        <div>
          <label htmlFor="address_line_1" className="block text-sm font-semibold text-gray-700 mb-2">
            Address Line 1 *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin size={20} className="text-gray-400" />
            </div>
            <input
              id="address_line_1"
              name="address_line_1"
              type="text"
              value={formData.address_line_1}
              onChange={handleInputChange}
              placeholder="e.g., House 10, Road 5, Dhaka"
              disabled={!isEditing || isLoading}
              className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 ${
                isEditing 
                  ? 'border-gray-200 bg-white' 
                  : 'border-gray-100 bg-gray-50'
              }`}
              required
            />
          </div>
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="address_line_2" className="block text-sm font-semibold text-gray-700 mb-2">
            Address Line 2
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Home size={20} className="text-gray-400" />
            </div>
            <input
              id="address_line_2"
              name="address_line_2"
              type="text"
              value={formData.address_line_2}
              onChange={handleInputChange}
              placeholder="e.g., Near the main gate, 2nd floor"
              disabled={!isEditing || isLoading}
              className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 ${
                isEditing 
                  ? 'border-gray-200 bg-white' 
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
        </div>

        {/* Post Code */}
        <div>
          <label htmlFor="post_code" className="block text-sm font-semibold text-gray-700 mb-2">
            Post Code *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Hash size={20} className="text-gray-400" />
            </div>
            <input
              id="post_code"
              name="post_code"
              type="text"
              value={formData.post_code}
              onChange={handleInputChange}
              placeholder="e.g., 1200"
              disabled={!isEditing || isLoading}
              className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 ${
                isEditing 
                  ? 'border-gray-200 bg-white' 
                  : 'border-gray-100 bg-gray-50'
              }`}
              required
            />
          </div>
        </div>

        {/* Delivery Instructions */}
        <div>
          <label htmlFor="details" className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Instructions
          </label>
          <div className="relative">
            <div className="absolute top-3 left-4 pointer-events-none">
              <MessageSquare size={20} className="text-gray-400" />
            </div>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              placeholder="e.g., Please call before delivery"
              rows={3}
              disabled={!isEditing || isLoading}
              className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none ${
                isEditing 
                  ? 'border-gray-200 bg-white' 
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
        </div>

        {/* Submit Button for new addresses */}
        {!existingAddress && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <Save size={20} />
              {isLoading ? 'Creating Address...' : 'Save Address'}
            </button>
          </div>
        )}
      </form>

      {existingAddress && !isEditing && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm font-medium text-green-800">
              You have an existing delivery address saved
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressForm;