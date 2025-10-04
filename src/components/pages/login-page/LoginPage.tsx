'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, LogIn, ChefHat } from 'lucide-react'
import Image from 'next/image'
import Logo from '@/components/core/Logo'
import { useAuth, authAPI } from '@/lib/auth/useAuth'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { setUser, setLoading, loading, user, isAuthenticated } = useAuth()
    const router = useRouter()

    // Load email from localStorage on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('loginEmail');
        if (savedEmail) {
            setFormData(prev => ({
                ...prev,
                email: savedEmail
            }));
            // Clear the saved email after using it
            localStorage.removeItem('loginEmail');
        }
    }, []);

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
        setLoading(true)
        
        const result = await authAPI.login(formData.email, formData.password)
        
        if (result.success && result.user && result.token) {
            setUser(result.user, result.token)
            // Navigation will be handled by useEffect
        } else {
            // Handle error - you can add error state here if needed
            console.error('Login failed:', result.message)
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
                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-xl text-white/90 max-w-md">
                            Sign in to continue your culinary journey with us
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ChefHat size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                                Welcome Back
                            </span>
                        </h1>
                        <p className="text-gray-600">
                            Sign in to continue your culinary journey
                        </p>
                    </div>

                    {/* Login Form */}
                    <div >
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        placeholder={formData.email ? "" : "Enter your email"}
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
                                        placeholder="Enter your password"
                                        className="w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-12 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>


                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full bg-gradient-to-r from-orange-600 to-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-500">
                                    Don&apos;t have an account?{' '}
                                    <a
                                        href="/sign-up"
                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        Sign up here
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

export default LoginPage