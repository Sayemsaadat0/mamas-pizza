'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCategories } from "@/hooks/category.hook";
import { useMenus } from "@/hooks/menu.hook";
import { useDebounce } from "@/hooks/useDebounce";
import MenuCard from "@/components/MenuCard";

const Menu = () => {
  // --- State ---
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6; // items per page

  const debouncedSearch = useDebounce(search, 500);

  // --- Hooks ---
  const { categories, loading: catLoading } = useCategories();
  const { menus, loading: menuLoading, pagination } = useMenus({
    category_id: categoryId,
    per_page: perPage,
    page,
    search: debouncedSearch,
  });

  console.log(menus) 

  // --- Handlers ---
  const handleCategoryClick = (id?: string) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (pagination?.has_prev_page) setPage(prev => prev - 1);
  };
  const handleNextPage = () => {
    if (pagination?.has_next_page) setPage(prev => prev + 1);
  };

  const handleAddToCart = (menu: any) => {
    // Add to cart logic here
    console.log('Adding to cart:', menu);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Menu background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4">
            OUR MENUS
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
          <p className="text-xl sm:text-2xl text-gray-200 mt-6 max-w-2xl mx-auto">
            Explore our delicious selection of handcrafted pizzas and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* --- Search --- */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={handleSearch}
              className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 shadow-sm bg-white placeholder-orange-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- Categories --- */}
        <div className="flex gap-3 flex-wrap justify-center mb-10">
          <button
            onClick={() => handleCategoryClick(undefined)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
              !categoryId
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200"
                : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            }`}
          >
            All
          </button>
          {catLoading ? (
            <p className="text-orange-500">Loading categories...</p>
          ) : (
            categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                  categoryId === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200"
                    : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>

        {/* --- Menus --- */}
        {menuLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
            <p className="text-orange-600 mt-4 font-medium">Loading menus...</p>
          </div>
        ) : menus.length === 0 ? (
          <p className="text-center text-orange-400 py-12 text-lg">No menus found.</p>
         ) : (
           <motion.div
             layout
             className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
           >
             {menus.map((menu, index) => (
               <MenuCard
                 key={menu.id}
                 menu={menu}
                 index={index}
                 onAddToCart={handleAddToCart}
               />
             ))}
           </motion.div>
         )}

        {/* --- Pagination --- */}
        {pagination && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={!pagination.has_prev_page}
              onClick={handlePrevPage}
              className="px-6 py-2.5 border-2 border-orange-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
            >
              Previous
            </button>
            <span className="text-orange-700 font-medium px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              disabled={!pagination.has_next_page}
              onClick={handleNextPage}
              className="px-6 py-2.5 border-2 border-orange-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;