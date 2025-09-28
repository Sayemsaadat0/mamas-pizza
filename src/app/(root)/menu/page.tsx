"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Utensils,
  Pizza,
  Coffee,
  Sandwich,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useMenus, MenuItem } from "@/hooks/menu.hook";
import { useCategories, Category } from "@/hooks/category.hook";

// Legacy interface for backward compatibility
interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category_id?: string;
}

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // API hooks
  const { menus, loading: menusLoading, error: menusError } = useMenus();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // Convert API menu items to legacy format
  const convertMenuItemToFoodItem = (menuItem: MenuItem): FoodItem => ({
    id: parseInt(menuItem.id),
    name: menuItem.name,
    description: menuItem.details,
    price: `$${menuItem.main_price.toFixed(2)}`,
    image: menuItem.thumbnail || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category_id: menuItem.category_id,
  });

  // Get all available items (API data only)
  const allItems = useMemo(() => {
    // Ensure menus is always an array
    const safeMenus = Array.isArray(menus) ? menus : [];
    return safeMenus.map(convertMenuItemToFoodItem);
  }, [menus]);

  // Create dynamic tabs from categories (API data only)
  const dynamicTabs = useMemo(() => {
    const tabs = [{ name: "All", icon: Utensils }];
    // Ensure categories is always an array
    const safeCategories = Array.isArray(categories) ? categories : [];
    safeCategories.forEach(category => {
      const iconMap: { [key: string]: any } = {
        'pizza': Pizza,
        'burgers': Sandwich,
        'drinks': Coffee,
        'coffee': Coffee,
      };
      const icon = iconMap[category.name.toLowerCase()] || Utensils;
      tabs.push({ name: category.name, icon });
    });
    return tabs;
  }, [categories]);

  const filteredItems = useMemo(() => {
    const byTab =
      activeTab === "All"
        ? allItems
        : allItems.filter((item) => {
            // Find the category name that matches the active tab
            const category = categories.find(cat => cat.name === activeTab);
            return category && item.category_id === category.id;
          });

    const byQuery = query
      ? byTab.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      : byTab;

    return byQuery;
  }, [allItems, activeTab, query, categories]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to get proper image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
    
    // If it's already a complete URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it starts with storage/, add the API URL
    if (imagePath.startsWith('storage/')) {
      return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
    }
    
    // Handle specific case: "http://localhost:8000storage/" -> "http://localhost:8000/storage/"
    if (imagePath.includes('://') && imagePath.includes('storage/')) {
      return imagePath.replace(/(:\d+)(storage)/, '$1/$2');
    }
    
    // Default: prepend API URL
    return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
  };

  // Reusable card: same visual design as in MenuSection
  function FoodCard({ item }: { item: FoodItem }) {
    return (
      <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
        {/* Image Container */}
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src={getImageUrl(item.image)}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
            {item.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-600">
              {item.price}
            </span>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-orange-600">Delicious</span> Menu
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully crafted dishes made with the finest ingredients
            and prepared with love by our expert chefs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for your favorite dish..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-colors duration-300 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {categoriesLoading ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-3xl p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Loader2 size={32} className="mx-auto animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading categories...</h3>
              <p className="text-gray-500">Please wait while we fetch the menu categories.</p>
            </div>
          </div>
        ) : categoriesError ? (
          <div className="text-center py-8">
            <div className="bg-red-50 rounded-3xl p-8 max-w-md mx-auto">
              <div className="text-red-400 mb-4">
                <Utensils size={32} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Error loading categories</h3>
              <p className="text-red-500">{categoriesError}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {dynamicTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.name
                      ? "bg-orange-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  <Icon size={20} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Menu Items */}
        {menusLoading ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Loader2 size={48} className="mx-auto animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading menu...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest menu items.</p>
            </div>
          </div>
        ) : menusError ? (
          <div className="text-center py-20">
            <div className="bg-red-50 rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-red-400 mb-4">
                <Utensils size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error loading menu</h3>
              <p className="text-red-500 mb-4">{menusError}</p>
              <p className="text-gray-500">Please try again later.</p>
            </div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
            {currentItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Utensils size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No menu available</h3>
              <p className="text-gray-500">
                {query
                  ? `No items match "${query}"`
                  : "No menu items are currently available"}
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredItems.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                    currentPage === page
                      ? "bg-orange-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}