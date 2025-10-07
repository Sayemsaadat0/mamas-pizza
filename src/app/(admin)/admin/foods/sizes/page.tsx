'use client';
import React, { useState } from 'react';
import { 
    Search, 
    Edit,
    Trash2, 
    Loader2,
} from 'lucide-react';
import { useSizes, useCreateSize, useUpdateSize, useDeleteSize } from '@/hooks/sizes.hook';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const SizesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSize, setEditingSize] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingSizeId, setDeletingSizeId] = useState<string | null>(null);
    
    // Form states
    const [newSize, setNewSize] = useState('');
    const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');
    const [editSize, setEditSize] = useState('');
    const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');

    // Hooks
    const { sizes, loading, error, refetch } = useSizes();
    const { createSize, loading: createLoading } = useCreateSize();
    const { updateSize, loading: updateLoading } = useUpdateSize();
    const { deleteSize, loading: deleteLoading } = useDeleteSize();

    const filteredSizes = sizes.filter(size => {
        const sizeName = String(size.size || '').toLowerCase();
        const searchTerm = searchQuery.toLowerCase();
        const matchesSearch = sizeName.includes(searchTerm);
        const statusStr = String(size.status || 'inactive').toLowerCase();
        const matchesStatus = filterStatus === 'All' || statusStr === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string | number) => {
        const statusStr = String(status || 'inactive').toLowerCase();
        switch (statusStr) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handler functions
    const handleCreateSize = async () => {
        const newSizeStr = String(newSize || '').trim();
        if (!newSizeStr) return;
        
        const result = await createSize({ 
            size: newSizeStr, 
            status: newStatus 
        });
        if (result) {
            setNewSize('');
            setNewStatus('active');
            refetch();
        }
    };

    const handleUpdateSize = async () => {
        const editSizeStr = String(editSize || '').trim();
        if (!editSizeStr || !editingSize) return;
        
        const result = await updateSize(editingSize.id, { 
            size: editSizeStr, 
            status: editStatus 
        });
        if (result) {
            setEditSize('');
            setEditStatus('active');
            setEditingSize(null);
            setShowEditModal(false);
            refetch();
        }
    };

    const handleDeleteSize = async () => {
        if (!deletingSizeId) return;
        
        const result = await deleteSize(deletingSizeId);
        if (result) {
            setDeletingSizeId(null);
            setShowDeleteModal(false);
            refetch();
        }
    };

    const openEditModal = (size: any) => {
        setEditingSize(size);
        setEditSize(size.size);
        setEditStatus(size.status);
        setShowEditModal(true);
    };

    const openDeleteModal = (sizeId: string) => {
        setDeletingSizeId(sizeId);
        setShowDeleteModal(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Food Sizes</h1>
                    <p className="text-gray-600">Manage your food sizes and portions</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error: {error}</p>
                </div>
            )}

            {/* Form - Single Row */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Size Name
                        </label>
                        <input
                            type="text"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            placeholder="Enter size name (e.g., Small, Medium, Large)..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div className="sm:w-40">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as 'active' | 'inactive')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={handleCreateSize}
                            disabled={createLoading || !String(newSize || '').trim()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {createLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Add Size
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search sizes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    {/* Status Filter */}
                    <div className="sm:w-40">
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

            {/* Sizes Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <span className="ml-2 text-gray-600">Loading sizes...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Updated Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSizes.map((size) => (
                                    <tr key={size.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {String(size.size || 'N/A')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(String(size.status || 'inactive'))}`}>
                                                {String(size.status || 'inactive').charAt(0).toUpperCase() + String(size.status || 'inactive').slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(size.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(size.updated_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(size)}
                                                    className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(size.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
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
            {filteredSizes.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sizes found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <button 
                        onClick={() => {
                            // Focus on the form input
                            const input = document.querySelector('input[placeholder*="Enter size name"]') as HTMLInputElement;
                            if (input) input.focus();
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Add Your First Size
                    </button>
                </div>
            )}

            {/* Edit Size Modal */}
            <Dialog open={showEditModal} onOpenChange={(open) => {
                setShowEditModal(open);
                if (!open) {
                    setEditingSize(null);
                    setEditSize('');
                    setEditStatus('active');
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Size</DialogTitle>
                        <DialogDescription>
                            Update the size information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Size Name
                            </label>
                            <input
                                type="text"
                                value={editSize}
                                onChange={(e) => setEditSize(e.target.value)}
                                placeholder="Enter size name..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as 'active' | 'inactive')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end mt-6">
                        <button 
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingSize(null);
                                setEditSize('');
                                setEditStatus('active');
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleUpdateSize}
                            disabled={updateLoading || !String(editSize || '').trim()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {updateLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Update Size
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the size
                            and remove it from your menu.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowDeleteModal(false);
                            setDeletingSizeId(null);
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSize}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SizesPage;
