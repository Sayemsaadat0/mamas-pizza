'use client';

import React, { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/category.hook';
import { useSizes } from '@/hooks/sizes.hook';
import { useAuth } from '@/lib/auth/useAuth';
import { ADMIN_OFFERS_API } from '@/app/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface OfferFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    instance?: any; // Offer instance for editing
    onSuccess?: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({
    open,
    setOpen,
    instance,
    onSuccess
}) => {
    // Form states
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        buy_quantity: 1,
        get_quantity: 1,
        offer_price: '',
        category_id: '',
        size_id: '',
        terms_conditions: '',
        thumbnail: null as File | null
    });
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hooks
    const { token } = useAuth();
    const { categories, loading: categoriesLoading } = useCategories();
    const { sizes, loading: sizesLoading } = useSizes();

    const isEdit = !!instance;

    // Initialize form data when instance changes
    useEffect(() => {
        if (instance) {
            setFormData({
                title: instance.title || '',
                description: instance.description || '',
                buy_quantity: instance.buy_quantity || 1,
                get_quantity: instance.get_quantity || 1,
                offer_price: instance.offer_price || '',
                category_id: instance.category_id?.toString() || '',
                size_id: instance.size_id?.toString() || '',
                terms_conditions: instance.terms_conditions || '',
                thumbnail: null
            });

            // Set thumbnail preview if exists
            if (instance.thumbnail) {
                setThumbnailPreview(`${process.env.NEXT_PUBLIC_API_URL}/${instance.thumbnail}`);
            }

        } else {
            // Reset form for new offer
            setFormData({
                title: '',
                description: '',
                buy_quantity: 1,
                get_quantity: 1,
                offer_price: '',
                category_id: '',
                size_id: '',
                terms_conditions: '',
                thumbnail: null
            });
            setThumbnailPreview(null);
        }
    }, [instance]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, thumbnail: file }));
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
        setThumbnailPreview(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim() || !formData.offer_price) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('description', formData.description.trim());
            submitData.append('buy_quantity', formData.buy_quantity.toString());
            submitData.append('get_quantity', formData.get_quantity.toString());
            submitData.append('offer_price', formData.offer_price);
            submitData.append('category_id', formData.category_id);
            submitData.append('size_id', formData.size_id);
            submitData.append('terms_conditions', formData.terms_conditions);

            if (formData.thumbnail) {
                submitData.append('thumbnail', formData.thumbnail);
            }

            // Determine API endpoint and method
            const apiUrl = isEdit
                ? `${ADMIN_OFFERS_API}/${instance.id}/update`
                : ADMIN_OFFERS_API;
            const method = isEdit ? 'POST' : 'POST';

            // Make API call
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: submitData,
            });

            const data = await response.json();

            if (data.success) {
                toast.success(isEdit ? 'Offer updated successfully!' : 'Offer created successfully!');
                onSuccess?.();
                setOpen(false);
                resetForm();
            } else {
                console.error('Error with offer:', data.message);
                toast.error(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting offer:', error);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            buy_quantity: 1,
            get_quantity: 1,
            offer_price: '',
            category_id: '',
            size_id: '',
            terms_conditions: '',
            thumbnail: null
        });
        setThumbnailPreview(null);
    };

    const handleClose = () => {
        setOpen(false);
        if (!isEdit) {
            resetForm();
        }
    };


    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Offer' : 'Create New Offer'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the offer information below.'
                            : 'Fill in the details to create a new promotional offer.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offer Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Buy 1 Get 1 Free Pizza"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the offer details..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Offer Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buy Quantity *
                            </label>
                            <input
                                type="number"
                                name="buy_quantity"
                                value={formData.buy_quantity}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Get Quantity *
                            </label>
                            <input
                                type="number"
                                name="get_quantity"
                                value={formData.get_quantity}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Offer Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="offer_price"
                                value={formData.offer_price}
                                onChange={handleInputChange}
                                placeholder="12.99"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Category and Size Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Filter
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                disabled={categoriesLoading}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {categoriesLoading && (
                                <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Size Filter
                            </label>
                            <select
                                name="size_id"
                                value={formData.size_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                disabled={sizesLoading}
                            >
                                <option value="">All Sizes</option>
                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.size}
                                    </option>
                                ))}
                            </select>
                            {sizesLoading && (
                                <p className="text-sm text-gray-500 mt-1">Loading sizes...</p>
                            )}
                        </div>
                    </div>


                    {/* Terms and Conditions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Terms & Conditions
                        </label>
                        <textarea
                            name="terms_conditions"
                            value={formData.terms_conditions}
                            onChange={handleInputChange}
                            placeholder="Enter terms and conditions for this offer..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>


                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offer Image
                        </label>
                        <div className="space-y-4">
                            {/* File Input */}
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                    />
                                </label>
                            </div>

                            {/* Thumbnail Preview */}
                            {thumbnailPreview && (
                                <div className="relative inline-block">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={thumbnailPreview}
                                        alt="Offer preview"
                                        className="w-32 h-32 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeThumbnail}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-3 justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.title.trim() || !formData.description.trim() || !formData.offer_price}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? 'Update Offer' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default OfferForm;