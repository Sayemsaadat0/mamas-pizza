'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FolderOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Loader2
} from 'lucide-react';
import { useMenus, useDeleteMenu } from '@/hooks/menu.hook';
import AddItemForm from '@/components/admin/AddItemForm';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ItemPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterSize, setFilterSize] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMenu, setEditingMenu] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    // Hooks
    const { menus, loading, error, refetch } = useMenus();
    const { deleteMenu, loading: deleteLoading } = useDeleteMenu();

    const filteredItems = menus.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.size?.size.toLowerCase().includes(searchQuery.toLowerCase());
        const status = item.status as any;
        const isActive = status === true || status === 'true' || status === 1 || status === '1' || status === 'active';
        const isInactive = status === false || status === 'false' || status === 0 || status === '0' || status === 'inactive';
        const matchesStatus = filterStatus === 'All' || 
            (filterStatus === '1' && isActive) ||
            (filterStatus === '0' && isInactive);
        const matchesCategory = filterCategory === 'All' || item.category?.name === filterCategory;
        const matchesSize = filterSize === 'All' || item.size?.size === filterSize;

        return matchesSearch && matchesStatus && matchesCategory && matchesSize;
    });

    const getStatusColor = (status: string | number | boolean) => {
        // Handle API response: true/false (boolean) or 1/0 (number/string)
        if (status === true || status === 'true' || status === 1 || status === '1' || status === 'active') {
            return 'bg-green-100 text-green-800';
        } else if (status === false || status === 'false' || status === 0 || status === '0' || status === 'inactive') {
            return 'bg-red-100 text-red-800';
        } else {
            return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string | number | boolean) => {
        // Handle API response: true/false (boolean) or 1/0 (number/string)
        if (status === true || status === 'true' || status === 1 || status === '1' || status === 'active') {
            return 'Active';
        } else if (status === false || status === 'false' || status === 0 || status === '0' || status === 'inactive') {
            return 'Inactive';
        } else {
            return 'Unknown';
        }
    };

    const categories = [...new Set(menus.map(item => item.category?.name).filter(Boolean))];
    const sizesList = [...new Set(menus.map(item => item.size?.size).filter(Boolean))];

    // Handler functions
    const handleDeleteClick = (item: any) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            const result = await deleteMenu(itemToDelete.id.toString());
            if (result) {
                refetch();
                setDeleteDialogOpen(false);
                setItemToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const openEditModal = (menu: any) => {
        setEditingMenu(menu);
    };

    const formatPrice = (price: string | number | undefined) => {
        if (!price) return '$0.00';
        return `$${parseFloat(price.toString()).toFixed(2)}`;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Food Items</h1>
                    <p className="text-sm text-gray-600">Manage your food items and menu</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/foods/category"
                        className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <FolderOpen size={16} />
                        <span className="hidden sm:inline">Manage Categories</span>
                        <span className="sm:hidden">Categories</span>
                    </Link>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add Food Item</span>
                        <span className="sm:hidden">Add Item</span>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error: {error}</p>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search items, categories, or sizes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="sm:w-40">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Size Filter */}
                    <div className="sm:w-32">
                        <select
                            value={filterSize}
                            onChange={(e) => setFilterSize(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All Sizes</option>
                            {sizesList.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="sm:w-32">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Food Items Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <span className="ml-2 text-sm text-gray-600">Loading...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Category
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Size
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Regular
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                                        Status
                                    </th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded overflow-hidden mr-3 relative flex-shrink-0 bg-gray-100">
                                                    {item.thumbnail ? (
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${item.thumbnail}`}
                                                            alt={item.name}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover w-full h-full"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs ${item.thumbnail ? 'hidden' : ''}`}>
                                                        No Image
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate max-w-32 sm:max-w-48">
                                                        {item.details}
                                                    </div>
                                                    {/* Mobile: Show category, size and status on small screens */}
                                                    <div className="sm:hidden flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-600">
                                                            {item.category?.name || 'No Category'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {item.size?.size || 'No Size'}
                                                        </span>
                                                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(item.status || '0')}`}>
                                                            {getStatusText(item.status || '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 hidden sm:table-cell">
                                            <div className="truncate max-w-24">
                                                {item.category?.name || 'No Category'}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 hidden md:table-cell">
                                            <div className="truncate">
                                                {item.size?.size || 'No Size'}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 hidden lg:table-cell">
                                            <div className="truncate">
                                                {formatPrice(item?.prev_price)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="text-sm font-medium text-green-600">
                                                {formatPrice(item?.main_price)}
                                            </div>
                                            {/* Mobile: Show regular price on small screens */}
                                            <div className="lg:hidden text-xs text-gray-500">
                                                Reg: {formatPrice(item?.prev_price)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 hidden xl:table-cell">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status || '0')}`}>
                                                {getStatusText(item.status || '0')}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    disabled={deleteLoading}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {!loading && filteredItems.length === 0 && (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">No food items found</h3>
                    <p className="text-sm text-gray-500 mb-3">Try adjusting your search or filter criteria</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-orange-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Add Your First Food Item
                    </button>
                </div>
            )}

            {/* Add/Edit Item Form */}
            <AddItemForm
                open={showAddModal || !!editingMenu}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowAddModal(false);
                        setEditingMenu(null);
                    }
                }}
                instance={editingMenu}
                onSuccess={() => {
                    refetch();
                    setShowAddModal(false);
                    setEditingMenu(null);
                }}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{itemToDelete?.name}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ItemPage;
