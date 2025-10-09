'use client';
import React, { useState } from 'react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    Percent,
    Loader2
} from 'lucide-react';
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
import OfferForm from './_components/OfferForm';
import { useBogoOffers, useDeleteBogoOffer, BogoOffer } from '@/hooks/bogo-offer.hooks';


const OffersPage: React.FC = () => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    
    // Get bogo offers from API
    const { bogoOffers, loading: bogoOffersLoading, error: bogoOffersError, refetch } = useBogoOffers();
    const { deleteBogoOffer, loading: deleteLoading } = useDeleteBogoOffer();

    const openEdit = (offer: any) => {
        setEditingOfferId(String(offer.id));
        setEditOpen(true);
    };

    const openAdd = () => {
        setAddOpen(true);
    };

    const handleSuccess = () => {
        // Refresh offers list
        refetch();
    };

    const askDelete = (id: number) => {
        setDeletingOfferId(String(id));
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingOfferId) return;
        
        const result = await deleteBogoOffer(Number(deletingOfferId));
        if (result) {
            refetch(); // Refresh the list
        }
        
        setDeleteOpen(false);
        setDeletingOfferId(null);
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    const getTypeColor = (offer: any) => {
        if (offer.get_quantity > 0) {
            return 'bg-purple-100 text-purple-800';
        }
        return 'bg-blue-100 text-blue-800';
    };


    return (
        <>
        <div className="space-y-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Offers</h1>
                    <p className="text-xs text-gray-600">Manage promotional offers and discounts</p>
                </div>
                <button 
                    onClick={openAdd}
                    className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-600 transition-colors"
                >
                    <Plus size={14} />
                    Add Offer
                </button>
            </div>



            {/* Offers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {bogoOffersLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <span className="ml-2 text-gray-600 text-sm">Loading offers...</span>
                    </div>
                ) : bogoOffersError ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <p className="text-red-600 mb-2 text-sm">Error loading offers</p>
                            <p className="text-gray-500 text-xs">{bogoOffersError}</p>
                            <button 
                                onClick={() => refetch()}
                                className="mt-3 px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                            <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Offer Details
                                        </th>
                                            <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            BOGO Details
                                        </th>
                                            <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                            <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category/Size
                                        </th>
                                            <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                            <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {bogoOffers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-2 py-6 text-center text-gray-500 text-xs">
                                            No offers found
                                        </td>
                                    </tr>
                                ) : (
                                    bogoOffers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-1.5">
                                        <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Percent className="w-4 h-4 text-orange-600" />
                                            </div>
                                                    <div className="ml-2 min-w-0 flex-1">
                                                        <div className="text-xs font-medium text-gray-900 truncate">{offer.title}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{offer.description}</div>
                                                        <div className="text-xs text-gray-400">ID: #{offer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="space-y-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTypeColor(offer)}`}>
                                                        {offer.get_quantity > 0 ? `Buy ${offer.buy_quantity} Get ${offer.get_quantity}` : 'Fixed Price'}
                                                    </span>
                                                    {offer.get_quantity > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            BOGO Offer
                                                        </div>
                                                    )}
                                                </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="text-xs font-medium text-gray-900">
                                                    ${offer.offer_price}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {offer.get_quantity > 0 ? 'Per set' : 'Fixed price'}
                                                </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="space-y-1">
                                                    {offer.category && (
                                                        <div className="text-xs text-gray-900">
                                                            <span className="font-medium">Category:</span> {offer.category.name}
                                                        </div>
                                                    )}
                                                    {offer.size && (
                                                        <div className="text-xs text-gray-500">
                                                            <span className="font-medium">Size:</span> {offer.size.size}
                                                        </div>
                                                    )}
                                                    {!offer.category && !offer.size && (
                                                        <div className="text-xs text-gray-400">All items</div>
                                                    )}
                                                </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusColor(offer.is_active)}`}>
                                            {offer.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="flex items-center gap-1">
                                                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="View Details">
                                                        <Eye size={14} />
                                            </button>
                                                    <button className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50" onClick={() => openEdit(offer)} title="Edit Offer">
                                                        <Edit size={14} />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" onClick={() => askDelete(offer.id)} disabled={deleteLoading} title="Delete Offer">
                                                        <Trash2 size={14} />
                                                    </button>
                                        </div>
                                    </td>
                                </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>

        {/* Add/Edit Dialog */}
        <OfferForm 
            open={editOpen || addOpen} 
            setOpen={(open) => {
                if (!open) {
                    setEditOpen(false);
                    setAddOpen(false);
                    setEditingOfferId(null);
                }
            }}
            instance={editingOfferId ? bogoOffers.find(o => o.id === Number(editingOfferId)) : undefined}
            onSuccess={handleSuccess}
        />

        {/* Delete Confirm */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete offer?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the offer.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
};

export default OffersPage;