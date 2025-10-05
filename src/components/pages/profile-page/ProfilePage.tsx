'use client'

import React, { useState, useEffect } from 'react'
import { useAuth, authAPI } from '@/lib/auth/useAuth'
import { useNotification } from '@/components/ui/NotificationProvider'
import ProfileHeader from './ProfileHeader'
import ProfileCard from './ProfileCard'
import ProfileForm from './ProfileForm'
import ProfileActions from './ProfileActions'
import DeliveryAddressForm from './DeliveryAddressForm'
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



  if (!isAuthenticated) {
    return <UnauthorizedAccess />
  }

  if (!user) {
    return <LoadingSpinner message="Loading user data..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <ProfileHeader 
        title="My Profile" 
        subtitle="Manage your account information and preferences" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
        <div className="mt-16">
          <DeliveryAddressForm />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
