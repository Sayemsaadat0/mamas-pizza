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
} from "lucide-react";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: string; // keep as string to match existing card design
  image: string;
}

const menuTabs = [
  { name: "All", icon: Utensils },
  { name: "Burgers", icon: Sandwich },
  { name: "Pizza", icon: Pizza },
  { name: "Drinks", icon: Coffee },
];

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Cheese Burger",
    description: "Juicy beef patty with cheese",
    price: "$8.99",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Classic Italian pizza",
    price: "$12.99",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Coke",
    description: "Refreshing drink",
    price: "$2.50",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    name: "Veggie Burger",
    description: "Healthy and tasty",
    price: "$9.50",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    name: "Margherita Pizza",
    description: "Fresh tomatoes & basil",
    price: "$11.50",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    name: "Orange Juice",
    description: "Freshly squeezed",
    price: "$3.00",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 7,
    name: "Chicken Wings",
    description: "Crispy wings with hot sauce",
    price: "$10.99",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 8,
    name: "Caesar Salad",
    description: "Fresh greens with parmesan",
    price: "$7.99",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 9,
    name: "BBQ Ribs",
    description: "Smoky and tender ribs",
    price: "$15.99",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 10,
    name: "Fish Tacos",
    description: "Fresh fish with salsa",
    price: "$13.50",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 11,
    name: "Chocolate Cake",
    description: "Rich and decadent",
    price: "$6.99",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 12,
    name: "Iced Coffee",
    description: "Smooth and refreshing",
    price: "$4.50",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
];

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const filteredItems = useMemo(() => {
    const byTab =
      activeTab === "All"
        ? foodItems
        : foodItems.filter((item) =>
            item.name.toLowerCase().includes(activeTab.toLowerCase())
          );

    if (!query.trim()) return byTab;
    const q = query.toLowerCase();
    return byTab.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [activeTab, query]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, query]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-white py-10 md:py-14">
      <div className="ah-container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
            Our Menu
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gray-900">Taste the </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Best Bites</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search and filter through our delicious dishes. Order your favorites in seconds.
          </p>
        </div>

        {/* Controls: Search + Tabs */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for burgers, pizza, drinks..."
                className="w-full rounded-2xl border-2 border-gray-100 focus:border-orange-300 outline-none px-4 py-3 pl-11 text-sm shadow-sm"
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-3 pb-1 md:pb-0 md:flex-wrap md:justify-end scrollbar-hide">
              {menuTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`group relative px-4 py-2 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 flex-shrink-0 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-200"
                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-100 hover:border-orange-200"
                    }`}
                  >
                    <Icon size={18} className={`transition-all ${isActive ? "text-white" : "text-gray-500 group-hover:text-orange-600"}`} />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <span className="text-sm text-gray-500">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </span>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or switching category.</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredItems.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// Reusable card: same visual design as in MenuSection
function FoodCard({ item }: { item: FoodItem }) {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      {/* Image Container */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Popular
          </span>
        </div>

        {/* Quick Add Button */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="bg-white/90 backdrop-blur-sm text-orange-600 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
            {item.name}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 font-medium">4.8</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Price and Order Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-2xl text-orange-600">{item.price}</span>
            <span className="text-sm text-gray-500 line-through">$12.99</span>
          </div>

          <button className="bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 group/btn">
            <ShoppingCart size={18} />
            Order
          </button>
        </div>
      </div>
    </div>
  );
}