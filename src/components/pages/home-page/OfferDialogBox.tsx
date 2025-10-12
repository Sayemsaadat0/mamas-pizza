"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BogoOffer } from "@/hooks/bogo-offer.hooks"
import type React from "react"
import { useState, useEffect } from "react"
import { type MenuItem, useMenus } from "@/hooks/menu.hook"
import { useSizes } from "@/hooks/sizes.hook"
import { useGuest } from "@/lib/guest/GuestProvider"
import { useRouter } from "next/navigation"
import { CREATE_ORDER_FROM_OFFER_API, CREATE_ORDER_FROM_OFFER_API_USER } from "@/app/api"
import { Check } from "lucide-react"
import { useAuth } from "@/lib/stores/useAuth"
import { useCartStore } from "@/lib/stores/cartStore"

interface OfferDialogBoxProps {
  offer: BogoOffer
  open: boolean
  setOpen: (open: boolean) => void
}

type SelectionStep = "size" | "buy" | "free"

// Helper function to get ordinal numbers
const getOrdinalNumber = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

const OfferDialogBox: React.FC<OfferDialogBoxProps> = ({ offer, open, setOpen }) => {
  const { guestId } = useGuest()
  const { sizes, loading: sizesLoading } = useSizes()
  const { token, isAuthenticated, user } = useAuth()
  const { incrementItemCount } = useCartStore()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<SelectionStep>("size")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedBuyItems, setSelectedBuyItems] = useState<MenuItem[]>([])
  const [selectedFreeItems, setSelectedFreeItems] = useState<MenuItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentBuyStep, setCurrentBuyStep] = useState(0) // Track which buy item we're selecting

  const { menus: filteredMenus, loading: menusLoading } = useMenus({
    category_id: offer.category_id?.toString(),
    size_id: selectedSize ? Number.parseInt(selectedSize) : undefined,
    per_page: 50,
  })

  useEffect(() => {
    if (open) {
      setCurrentStep("size")
      setSelectedSize("")
      setSelectedBuyItems([])
      setSelectedFreeItems([])
      setCurrentBuyStep(0)
    }
  }, [open])

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId)
    setCurrentStep("buy")
    setCurrentBuyStep(0) // Start with first buy item
  }

  const selectBuyItem = (item: MenuItem) => {
    const isAlreadySelected = selectedBuyItems.some((i) => i.id === item.id)
    
    if (isAlreadySelected) {
      // Unselect the item
      setSelectedBuyItems((prev) => prev.filter((i) => i.id !== item.id))
      
      // If we're on a step beyond the first one, go back to the previous step
      if (currentBuyStep > 0) {
        setCurrentBuyStep(currentBuyStep - 1)
      }
    } else {
      // Select the item
      setSelectedBuyItems((prev) => {
        const newItems = [...prev]
        newItems[currentBuyStep] = item
        return newItems
      })
      
      // Move to next buy step or free items
      if (currentBuyStep < offer.buy_quantity - 1) {
        setCurrentBuyStep(currentBuyStep + 1)
      } else {
        setCurrentStep("free")
      }
    }
  }

  const goBackToPreviousBuyStep = () => {
    if (currentBuyStep > 0) {
      setCurrentBuyStep(currentBuyStep - 1)
    } else {
      setCurrentStep("size")
    }
  }

  const toggleFreeItem = (item: MenuItem) => {
    setSelectedFreeItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : prev.length < offer.get_quantity
          ? [...prev, item]
          : prev,
    )
  }

  const handleAddToCart = async () => {
    // Prepare the order data with proper typing
    // UI shows individual steps, but API receives grouped data
    const orderData: {
      bogo_offer_id: number;
      buy_items: number[];  // All buy items grouped as single array
      free_items: number[]; // All free items grouped as single array
      user_id?: number;
      guest_id?: string;
    } = {
      bogo_offer_id: offer.id,
      buy_items: selectedBuyItems.filter(item => item).map((item) => item.id), // Group all buy items as single array
      free_items: selectedFreeItems.map((item) => item.id),
    }

    // Add user/guest identification based on authentication status
    if (isAuthenticated && user?.id) {
      orderData.user_id = user.id
    } else if (guestId) {
      orderData.guest_id = guestId
    } else {
      alert("Unable to identify user. Please refresh and try again.")
      return
    }

    setIsSubmitting(true)

    try {
      // Choose the correct API endpoint based on authentication status
      const apiEndpoint = isAuthenticated
        ? CREATE_ORDER_FROM_OFFER_API_USER
        : CREATE_ORDER_FROM_OFFER_API

      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Add authorization header for authenticated users
      if (isAuthenticated && token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Make the API call
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Calculate total items added (buy + free items)
        const totalItems = selectedBuyItems.length + selectedFreeItems.length
        incrementItemCount(totalItems) // Update global cart count
        setOpen(false)
        router.push("/cart")
      } else {
        alert(result.message || "Failed to add items to cart")
      }
    } catch (error) {
      console.error("Error adding offer to cart:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSelectionComplete =
    selectedBuyItems.length === offer.buy_quantity && selectedFreeItems.length === offer.get_quantity

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold">{offer.title}</DialogTitle>
        <p className="text-sm text-muted-foreground">{offer.description}</p>

        {/* Step 1: Size Selection */}
        {currentStep === "size" && (
          <div className="py-6">
            <div className="max-w-md mx-auto space-y-6">
              {/* <Label
                htmlFor="size-select"
                className="block text-sm font-medium text-gray-900"
              >
                Size
              </Label> */}

              {sizesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <Select onValueChange={handleSizeSelect} value={selectedSize}>
                  <SelectTrigger
                    id="size-select"
                    className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {sizes.map((size) => (
                      <SelectItem
                        key={size.id}
                        value={size.id}
                        className="text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                      >
                        {size.size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Buy Items - Dynamic Steps */}
        {currentStep === "buy" && (
          <div className="py-4 px-3">
            <div className="max-w-xl mx-auto">
              {/* Glassmorphism Header Card */}
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4 mb-3 shadow-lg shadow-gray-200/50">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goBackToPreviousBuyStep}
                      className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/80 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm h-7"
                    >
                      ← Back
                    </Button>
                    <h3 className="text-base font-bold text-gray-800">
                      {currentBuyStep === 0 
                        ? "Select first item" 
                        : currentBuyStep === 1 
                          ? "Select second item"
                          : currentBuyStep === 2
                            ? "Select third item"
                            : `Select ${getOrdinalNumber(currentBuyStep + 1)} item`
                      }
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep("size")}
                    className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/80 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm h-7"
                  >
                    Change Size
                  </Button>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedBuyItems.length / offer.buy_quantity) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {selectedBuyItems.length}/{offer.buy_quantity}
                  </span>
                </div>

                {/* Show selected items so far */}
                {/* {selectedBuyItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/30">
                    <p className="text-xs font-medium text-gray-600 mb-2">Selected so far:</p>
                    <div className="space-y-1">
                      {selectedBuyItems.slice(0, currentBuyStep).map((item, index) => (
                        <div key={index} className="text-xs text-gray-700 bg-white/30 rounded-lg px-2 py-1">
                          {index + 1}. {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>

              {/* Items Grid */}
              {menusLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-xl px-4 py-2 shadow-lg">
                    <span className="text-xs font-medium text-gray-600">Loading items...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {filteredMenus?.map((menu) => {
                    const isAlreadySelected = selectedBuyItems.some((i) => i.id === menu.id)
                    return (
                      <button
                        key={menu.id}
                        onClick={() => selectBuyItem(menu)}
                        className={`w-full text-left group transition-all duration-300 hover:scale-[1.01]`}
                      >
                        <div className={`
                  backdrop-blur-xl rounded-xl p-3 border transition-all duration-300
                  ${isAlreadySelected
                            ? "bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-blue-300/60 shadow-lg shadow-blue-200/30"
                            : "bg-white/50 border-white/60 shadow-md shadow-gray-200/30 hover:shadow-lg hover:border-gray-300/50"
                          }
                `}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold mb-1 ${isAlreadySelected ? "text-blue-900" : "text-gray-800"
                                }`}>
                                {menu.name}
                                {isAlreadySelected && <span className="ml-2 text-xs text-blue-600">(Click to unselect)</span>}
                              </div>
                              {menu.details && (
                                <div className={`text-xs leading-snug line-clamp-1 ${isAlreadySelected ? "text-blue-700/80" : "text-gray-600"
                                  }`}>
                                  {menu.details}
                                </div>
                              )}
                            </div>

                            <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                      ${isAlreadySelected
                                ? "bg-gradient-to-br from-blue-500 to-purple-500 shadow-md shadow-blue-300/50"
                                : "bg-white/70 border-2 border-gray-300/50"
                              }
                    `}>
                              {isAlreadySelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Step 3: Free Items */}
        {currentStep === "free" && (
          <div className="py-4 px-3">
            <div className="max-w-xl mx-auto">
              {/* Header Card */}
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4 mb-3 shadow-lg shadow-gray-200/50">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      Choose Free Items
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {selectedFreeItems.length} of {offer.get_quantity} selected
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentStep("buy")
                      setCurrentBuyStep(offer.buy_quantity - 1) // Go to last buy step
                    }}
                    className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/80 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm h-7"
                  >
                    Back
                  </Button>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedFreeItems.length / offer.get_quantity) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {selectedFreeItems.length}/{offer.get_quantity}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredMenus?.map((menu) => {
                  const selected = selectedFreeItems.some((i) => i.id === menu.id)
                  return (
                    <button
                      key={menu.id}
                      onClick={() => toggleFreeItem(menu)}
                      className={`w-full text-left group transition-all duration-300 ${selected ? "scale-[0.98]" : "hover:scale-[1.01]"
                        }`}
                    >
                      <div className={`
                backdrop-blur-xl rounded-xl p-3 border transition-all duration-300
                ${selected
                          ? "bg-gradient-to-br from-emerald-50/80 to-green-50/80 border-emerald-300/60 shadow-lg shadow-emerald-200/30"
                          : "bg-white/50 border-white/60 shadow-md shadow-gray-200/30 hover:shadow-lg hover:border-gray-300/50"
                        }
              `}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold mb-1 ${selected ? "text-emerald-900" : "text-gray-800"
                              }`}>
                              {menu.name}
                            </div>
                            {menu.details && (
                              <div className={`text-xs leading-snug line-clamp-1 ${selected ? "text-emerald-700/80" : "text-gray-600"
                                }`}>
                                {menu.details}
                              </div>
                            )}
                          </div>

                          <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${selected
                              ? "bg-gradient-to-br from-emerald-500 to-green-500 shadow-md shadow-emerald-300/50"
                              : "bg-white/70 border-2 border-gray-300/50"
                            }
                  `}>
                            {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Add to Cart Button */}
              <div className="mt-3">
                <Button
                  disabled={!isSelectionComplete || isSubmitting}
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-300/40 hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-white/20"
                  onClick={handleAddToCart}
                >
                  {isSubmitting ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OfferDialogBox
