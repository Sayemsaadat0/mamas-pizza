'use client';
import React from 'react';
import Link from 'next/link';
import {
    User,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { useSidebar } from '@/app/(admin)/template';
import NotificationDropdown from './NotificationDropdown';

const AdminNavbar: React.FC = () => {
    const { isCollapsed, setIsCollapsed } = useSidebar();

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Left side - Search */}
                <div className="flex items-center gap-4 flex-1">

                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                    <p>Admin Dashboard</p>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* Profile Link */}
                    <Link
                        href="/admin/profile"
                            className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">Admin User</p>
                                <p className="text-xs text-gray-500">admin@foodapp.com</p>
                            </div>
                                </Link>
                </div>
            </div>


        </header>
    );
};

export default AdminNavbar;
