'use client'

import React from 'react'

interface ProfileHeaderProps {
  title: string
  subtitle: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  )
}

export default ProfileHeader
