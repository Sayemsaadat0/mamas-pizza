'use client'
import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Utensils, Pizza, Coffee, Sandwich } from "lucide-react";

interface FoodItem {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
}

const menuTabs = [
    { name: "All", icon: Utensils },
    { name: "Burgers", icon: Sandwich },
    { name: "Pizza", icon: Pizza },
    { name: "Drinks", icon: Coffee }
];

const foodItems: FoodItem[] = [
    { id: 1, name: "Cheese Burger", description: "Juicy beef patty with cheese", price: "$8.99", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 2, name: "Pepperoni Pizza", description: "Classic Italian pizza", price: "$12.99", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 3, name: "Coke", description: "Refreshing drink", price: "$2.50", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 4, name: "Veggie Burger", description: "Healthy and tasty", price: "$9.50", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 5, name: "Margherita Pizza", description: "Fresh tomatoes & basil", price: "$11.50", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 6, name: "Orange Juice", description: "Freshly squeezed", price: "$3.00", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 7, name: "Chicken Wings", description: "Crispy wings with hot sauce", price: "$10.99", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 8, name: "Caesar Salad", description: "Fresh greens with parmesan", price: "$7.99", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
];

const MenuSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState("All");

    const filteredItems = activeTab === "All" ? foodItems : foodItems.filter(item =>
        item.name.toLowerCase().includes(activeTab.toLowerCase())
    );

    return (
        <section className="bg-white fade-top-mask z-20 py-20">
            <div className="ah-container mx-auto">
                {/* Title & Subtitle */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                        Fresh & Delicious
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-gray-900">Try Our</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500"> Amazing Menu</span>
                    </h2>
                    <p className="text-gray-600 text-base max-w-xl mx-auto">
                        Discover our carefully curated selection of mouthwatering dishes, 
                        prepared with the finest ingredients.
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-16">
                    {/* Mobile Scrollable Tabs */}
                    <div className="flex overflow-x-auto gap-4 pb-4 md:pb-0 md:flex-wrap md:justify-center scrollbar-hide">
                        {menuTabs.map((tab) => {
                            const IconComponent = tab.icon;
                            const isActive = activeTab === tab.name;

                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`
                                        group relative px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 
                                        flex items-center gap-2 sm:gap-3 min-w-[120px] sm:min-w-[140px] justify-center flex-shrink-0
                                        ${isActive
                                            ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-200 transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-100 hover:border-orange-200'
                                        }
                                    `}
                                >
                                    {/* Icon */}
                                    <IconComponent
                                        size={18}
                                        className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'
                                            }`}
                                    />

                                    {/* Text */}
                                    <span className="font-semibold text-sm sm:text-base">{tab.name}</span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>


                {/* Food Cards */}
                <div>
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                                >
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
                                                <ShoppingCart size={18}  />
                                                Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                                <div className="text-gray-400 mb-4">
                                    <Utensils size={48} className="mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                                <p className="text-gray-500">We couldn&apos;t find any items in this category.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>


    );
};

export default MenuSection;
