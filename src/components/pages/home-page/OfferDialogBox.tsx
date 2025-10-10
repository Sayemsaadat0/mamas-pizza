import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BogoOffer } from "@/hooks/bogo-offer.hooks";
import React, { useState, useEffect } from "react";
import { MenuItem, useMenus } from "@/hooks/menu.hook";
import { useSizes } from "@/hooks/sizes.hook";
import { useGuest } from "@/lib/guest/GuestProvider";
import { useRouter } from "next/navigation";
import { CREATE_ORDER_FROM_OFFER_API } from "@/app/api";

interface OfferDialogBoxProps {
  offer: BogoOffer;
  open: boolean;
  setOpen: (open: boolean) => void;
}

type SelectionStep = "size" | "buy" | "free";

const OfferDialogBox: React.FC<OfferDialogBoxProps> = ({
  offer,
  open,
  setOpen,
}) => {
  const { guestId } = useGuest();
  const { sizes, loading: sizesLoading, error: sizesError } = useSizes();
  const router = useRouter();

  // Debug logging
  console.log('OfferDialogBox Debug:', {
    sizes,
    sizesLoading,
    sizesError,
    open
  });
  
  // State management
  const [currentStep, setCurrentStep] = useState<SelectionStep>("size");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedBuyItems, setSelectedBuyItems] = useState<MenuItem[]>([]);
  const [selectedFreeItems, setSelectedFreeItems] = useState<MenuItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch menus based on selected size
  const { menus: filteredMenus, loading: menusLoading } = useMenus({
    category_id: offer.category_id?.toString(),
    size_id: selectedSize ? parseInt(selectedSize) : undefined,
    per_page: 50,
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setCurrentStep("size");
      setSelectedSize("");
      setSelectedBuyItems([]);
      setSelectedFreeItems([]);
    }
  }, [open]);

  // Handle size selection
  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    setCurrentStep("buy");
  };

  // Handle buy item selection
  const handleBuyItemSelect = (item: MenuItem) => {
    if (selectedBuyItems.length < offer.buy_quantity) {
      setSelectedBuyItems(prev => [...prev, item]);
    }
  };

  // Handle free item selection
  const handleFreeItemSelect = (item: MenuItem) => {
    if (selectedFreeItems.length < offer.get_quantity) {
      setSelectedFreeItems(prev => [...prev, item]);
    }
  };

  // Remove buy item
  const removeBuyItem = (itemId: number) => {
    setSelectedBuyItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Remove free item
  const removeFreeItem = (itemId: number) => {
    setSelectedFreeItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Check if all required items are selected
  const isSelectionComplete = 
    selectedBuyItems.length === offer.buy_quantity && 
    selectedFreeItems.length === offer.get_quantity;

  // Handle add to cart
  const handleAddToCart = async () => {
    const orderData = {
      bogo_offer_id: offer.id,
      buy_items: selectedBuyItems.map(item => item.id),
      free_items: selectedFreeItems.map(item => item.id),
      user_id: null,
      guest_id: guestId,
    };
    
    console.log("BOGO Order Data:", orderData);
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(CREATE_ORDER_FROM_OFFER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log("Order created successfully:", result);
        setOpen(false);
        router.push('/cart');
      } else {
        console.error("Failed to create order:", result);
        alert(result.message || "Failed to add items to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go to free items selection
  const goToFreeItems = () => {
    if (selectedBuyItems.length === offer.buy_quantity) {
      setCurrentStep("free");
    }
  };

  // Go back to buy items
  const goToBuyItems = () => {
    setCurrentStep("buy");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[calc(80vh)] overflow-y-auto">
        <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
          {offer.title}
        </DialogTitle>

        <div className="space-y-6">
          {/* Offer Info */}
          <div className="space-y-4">
            <p className="text-gray-600">{offer.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Price: {offer.offer_price}</span>
              <span>•</span>
              <span>
                Buy {offer.buy_quantity} Get {offer.get_quantity}
              </span>
              <span>•</span>
              <span className={offer.is_active ? "text-green-600" : "text-red-600"}>
                {offer.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Step 1: Size Selection */}
          {currentStep === "size" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
              
              {sizesLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-200 border-t-orange-500"></div>
                  <p className="text-orange-600 mt-2 font-medium">Loading sizes...</p>
                </div>
              ) : sizesError ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-red-800 font-medium mb-2">Error loading sizes</h4>
                    <p className="text-red-600 text-sm mb-3">{sizesError}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : sizes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeSelect(size.id)}
                      className="p-3 border rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{size.size}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-gray-800 font-medium mb-2">No sizes available</h4>
                    <p className="text-gray-600 text-sm">Please contact support if this issue persists.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Buy Items Selection */}
          {currentStep === "buy" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Items to Buy ({selectedBuyItems.length}/{offer.buy_quantity})
                </h3>
                <button
                  onClick={() => setCurrentStep("size")}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Change Size
                </button>
              </div>

              {/* Selected Buy Items */}
              {selectedBuyItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Selected Items:</h4>
                  {selectedBuyItems.map((item) => (
                    <div
                      key={`buy-${item.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.details}</div>
                      </div>
                      <button
                        onClick={() => removeBuyItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Items */}
              <div className="space-y-2">
                {menusLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading items...
                  </div>
                ) : filteredMenus && filteredMenus.length > 0 ? (
                  filteredMenus.map((menu: MenuItem) => (
                    <div
                      key={menu.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedBuyItems.some(item => item.id === menu.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleBuyItemSelect(menu)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{menu.name}</div>
                        <div className="text-sm text-gray-500">{menu.details}</div>
                      </div>
                      {selectedBuyItems.some(item => item.id === menu.id) && (
                        <div className="text-blue-600 text-sm font-medium">
                          Selected
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No items available for this size.
                  </div>
                )}
              </div>

              {/* Next Button */}
              {selectedBuyItems.length === offer.buy_quantity && (
                <div className="flex justify-end">
                  <Button
                    onClick={goToFreeItems}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Next: Select Free Items
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Free Items Selection */}
          {currentStep === "free" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Items to Get Free ({selectedFreeItems.length}/{offer.get_quantity})
                </h3>
                <button
                  onClick={goToBuyItems}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Back to Buy Items
                </button>
              </div>

              {/* Selected Free Items */}
              {selectedFreeItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Selected Free Items:</h4>
                  {selectedFreeItems.map((item) => (
                    <div
                      key={`free-${item.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.details}</div>
                      </div>
                      <button
                        onClick={() => removeFreeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Items */}
              <div className="space-y-2">
                {filteredMenus && filteredMenus.length > 0 ? (
                  filteredMenus.map((menu: MenuItem) => (
                    <div
                      key={menu.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedFreeItems.some(item => item.id === menu.id)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFreeItemSelect(menu)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{menu.name}</div>
                        <div className="text-sm text-gray-500">{menu.details}</div>
                      </div>
                      {selectedFreeItems.some(item => item.id === menu.id) && (
                        <div className="text-green-600 text-sm font-medium">
                          Selected
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No items available for this size.
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              {isSelectionComplete && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Adding to Cart..." : "Add to Cart"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default OfferDialogBox;
