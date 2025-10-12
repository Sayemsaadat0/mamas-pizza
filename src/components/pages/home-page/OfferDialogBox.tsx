"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
    }
  }, [open])

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId)
    setCurrentStep("buy")
  }

  const toggleBuyItem = (item: MenuItem) => {
    setSelectedBuyItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : prev.length < offer.buy_quantity
          ? [...prev, item]
          : prev,
    )
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
    const orderData: {
      bogo_offer_id: number;
      buy_items: number[];
      free_items: number[];
      user_id?: number;
      guest_id?: string;
    } = {
      bogo_offer_id: offer.id,
      buy_items: selectedBuyItems.map((item) => item.id),
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
      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold">{offer.title}</DialogTitle>
        <p className="text-sm text-muted-foreground">{offer.description}</p>

        {/* Step 1: Size Selection */}
        {currentStep === "size" && (
          <div className="space-y-4 py-4">
            <div className="space-y-4 flex flex-col items-center">
              <Label htmlFor="size-select" className="text-center text-lg font-semibold text-gray-700">Select Size</Label>
              {sizesLoading ? (
                <div className="text-center text-muted-foreground py-8 text-sm">Loading sizes...</div>
              ) : (
                <div className="w-full max-w-xs">
                  <Select onValueChange={handleSizeSelect} value={selectedSize}>
                    <SelectTrigger 
                      id="size-select" 
                      className="bg-white border-2 border-orange-200 rounded-xl px-4 py-3 text-center font-medium hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                    >
                      <SelectValue placeholder="Choose a size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-orange-200 rounded-xl">
                      {sizes.map((size) => (
                        <SelectItem 
                          key={size.id} 
                          value={size.id}
                          className="text-center font-medium hover:bg-orange-50 focus:bg-orange-50"
                        >
                          {size.size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Buy Items */}
        {currentStep === "buy" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Select {offer.buy_quantity} to buy</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedBuyItems.length} of {offer.buy_quantity} selected
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep("size")}>
                Change Size
              </Button>
            </div>

            {menusLoading ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Loading items...</div>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {filteredMenus?.map((menu) => {
                  const selected = selectedBuyItems.some((i) => i.id === menu.id)
                  return (
                    <button
                      key={menu.id}
                      onClick={() => toggleBuyItem(menu)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{menu.name}</div>
                          {menu.details && (
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{menu.details}</div>
                          )}
                        </div>
                        {selected && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {selectedBuyItems.length === offer.buy_quantity && (
              <Button className="w-full" onClick={() => setCurrentStep("free")}>
                Continue
              </Button>
            )}
          </div>
        )}

        {/* Step 3: Free Items */}
        {currentStep === "free" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Select {offer.get_quantity} free</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedFreeItems.length} of {offer.get_quantity} selected
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep("buy")}>
                Back
              </Button>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {filteredMenus?.map((menu) => {
                const selected = selectedFreeItems.some((i) => i.id === menu.id)
                return (
                  <button
                    key={menu.id}
                    onClick={() => toggleFreeItem(menu)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selected
                        ? "border-green-600 bg-green-50 dark:bg-green-950/20"
                        : "border-border hover:border-green-600/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{menu.name}</div>
                        {menu.details && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{menu.details}</div>
                        )}
                      </div>
                      {selected && <Check className="h-5 w-5 text-green-600 flex-shrink-0" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {isSelectionComplete && (
              <Button className="w-full" disabled={isSubmitting} onClick={handleAddToCart}>
                {isSubmitting ? "Adding..." : "Add to Cart"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OfferDialogBox
