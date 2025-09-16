"use client";

import React from 'react';
import { useRestaurants, useCreateRestaurant, useUpdateRestaurant, useDeleteRestaurant } from '@/hooks/restaurant.hook';

export default function RestaurantExample() {
  // Get all restaurants
  const { restaurants, loading, error, refetch } = useRestaurants();
  
  // Create restaurant
  const { createRestaurant, loading: createLoading } = useCreateRestaurant();
  
  // Update restaurant
  const { updateRestaurant, loading: updateLoading } = useUpdateRestaurant();
  
  // Delete restaurant
  const { deleteRestaurant, loading: deleteLoading } = useDeleteRestaurant();

  // Create new restaurant
  const handleCreate = async () => {
    const newRestaurant = await createRestaurant({
      name: "My New Restaurant",
      shop_status: "open",
      about: "Great food here!",
      phone: "+1234567890",
      email: "contact@restaurant.com",
      address: "123 Main St"
    });
    
    if (newRestaurant) {
      console.log('Created:', newRestaurant);
      refetch(); 
    }
  };

  // Update restaurant
  const handleUpdate = async (id: number) => {
    const updated = await updateRestaurant(id, {
      name: "Updated Restaurant Name",
      shop_status: "closed"
    });
    
    if (updated) {
      console.log('Updated:', updated);
      refetch(); // Refresh the list
    }
  };

  // Delete restaurant
  const handleDelete = async (id: number) => {
    const result = await deleteRestaurant(id);
    
    if (result) {
      console.log('Deleted:', result);
      refetch(); // Refresh the list
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
            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
            <p className="text-gray-600">Status: {restaurant.shop_status}</p>
            <p className="text-gray-600">Phone: {restaurant.phone || 'N/A'}</p>
            <p className="text-gray-600">Email: {restaurant.email || 'N/A'}</p>
            <p className="text-gray-600">Address: {restaurant.address || 'N/A'}</p>
            
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
        onClick={refetch}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Refresh List
      </button>
    </div>
  );
}
