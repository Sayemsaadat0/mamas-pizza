import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BogoOffer } from "@/hooks/bogo-offer.hooks";
import React, { useState } from "react";
import { MenuItem, useMenus } from "@/hooks/menu.hook";
import { useGuest } from "@/lib/guest/GuestProvider";

interface OfferDialogBoxProps {
  offer: BogoOffer;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface AdditionalItem {
  item_id: number;
  quantity: number;
  size_id: number;
}

interface ItemsTabProps {
  offer: BogoOffer;
  handleProceedToCart: (
    buyItems: MenuItem[],
    getItems: MenuItem[],
    additionalItems: AdditionalItem[]
  ) => void;
}

type SelectionStep = "buy" | "get" | "additional";

const ItemsTab = ({ offer, handleProceedToCart }: ItemsTabProps) => {
  const { menus: offerMenus } = useMenus({
    category_id: offer.category_id?.toString(),
    size_id: offer?.size_id || undefined,
    per_page: 10,
  });

  const { menus: allMenus } = useMenus({
    per_page: 100, // Fetch more items for additional selection
  });

  const [currentStep, setCurrentStep] = useState<SelectionStep>("buy");
  const [selectedBuyItems, setSelectedBuyItems] = useState<MenuItem[]>([]);
  const [selectedGetItems, setSelectedGetItems] = useState<MenuItem[]>([]);
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [currentSelectionIndex, setCurrentSelectionIndex] = useState(0);

  const totalSelections = offer.buy_quantity + offer.get_quantity;

  const handleItemSelection = (item: MenuItem) => {
    if (currentSelectionIndex < offer.buy_quantity) {
      // Still selecting buy items
      setSelectedBuyItems((prev) => {
        const newBuyItems = [...prev, item];
        // Check if this completes all selections
        if (currentSelectionIndex + 1 >= totalSelections) {
          setTimeout(() => {
            handleProceedToCart(newBuyItems, selectedGetItems, additionalItems);
          }, 100);
        }
        return newBuyItems;
      });
    } else {
      // Selecting get items
      setSelectedGetItems((prev) => {
        const newGetItems = [...prev, item];
        // Check if this completes all selections
        if (currentSelectionIndex + 1 >= totalSelections) {
          setTimeout(() => {
            handleProceedToCart(selectedBuyItems, newGetItems, additionalItems);
          }, 100);
        }
        return newGetItems;
      });
    }

    // Move to next selection
    setCurrentSelectionIndex((prev) => prev + 1);
  };

  const handlePreviousSelection = () => {
    if (currentSelectionIndex > 0) {
      const newIndex = currentSelectionIndex - 1;
      setCurrentSelectionIndex(newIndex);

      if (newIndex < offer.buy_quantity) {
        // Remove from buy items
        setSelectedBuyItems((prev) => prev.slice(0, newIndex));
      } else {
        // Remove from get items
        const getIndex = newIndex - offer.buy_quantity;
        setSelectedGetItems((prev) => prev.slice(0, getIndex));
      }
    }
  };

  const handleProceed = () => {
    handleProceedToCart(selectedBuyItems, selectedGetItems, additionalItems);
  };

  const getCurrentSelectionText = () => {
    const itemNumber = currentSelectionIndex + 1;
    const ordinalNumber = getOrdinalNumber(itemNumber);

    if (currentSelectionIndex < offer.buy_quantity) {
      return `Select ${ordinalNumber} pizza to buy`;
    } else {
      return `Select ${ordinalNumber} pizza to get for free`;
    }
  };

  const getOrdinalNumber = (num: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const handleAdditionalItemQuantity = (
    itemId: number,
    sizeId: number,
    quantity: number
  ) => {
    setAdditionalItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.item_id === itemId && item.size_id === sizeId
      );

      if (quantity === 0) {
        return prev.filter(
          (item) => !(item.item_id === itemId && item.size_id === sizeId)
        );
      }

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { item_id: itemId, quantity, size_id: sizeId };
        return updated;
      } else {
        return [...prev, { item_id: itemId, quantity, size_id: sizeId }];
      }
    });
  };

  const getAdditionalItemQuantity = (itemId: number, sizeId: number) => {
    const item = additionalItems.find(
      (item) => item.item_id === itemId && item.size_id === sizeId
    );
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6">
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

      {/* Minimal Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousSelection}
          disabled={currentSelectionIndex === 0}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSelections }, (_, index) => {
            const isCompleted = index < currentSelectionIndex;
            const isCurrent = index === currentSelectionIndex;
            const isBuyItem = index < offer.buy_quantity;
            const itemNumber = index + 1;
            const ordinalNumber = getOrdinalNumber(itemNumber);

            return (
              <div key={index} className="flex items-center">
                <div
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    isCompleted
                      ? "bg-green-50 text-green-600"
                      : isCurrent
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <span className="flex items-center gap-1">
                      <span>✓</span>
                      <span>{ordinalNumber}</span>
                    </span>
                  ) : (
                    <span>{ordinalNumber}</span>
                  )}
                </div>
                {index < totalSelections - 1 && (
                  <div className="w-2 h-px bg-gray-200 mx-1"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="w-16"></div> {/* Spacer for alignment */}
      </div>

      {/* Show menus related to the offer */}
      <div className="space-y-6">
        {/* Train-like Selection */}
        {currentStep !== "additional" && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-center">
              {getCurrentSelectionText()}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offerMenus && offerMenus.length > 0 ? (
                offerMenus.map((menu: MenuItem) => (
                  <div
                    key={menu.id}
                    className="flex items-center gap-3 border rounded-lg p-3 shadow-sm cursor-pointer transition-all border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-blue-300"
                    onClick={() => handleItemSelection(menu)}
                  >
                    {menu.thumbnail && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${menu.thumbnail}`}
                        alt={menu.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {menu.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {menu.details}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 col-span-2">
                  No menu items found for this offer.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Items Selection - Commented out for now */}
        {/* {currentStep === "additional" && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                ✅ BOGO Selection Complete!
              </h4>
              <p className="text-sm text-green-700">
                You've selected {selectedBuyItems.length} items to buy and{" "}
                {selectedGetItems.length} items to get for free. You can now add
                additional items if desired.
              </p>
            </div>

            <AdditionalItemsStep
              menus={allMenus || []}
              additionalItems={additionalItems}
              onQuantityChange={handleAdditionalItemQuantity}
              getQuantity={getAdditionalItemQuantity}
            />
          </div>
        )} */}
      </div>

      {/* Additional step button commented out */}
      {/* {currentStep === "additional" && (
        <div className="flex justify-end">
          <Button
            onClick={handleProceed}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            Proceed to Cart
          </Button>
        </div>
      )} */}
    </div>
  );
};

// Cart Tab
type CartTabProps = {
  offer: BogoOffer;
  buyItems: MenuItem[];
  getItems: MenuItem[];
  additionalItems: AdditionalItem[];
  guestId: string | null;
  handleBackToItems: () => void;
};

const CartTab = ({
  offer,
  buyItems,
  getItems,
  additionalItems,
  guestId,
  handleBackToItems,
}: CartTabProps) => {
  const offerPrice = parseFloat(offer.offer_price);

  const handleCompleteOrder = () => {
    const orderData = {
      bogo_offer_id: offer.id,
      offer_items: [
        ...buyItems.map((item) => item.id),
        ...getItems.map((item) => item.id),
      ],
      additional_items: additionalItems,
      guest_id: guestId,
    };

    console.log("Complete Order Data:", orderData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-gray-600">{offer.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Offer Price: ${offerPrice.toFixed(2)}</span>
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

      {/* Cart Summary Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

        {/* Items to Buy */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">
            Items to Buy ({buyItems.length})
          </h4>
          <div className="space-y-2">
            {buyItems.map((item) => (
              <div
                key={`buy-${item.id}`}
                className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
              >
                {item.thumbnail && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${item.thumbnail}`}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items to Get for Free */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">
            Items to Get for Free ({getItems.length})
          </h4>
          <div className="space-y-2">
            {getItems.map((item) => (
              <div
                key={`get-${item.id}`}
                className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200"
              >
                {item.thumbnail && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${item.thumbnail}`}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.details}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-sm font-medium text-green-600">
                    FREE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Items */}
        {additionalItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">
              Additional Items ({additionalItems.length})
            </h4>
            <div className="space-y-2">
              {additionalItems.map((item, index) => (
                <div
                  key={`additional-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-gray-800">
                        Item ID: {item.item_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Size ID: {item.size_id}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    Qty: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total to Pay:</span>
            <span>${offerPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handleBackToItems}
          variant="outline"
          className="px-6 py-2"
        >
          Back to Items
        </Button>
        <Button
          onClick={handleCompleteOrder}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
        >
          Complete Order
        </Button>
      </div>
    </div>
  );
};

/* 
what i need to do is 
1. need to create breadcrambs
2. select the length of the buy category as items
3. select the length of item for get_quantity 
4. go to next tab, for cart and make order with that
*/

const OfferDialogBox: React.FC<OfferDialogBoxProps> = ({
  offer,
  open,
  setOpen,
}) => {
  const { guestId } = useGuest();
  const [currentTab, setCurrentTab] = useState<"items" | "cart">("items");
  const [selectedBuyItems, setSelectedBuyItems] = useState<MenuItem[]>([]);
  const [selectedGetItems, setSelectedGetItems] = useState<MenuItem[]>([]);
  const [selectedAdditionalItems, setSelectedAdditionalItems] = useState<
    AdditionalItem[]
  >([]);

  const handleProceedToCart = (
    buyItems: MenuItem[],
    getItems: MenuItem[],
    additionalItems: AdditionalItem[]
  ) => {
    console.log("Proceeding to cart with:", {
      buyItems,
      getItems,
      additionalItems,
    });
    setSelectedBuyItems(buyItems);
    setSelectedGetItems(getItems);
    setSelectedAdditionalItems(additionalItems);
    setCurrentTab("cart");
  };

  const handleBackToItems = () => {
    setCurrentTab("items");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[calc(80vh)] overflow-y-auto">
        <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
          {offer.title}
        </DialogTitle>

        {/* Hidden tab functionality - no visible tabs */}
        {currentTab === "items" && (
          <ItemsTab offer={offer} handleProceedToCart={handleProceedToCart} />
        )}
        {currentTab === "cart" && (
          <CartTab
            offer={offer}
            buyItems={selectedBuyItems}
            getItems={selectedGetItems}
            additionalItems={selectedAdditionalItems}
            guestId={guestId}
            handleBackToItems={handleBackToItems}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OfferDialogBox;
