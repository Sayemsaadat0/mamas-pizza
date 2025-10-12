'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import ProfileTab from './ProfileTab'
import ProfileInfoTab from './ProfileInfoTab'
import DeliveryAddressTab from './DeliveryAddressTab'
import ChangePasswordTab from './ChangePasswordTab'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UnauthorizedAccess from '@/components/ui/UnauthorizedAccess'

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isAuthenticated) {
    return <UnauthorizedAccess />
  }

  if (!user) {
    return <LoadingSpinner message="Loading user data..." />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfoTab />
      case 'address':
        return <DeliveryAddressTab />
      case 'password':
        return <ChangePasswordTab />
      default:
        return <ProfileInfoTab />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-[224px]">
        <ProfileTab activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  )
}

export default ProfilePage
