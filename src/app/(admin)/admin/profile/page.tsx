'use client';
import React, { useState } from 'react';
import {
    User,
    Lock
} from 'lucide-react';
import ProfileForm from '@/components/admin/ProfileForm';
import PasswordChangeForm from '@/components/admin/PasswordChangeForm';
import { useAuth } from '@/lib/auth/AuthContext';

const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, loading } = useAuth();

    // Owner data from auth context
    const [ownerData, setOwnerData] = useState({
        fullName: user?.name || '',
        shopName: 'Delicious Bites Restaurant', // This would come from restaurant data
        email: user?.email || '',
        address: '123 Main Street, New York, NY 10001' // This would come from restaurant data
    });

    // Update owner data when user data changes
    React.useEffect(() => {
        if (user) {
            setOwnerData(prev => ({
                ...prev,
                fullName: user.name,
                email: user.email
            }));
        }
    }, [user]);

    const handleProfileSave = (data: any) => {
        setOwnerData(data);
        // Here you would call an API to update user profile
        console.log('Updating profile:', data);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8">Please log in to view your profile.</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Owner Profile</h1>
                    <p className="text-gray-600">Manage your restaurant owner information</p>
                    <p className="text-sm text-gray-500 mt-1">Logged in as: {user.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'profile'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                Profile Information
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'password'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Lock size={16} />
                                Change Password
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
                <div>
                    <ProfileForm
                        ownerData={ownerData}
                        onSave={handleProfileSave}
                    />
                </div>
            )}

            {/* Password Change Tab */}
            {activeTab === 'password' && (
                <PasswordChangeForm />
            )}
        </div>
    );
};

export default ProfilePage;
