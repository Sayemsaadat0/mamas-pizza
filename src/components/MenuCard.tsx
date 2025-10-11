'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback } from "react";
import { useOrderStore } from "@/lib/stores/orderStore";

interface MenuItem {
  id: number;
  name: string;
  category_id: number;
  details: string;
  main_price: string;
  prev_price: string;
  thumbnail: string;
  status: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface MenuCardProps {
  menu: MenuItem;
  index?: number;
  onAddToCart?: (menu: MenuItem) => void;
  isLoading?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, index = 0, onAddToCart, isLoading = false }) => {
  const { canOrder } = useOrderStore();

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!canOrder || isLoading) {
      return; // Don't proceed if canOrder is false or already loading
    }
    
    // console.log('MenuCard: Add to Cart button clicked for menu:', menu);
    // console.log('MenuCard: onAddToCart function exists:', !!onAddToCart);
    if (onAddToCart) {
      // console.log('MenuCard: Calling onAddToCart function');
      onAddToCart(menu);
    } else {
      // console.log('MenuCard: onAddToCart function is not provided');
    }
  }, [canOrder, isLoading, onAddToCart, menu]);

  return (
    <motion.div
      key={menu.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white border-2 border-orange-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-orange-200 transition-all duration-300 group h-full flex flex-col"
    >
      <div className="relative overflow-hidden">
        <Image
          width={400}
          height={400}
          src={`${process.env.NEXT_PUBLIC_API_URL}/${menu.thumbnail}`}
          alt={menu.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-semibold text-orange-600">Fresh</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
            {menu.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {menu.details}
          </p>
        </div>
        
        <div className="mt-auto">
          <button 
            onClick={handleAddToCart}
            disabled={isLoading || !canOrder}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 ${
              isLoading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed scale-100' 
                : !canOrder
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : !canOrder ? (
              'Delivery Not Available'
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Add to Cart
              </div>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
