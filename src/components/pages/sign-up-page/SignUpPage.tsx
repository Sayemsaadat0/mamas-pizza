'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from 'lucide-react'
import Image from 'next/image'
import Logo from '@/components/core/Logo'
import { useAuth, authAPI } from '@/lib/auth/useAuth'
import { useRouter } from 'next/navigation'

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const { setUser, setLoading, loading, user, isAuthenticated } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin' || user.role === 'staff') {
                router.replace('/admin')
            } else {
                router.replace('/')
            }
        }
    }, [isAuthenticated, user, router])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate passwords match
        if (formData.password !== formData.password_confirmation) {
            return
        }
        
        setLoading(true)
        
        const result = await authAPI.register(
            formData.name,
            formData.email,
            formData.password,
            formData.password_confirmation
        )
        
        if (result.success && result.user && result.token) {
            setUser(result.user, result.token)
            // Navigation will be handled by useEffect
        } else {
            // Handle error - you can add error state here if needed
            console.error('Registration failed:', result.message)
        }
        
        setLoading(false)
    }

    return (
        <div className="min-h-[calc(100vh)] flex">
            {/* Left Side - Food Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                    src="/hero.jpg"
                    alt="Delicious Food"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center flex flex-col items-center text-white p-8">
                        <Logo />
                        <h2 className="text-4xl font-bold mb-4">Join Us Today!</h2>
                        <p className="text-xl text-white/90 max-w-md">
                            Create your account and start your culinary journey with us
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-600">Sign up to get started</p>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                                Create Account
                            </span>
                        </h1>
                        <p className="text-gray-600">
                            Join us and start your culinary journey
                        </p>
                    </div>

                    {/* Sign Up Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create a password"
                                        className="w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-12 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className="w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-12 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 accent-orange-500 text-white mt-1"
                                />
                                <label className="ml-2 text-sm text-gray-600">
                                    I agree to the{' '}
                                    <a href="/terms-condition" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Terms and Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy-policy" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full bg-gradient-to-r from-orange-600 to-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <UserPlus size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-500">
                                    Already have an account?{' '}
                                    <a
                                        href="/login"
                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        Sign in here
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
