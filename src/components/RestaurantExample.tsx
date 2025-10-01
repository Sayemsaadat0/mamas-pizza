"use client";

import React from 'react';
import { useRestaurants, useCreateRestaurant, useUpdateRestaurant, useDeleteRestaurant } from '@/hooks/restaurant.hook';

export default function RestaurantExample() {
  // Get all restaurants
  const { restaurants, loading, error, fetchRestaurants } = useRestaurants();
  
  // Create restaurant
  const { createRestaurant, loading: createLoading } = useCreateRestaurant();
  
  // Update restaurant
  const { updateRestaurant, loading: updateLoading } = useUpdateRestaurant();
  
  // Delete restaurant
  const { deleteRestaurant, loading: deleteLoading } = useDeleteRestaurant();

  // Create new restaurant
  const handleCreate = async () => {
    const newRestaurant = await createRestaurant({
      privacy_policy: "This is our privacy policy content...",
      terms: "These are our terms and conditions...",
      refund_process: "Our refund process details...",
      license: "Restaurant license information...",
      isShopOpen: true,
      shop_name: "Mama's Pizza Restaurant",
      shop_address: "123 Main Street, City, State, ZIP Code",
      shop_details: "We serve the best pizza in town with fresh ingredients and fast delivery."
    });
    
    if (newRestaurant) {
      console.log('Created:', newRestaurant);
      fetchRestaurants(); 
    }
  };

  // Update restaurant
  const handleUpdate = async (id: number) => {
    const updated = await updateRestaurant(id, {
      shop_name: "Updated Restaurant Name",
      isShopOpen: false
    });
    
    if (updated) {
      console.log('Updated:', updated);
      fetchRestaurants(); // Refresh the list
    }
  };

  // Delete restaurant
  const handleDelete = async (id: number) => {
    const result = await deleteRestaurant(id);
    
    if (result) {
      console.log('Deleted:', result);
      fetchRestaurants(); // Refresh the list
    }
  };

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Restaurants</h1>
      
      {/* Create Button */}
      <button 
        onClick={handleCreate}
        disabled={createLoading}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {createLoading ? 'Creating...' : 'Create Restaurant'}
      </button>

      {/* Restaurants List */}
      <div className="space-y-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{restaurant.shop_name}</h3>
            <p className="text-gray-600">Status: {restaurant.isShopOpen ? 'Open' : 'Closed'}</p>
            <p className="text-gray-600">Address: {restaurant.shop_address}</p>
            <p className="text-gray-600">Details: {restaurant.shop_details}</p>
            
            <div className="mt-3 space-x-2">
              <button 
                onClick={() => handleUpdate(restaurant.id)}
                disabled={updateLoading}
                className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {updateLoading ? 'Updating...' : 'Update'}
              </button>
              
              <button 
                onClick={() => handleDelete(restaurant.id)}
                disabled={deleteLoading}
                className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <button 
        onClick={fetchRestaurants}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Refresh List
      </button>
    </div>
  );
}
