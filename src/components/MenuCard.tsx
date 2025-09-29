'use client'

import { motion } from "framer-motion";
import Image from "next/image";

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
  const handleAddToCart = () => {
    console.log('MenuCard: Add to Cart button clicked for menu:', menu);
    console.log('MenuCard: onAddToCart function exists:', !!onAddToCart);
    if (onAddToCart) {
      console.log('MenuCard: Calling onAddToCart function');
      onAddToCart(menu);
    } else {
      console.log('MenuCard: onAddToCart function is not provided');
    }
  };

  return (
    <motion.div
      key={menu.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white border-2 border-orange-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-orange-200 transition-all duration-300 group"
    >
      <div className="relative overflow-hidden">
        <Image
          width={400}
          height={400}
          src={`${process.env.NEXT_PUBLIC_API_URL}/${menu.thumbnail}`}
          alt={menu.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {menu.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {menu.details}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-orange-600 font-bold text-xl">
            ${menu.main_price}
          </span>
          {menu.prev_price && (
            <span className="text-sm text-gray-400 line-through">
              ${menu.prev_price}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-md ${
            isLoading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default MenuCard;
