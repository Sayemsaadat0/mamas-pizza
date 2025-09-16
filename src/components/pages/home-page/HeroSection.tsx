import Image from "next/image"

const HeroSection = () => {
    return (
        <div className="min-h-screen mt-40">
            {/* Hero Section */}
            <section className="ah-container py-8 sm:py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                        {/* Small Top Text */}
                        <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                            Fast & Fresh Delivery
                        </div>

                        {/* Large Title */}
                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                                Delicious
                                <span className="text-orange-600 block">Food</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                                    Delivered
                                </span>
                            </h1>
                        </div>

                        {/* Short Description */}
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Get your favorite meals delivered hot and fresh to your doorstep in under 30 minutes.
                            From local favorites to international cuisine, we&apos;ve got you covered.
                        </p>

                        {/* CTA Section */}
                        <div className="flex flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                            <button className="group bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                                Order Now
                                <svg className="w-5 h-5 sm:w-7 sm:h-7 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <button className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                                View Menu
                            </button>
                        </div>

                        {/* Stats - Mobile Only */}
                        <div className="flex items-center justify-center lg:hidden space-x-6 pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">50K+</div>
                                <div className="text-xs text-gray-600">Happy Customers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">25+</div>
                                <div className="text-xs text-gray-600">Restaurant Partners</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                                <div className="text-xs text-gray-600">Average Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-full h-[400px] lg:h-[600px] xl:h-[700px] ">
                        <div className="relative w-full h-full z-10 rounded-2xl sm:rounded-3xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Delicious food spread"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Floating Card Top Right */}
                        <div className="absolute z-10 top-2 right-2 sm:-top-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm sm:text-base">🍔</span>
                                </div>
                                <div className="">
                                    <div className="font-semibold text-sm">Fast Delivery</div>
                                    <div className="text-xs text-gray-600">30 mins</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card Bottom Left */}
                        <div className="absolute z-10 bottom-2 left-2 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm sm:text-base">⭐</span>
                                </div>
                                <div className="">
                                    <div className="font-semibold text-sm">Top Rated</div>
                                    <div className="text-xs text-gray-600">4.9/5 stars</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSection