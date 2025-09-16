'use client';
import React, { useState, useEffect } from 'react';
import { 
    Store,
    AlertCircle
} from 'lucide-react';
import { useRestaurants, useUpdateRestaurant } from '@/hooks/restaurant.hook';

const SettingsForm: React.FC = () => {
    const [isShopOpen, setIsShopOpen] = useState(true);
    
    // Get restaurants data
    const { restaurants, loading, refetch } = useRestaurants();
    
    // Update restaurant hook
    const { updateRestaurant, loading: updateLoading } = useUpdateRestaurant();

    // Set initial shop status based on API data
    useEffect(() => {
        if (restaurants && restaurants.length > 0) {
            const currentStatus = restaurants[0].shop_status;
            setIsShopOpen(currentStatus === 'open');
        }
    }, [restaurants]);

    const handleShopToggle = async () => {
        if (!restaurants || restaurants.length === 0) return;
        
        const restaurant = restaurants[0];
        const newStatus = isShopOpen ? 'close' : 'open';
        
        try {
            await updateRestaurant(restaurant.id, {
                shop_status: newStatus
            });
            
            // Update local state
            setIsShopOpen(!isShopOpen);
            
            // Refresh data
            refetch();
            
            console.log('Shop status changed:', newStatus);
        } catch (error) {
            console.error('Failed to update shop status:', error);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Shop Settings</h3>
                
                <div className="space-y-6">
                    {/* Shop Status Toggle */}
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Store className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Open Shop</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    By turning this on, your restaurant will start taking orders from customers. 
                                    When turned off, customers {"won't "} be able to place new orders, but existing orders will continue to be processed.
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                        isShopOpen 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${
                                            isShopOpen ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        {isShopOpen ? 'Currently Open' : 'Currently Closed'}
                                    </div>
                                    {!isShopOpen && (
                                        <div className="flex items-center gap-1 text-orange-600 text-xs">
                                            <AlertCircle size={12} />
                                            <span>Not taking orders</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Toggle Switch */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleShopToggle}
                                disabled={loading || updateLoading}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 ${
                                    isShopOpen ? 'bg-orange-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        isShopOpen ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsForm;
