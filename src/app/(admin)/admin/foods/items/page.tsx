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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ItemPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [editingMenu, setEditingMenu] = useState<any>(null);

    // Hooks
    const { menus, loading, error, refetch } = useMenus();
    const { deleteMenu, loading: deleteLoading } = useDeleteMenu();

    const filteredItems = menus.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesCategory = filterCategory === 'All' || item.category.name === filterCategory;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const categories = [...new Set(menus.map(item => item.category.name))];

    // Handler functions
    const handleDeleteMenu = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            const result = await deleteMenu(id);
            if (result) {
                refetch();
            }
        }
    };

    const openEditModal = (menu: any) => {
        setEditingMenu(menu);
        setShowEditModal(true);
    };

    const formatPrice = (price: string) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Food Items</h1>
                    <p className="text-gray-600">Manage your food items and menu</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/foods/category"
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <FolderOpen size={20} />
                        Manage Categories
                    </Link>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <Plus size={20} />
                        Add Food Item
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search food items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                
                    {/* Category Filter */}
                    <div className="lg:w-48">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                </div>
                
                    {/* Status Filter */}
                    <div className="lg:w-48">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Food Items Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <span className="ml-2 text-gray-600">Loading menu items...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Food Item
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Regular Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actual Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {item.thumbnail && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 relative">
                                                        <Image 
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${item.thumbnail}`} 
                                                            alt={item.thumbnail}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {item.details}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatPrice(item?.prev_price.toString())}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-green-600">
                                                {formatPrice(item?.main_price.toString())}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteMenu(item.id.toString())}
                                                    disabled={deleteLoading}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
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
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No food items found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Add Your First Food Item
                    </button>
                </div>
            )}

            {/* Add Menu Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                        <DialogDescription>
                            Menu item creation form would go here...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 justify-end mt-4">
                        <button 
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Create Menu Item
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Menu Modal */}
            <Dialog open={showEditModal} onOpenChange={(open) => {
                setShowEditModal(open);
                if (!open) setEditingMenu(null);
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Menu Item</DialogTitle>
                        <DialogDescription>
                            Menu item editing form would go here...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 justify-end mt-4">
                        <button 
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingMenu(null);
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingMenu(null);
                            }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Update Menu Item
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ItemPage;
