"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateGuestPostCode } from "@/hooks/post-codes.hook"
import { getPostCodeByCode } from "@/app/api"
import { useOrderStore } from "@/lib/stores/orderStore"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { toast } from "sonner"

const HeroSection = () => {
    const [zipCode, setZipCode] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

    const router = useRouter()
    const { setCanOrder } = useOrderStore()

    // Hooks for post code functionality
    const { createGuestPostCode, loading: createLoading } = useCreateGuestPostCode()


    const handleSearch = async () => {
        if (!zipCode.trim()) {
            toast.error("Please enter a zip code or address")
            return
        }

        setIsSearching(true)

        try {
            // Call the new API to check if postal code matches
            const response = await fetch(getPostCodeByCode(zipCode.trim()), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })

            if (!response.ok) {
                // Handle different HTTP status codes gracefully
                if (response.status === 404) {
                    // No delivery area found - this is expected behavior
                    setCanOrder(false)
                    setShowDialog(true)
                    return
                } else if (response.status >= 500) {
                    // Server error - show user-friendly message
                    toast.error("Service temporarily unavailable. Please try again later.")
                    setCanOrder(false)
                    setShowDialog(true)
                    return
                } else {
                    // Other client errors
                    setCanOrder(false)
                    setShowDialog(true)
                    return
                }
            }

            const result = await response.json()

            // Check if the API call was successful and code matches
            if (result.success && result.matched) {
                // Success - set canOrder to true and navigate to menu
                setCanOrder(true)
                toast.success("Great! We deliver to your area. Redirecting to menu...")
                router.push('/menu')
            } else {
                // No match found - set canOrder to false and show dialog
                setCanOrder(false)
                setShowDialog(true)
            }
        } catch (error) {
            // Handle network errors and other exceptions gracefully
            if (error instanceof TypeError && error.message.includes('fetch')) {
                // Network error
                toast.error("Network error. Please check your connection and try again.")
            } else {
                // Other errors - show generic message
                toast.error("Unable to check delivery area. Please try again.")
            }
            
            // Always set canOrder to false and show dialog on any error
            setCanOrder(false)
            setShowDialog(true)
        } finally {
            setIsSearching(false)
        }
    }

    const handleRequestDelivery = async () => {
        if (!zipCode.trim()) {
            toast.error("Please enter a zip code")
            return
        }

        setIsSubmittingRequest(true)

        try {
            // Create guest post code request
            await createGuestPostCode({ code: zipCode.trim() })

            toast.success("Thank you! We've received your request for delivery to this area. We'll notify you when we start delivering here.")
            setShowDialog(false)
            setZipCode("") // Clear the input
        } catch (error) {
            console.error("Request error:", error)
            toast.error("Failed to submit request. Please try again.")
        } finally {
            setIsSubmittingRequest(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Background Image */}
            <button className="absolute bottom-0 left-0 z-20 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20" onClick={() => setCanOrder(false)}>
                        clear
                     
                    </button>
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Delicious pizza and food background"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Black overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Centered Search Content */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    
                    {/* Search Section */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20">
                        {/* Desktop Layout - Inline */}
                        <div className="hidden sm:block relative">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your zip code or address..."
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                className="w-full pl-20 pr-44 py-7 text-2xl border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-300 shadow-inner"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSearching ? (
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Searching...
                                    </div>
                                ) : (
                                    "Search"
                                )}
                            </button>
                        </div>

                        {/* Mobile Layout - Stacked */}
                        <div className="sm:hidden flex flex-col space-y-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter zip code or address..."
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 text-base border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 shadow-inner"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg font-semibold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSearching ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Searching...
                                    </div>
                                ) : (
                                    "Search Delivery Area"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
                    <div className="text-center space-y-1 sm:space-y-2">
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white">50K+</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-200">Happy Customers</div>
                    </div>
                    <div className="text-center space-y-1 sm:space-y-2">
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-orange-300">25+</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-200">Restaurant Partners</div>
                    </div>
                    <div className="text-center space-y-1 sm:space-y-2">
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-yellow-300">4.9★</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-200">Average Rating</div>
                    </div>
                    <div className="text-center space-y-1 sm:space-y-2">
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-pink-300">30min</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-200">Delivery Time</div>
                    </div>
                </div>
            </div>

            {/* Delivery Area Not Available Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="mx-4 sm:mx-0 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg sm:text-xl font-bold text-orange-600">
                            📍 Delivery Not Available Yet
                        </DialogTitle>
                        <DialogDescription className="text-center text-sm sm:text-base text-gray-600">
                            We&apos;re not currently delivering to <span className="font-semibold text-orange-600">{zipCode}</span> yet,
                            but we&apos;re expanding our delivery areas regularly!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-3 sm:py-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-orange-800">
                                💡 Submit a request and we&apos;ll notify you as soon as we start delivering to your area.
                                We&apos;re always looking to expand our delivery network!
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => setShowDialog(false)}
                            className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleRequestDelivery}
                            disabled={isSubmittingRequest || createLoading}
                            className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmittingRequest || createLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Submitting...
                                </div>
                            ) : (
                                "Request Delivery"
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default HeroSection