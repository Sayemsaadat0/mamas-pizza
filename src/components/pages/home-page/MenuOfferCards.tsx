import React, { useState } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

import { BogoOffer } from "@/hooks/bogo-offer.hooks";
import OfferDialogBox from './OfferDialogBox';

interface MenuOfferCardsProps {
  offer: BogoOffer;
  isModalOpen?: boolean;
  onModalOpen?: (offerId: number) => void;
  isLoading?: boolean;
}

const MenuOfferCards: React.FC<MenuOfferCardsProps> = ({ 
  offer, 
  isModalOpen = false, 
  onModalOpen,
  isLoading = false 
}) => {

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onModalOpen && !isLoading && !isModalOpen) {
      onModalOpen(offer.id);
    }
  };

  return (
    <div 
      key={offer.id}
      onClick={handleCardClick} 
      className={`max-w-xs rounded-lg shadow-lg bg-white overflow-hidden border border-gray-100 transition-all duration-200 ${
        isLoading || isModalOpen ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {offer.thumbnail && (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${offer.thumbnail}`}
          alt={offer.title}
          width={320}
          height={160}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4 min-h-[250px] flex flex-col justify-between">
       <div>
       <h3 className="text-lg font-bold mb-2 ">{offer.title}</h3>
       <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
       </div>
        <div>
        <div className="flex items-center gap-3 mt-4">
          {isLoading ? (
            <span className="inline-flex items-center bg-gray-400 text-white px-4 py-2 rounded-full font-bold text-lg tracking-wide">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Loading...</span>
            </span>
          ) : (
            <span className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-400 text-white px-4 py-2 rounded-full font-bold shadow-orange-100 shadow text-lg tracking-wide">
              <svg width="22" height="22" fill="none" className="mr-1" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="11" fill="#fff" />
                <path d="M7.5 13.5C7.77 14.98 9.18 16 12 16C14.82 16 16.23 14.98 16.5 13.5" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round"/>
                <g>
                  <ellipse cx="9" cy="11" rx="1" ry="1.5" fill="#ea580c" />
                  <ellipse cx="15" cy="11" rx="1" ry="1.5" fill="#ea580c" />
                </g>
              </svg>
              <span>
                <span className="text-sm font-medium opacity-80 pr-1">Just</span>
                <span className="text-lg font-bold">${offer.offer_price}</span>
              </span>
            </span>
          )}
        </div>
        </div>
      </div>
      <OfferDialogBox offer={offer} open={isModalOpen} setOpen={(open) => !open && onModalOpen?.(0)} />
    </div>
  );
};


export default MenuOfferCards