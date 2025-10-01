'use client'

import React, { useState, useEffect } from 'react'
import { useAuth, authAPI } from '@/lib/auth/useAuth'
import { useNotification } from '@/components/ui/NotificationProvider'
import { useDeliveryAddresses, useDeleteDeliveryAddress, DeliveryAddress } from '@/hooks/delivery-address.hook'
import ProfileHeader from './ProfileHeader'
import ProfileCard from './ProfileCard'
import ProfileForm from './ProfileForm'
import ProfileActions from './ProfileActions'
import DeliveryAddressForm from './DeliveryAddressForm'
import DeliveryAddressCard from './DeliveryAddressCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UnauthorizedAccess from '@/components/ui/UnauthorizedAccess'

const ProfilePage = () => {
  const { user, token, isAuthenticated, updateUser, setLoading, loading } = useAuth()
  const { showNotification } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Delivery address state
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null)
  
  // Delivery address hooks
  const { addresses, loading: addressesLoading, fetchAddresses: refetchAddresses } = useDeliveryAddresses()
  const { deleteAddress } = useDeleteDeliveryAddress()

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token) return

    try {
      setLoading(true)

      const result = await authAPI.updateProfile(token, user.id, {
        name: formData.name,
        email: formData.email,
        user_image: selectedImage || undefined,
      })

      if (result.success && result.user) {
        // Update the user data in store (token stays the same)
        updateUser(result.user)
        
        showNotification({
          type: 'success',
          title: 'Success',
          message: result.message || 'Profile updated successfully',
        })
        setIsEditing(false)
        setSelectedImage(null)
        setImagePreview(null)
      } else {
        showNotification({
          type: 'error',
          title: 'Error',
          message: result.message || 'Failed to update profile',
        })
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      showNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update profile',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    handleSubmit(new Event('submit') as any)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setSelectedImage(null)
    setImagePreview(null)
  }

  // Delivery address handlers
  const handleAddAddress = () => {
    setIsAddingAddress(true)
    setEditingAddress(null)
  }

  const handleEditAddress = (address: DeliveryAddress) => {
    setEditingAddress(address)
    setIsAddingAddress(false)
  }

  const handleDeleteAddress = async (address: DeliveryAddress) => {
    if (window.confirm('Are you sure you want to delete this delivery address?')) {
      try {
        const result = await deleteAddress(address.id)
        if (result) {
          showNotification({
            type: 'success',
            title: 'Success',
            message: 'Delivery address deleted successfully',
          })
          refetchAddresses()
        } else {
          showNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete delivery address',
          })
        }
      } catch (error: any) {
        showNotification({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to delete delivery address',
        })
      }
    }
  }

  const handleAddressSuccess = () => {
    setIsAddingAddress(false)
    setEditingAddress(null)
    refetchAddresses()
  }

  const handleAddressCancel = () => {
    setIsAddingAddress(false)
    setEditingAddress(null)
  }


  if (!isAuthenticated) {
    return <UnauthorizedAccess />
  }

  if (!user) {
    return <LoadingSpinner message="Loading user data..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader 
          title="My Profile" 
          subtitle="Manage your account information and preferences" 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <ProfileCard
                    profile={user}
                    isEditing={isEditing}
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                  />
                </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <ProfileActions
              isEditing={isEditing}
              loading={loading}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            
            <ProfileForm
              formData={formData}
              isEditing={isEditing}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onImageChange={handleImageChange}
              selectedImage={selectedImage}
            />
          </div>
        </div>

        {/* Delivery Address Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
              <p className="text-gray-600 mt-1">Manage your delivery addresses for orders</p>
            </div>
            <button
              onClick={handleAddAddress}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Address
            </button>
          </div>

          {/* Delivery Address Form */}
          {(isAddingAddress || editingAddress) && (
            <div className="mb-8">
              <DeliveryAddressForm
                address={editingAddress}
                isEditing={!!editingAddress}
                onSuccess={handleAddressSuccess}
                onCancel={handleAddressCancel}
              />
            </div>
          )}

          {/* Delivery Address List */}
          {addressesLoading ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading addresses...</h3>
                <p className="text-gray-500">Please wait while we fetch your delivery addresses.</p>
              </div>
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <DeliveryAddressCard
                  key={address.id}
                  address={address}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No delivery addresses</h3>
                <p className="text-gray-500 mb-4">You haven&apos;t added any delivery addresses yet.</p>
                <button
                  onClick={handleAddAddress}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Add Your First Address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
