"use client"

import Image from "next/image"
import { useState } from "react"
import { useSearchPostCodes } from "@/hooks/post-codes.hook"
import { useCreateGuestPostCode } from "@/hooks/post-codes.hook"
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
    const [showFoundAreasDialog, setShowFoundAreasDialog] = useState(false)
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

    // Hooks for post code functionality
    const { searchPostCodes, postCodes } = useSearchPostCodes()
    const { createGuestPostCode, loading: createLoading } = useCreateGuestPostCode()

    const handleSearch = async () => {
        if (!zipCode.trim()) {
            toast.error("Please enter a zip code or address")
            return
        }

        setIsSearching(true)
        
        try {
            // Search for post codes
            await searchPostCodes(zipCode.trim())
            
            // Check if any post codes were found
            if (postCodes.length === 0) {
                // No post codes found, show dialog
                setShowDialog(true)
            } else {
                // Post codes found, show areas dialog
                setShowFoundAreasDialog(true)
            }
        } catch (error) {
            console.error("Search error:", error)
            toast.error("Failed to search delivery areas. Please try again.")
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
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                        <div className="relative">
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
                                className="w-full pl-20 pr-44 py-7 text-2xl border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-200 transition-all duration-300 shadow-inner"
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
                            </div>
                        </div>
                    </div>

            {/* Bottom Stats */}
            <div className="absolute bottom-8 left-0 right-0 z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-4">
                    <div className="text-center space-y-2">
                        <div className="text-3xl md:text-4xl font-black text-white">50K+</div>
                        <div className="text-sm font-medium text-gray-200">Happy Customers</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-3xl md:text-4xl font-black text-orange-300">25+</div>
                        <div className="text-sm font-medium text-gray-200">Restaurant Partners</div>
                        </div>
                    <div className="text-center space-y-2">
                        <div className="text-3xl md:text-4xl font-black text-yellow-300">4.9★</div>
                        <div className="text-sm font-medium text-gray-200">Average Rating</div>
                                </div>
                    <div className="text-center space-y-2">
                        <div className="text-3xl md:text-4xl font-black text-pink-300">30min</div>
                        <div className="text-sm font-medium text-gray-200">Delivery Time</div>
                                </div>
                            </div>
                        </div>

            {/* Delivery Area Not Available Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold text-orange-600">
                            📍 Delivery Not Available Yet
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600">
                            We&apos;re not currently delivering to <span className="font-semibold text-orange-600">{zipCode}</span> yet, 
                            but we&apos;re expanding our delivery areas regularly!
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800">
                                💡 Submit a request and we&apos;ll notify you as soon as we start delivering to your area. 
                                We&apos;re always looking to expand our delivery network!
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <button
                            onClick={() => setShowDialog(false)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleRequestDelivery}
                            disabled={isSubmittingRequest || createLoading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Found Delivery Areas Dialog */}
            <Dialog open={showFoundAreasDialog} onOpenChange={setShowFoundAreasDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold text-green-600">
                            ✅ Great News! We Deliver to Your Area
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600">
                            Found {postCodes.length} delivery area(s) for {zipCode}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {postCodes.map((area, index) => (
                                <div key={area.id || index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                📍 {area.code}
                                            </h3>
                                            <div className="text-sm text-gray-600">
                                                <div>✅ Delivery Available</div>
                                            </div>
                                </div>
                                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                            Available
                                </div>
                            </div>
                        </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                🎉 Perfect! You can now browse our menu and place your order.
                            </p>
                    </div>
                </div>

                    <DialogFooter className="flex gap-2">
                        <button
                            onClick={() => setShowFoundAreasDialog(false)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                setShowFoundAreasDialog(false)
                            }}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            Browse Menu
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default HeroSection