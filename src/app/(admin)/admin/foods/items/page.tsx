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

const ItemPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterSize, setFilterSize] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMenu, setEditingMenu] = useState<any>(null);

    // Hooks
    const { menus, loading, error, refetch } = useMenus();
    const { deleteMenu, loading: deleteLoading } = useDeleteMenu();

    const filteredItems = menus.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.size?.size.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesCategory = filterCategory === 'All' || item.category?.name === filterCategory;
        const matchesSize = filterSize === 'All' || item.size?.size === filterSize;
        
        return matchesSearch && matchesStatus && matchesCategory && matchesSize;
    });

    const getStatusColor = (status: string | number) => {
        const statusStr = String(status);
        switch (statusStr) {
            case '1':
            case 'active':
                return 'bg-green-100 text-green-800';
            case '0':
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string | number) => {
        const statusStr = String(status);
        switch (statusStr) {
            case '1':
            case 'active':
                return 'Active';
            case '0':
            case 'inactive':
                return 'Inactive';
            default:
                return 'Unknown';
        }
    };

    const categories = [...new Set(menus.map(item => item.category?.name).filter(Boolean))];
    const sizesList = [...new Set(menus.map(item => item.size?.size).filter(Boolean))];

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
                                                {item.thumbnail && (
                                                    <div className="w-8 h-8 rounded overflow-hidden mr-2 relative flex-shrink-0">
                                                        <Image 
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${item.thumbnail}`} 
                                                            alt={item.thumbnail}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
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
                                                    onClick={() => handleDeleteMenu(item.id.toString())}
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
        </div>
    );
};

export default ItemPage;
