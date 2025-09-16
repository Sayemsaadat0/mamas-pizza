'use client';
import React, { useState } from 'react';
import { 
    Search, 
    Eye, 
    Edit, 
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    Package,
    DollarSign,
    Calendar,
    User
} from 'lucide-react';

// Mock data for orders
const mockOrders = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        email: 'john@example.com',
        items: 3,
        total: 45.99,
        status: 'Delivered',
        orderDate: '2024-01-20',
        deliveryDate: '2024-01-21',
        paymentMethod: 'Credit Card',
        address: '123 Main St, New York, NY'
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        email: 'jane@example.com',
        items: 2,
        total: 28.50,
        status: 'Processing',
        orderDate: '2024-01-21',
        deliveryDate: null,
        paymentMethod: 'PayPal',
        address: '456 Oak Ave, Los Angeles, CA'
    },
    {
        id: 'ORD-003',
        customer: 'Mike Johnson',
        email: 'mike@example.com',
        items: 1,
        total: 15.99,
        status: 'Shipped',
        orderDate: '2024-01-19',
        deliveryDate: '2024-01-22',
        paymentMethod: 'Credit Card',
        address: '789 Pine St, Chicago, IL'
    },
    {
        id: 'ORD-004',
        customer: 'Sarah Wilson',
        email: 'sarah@example.com',
        items: 4,
        total: 67.25,
        status: 'Cancelled',
        orderDate: '2024-01-18',
        deliveryDate: null,
        paymentMethod: 'Credit Card',
        address: '321 Elm St, Houston, TX'
    },
    {
        id: 'ORD-005',
        customer: 'David Brown',
        email: 'david@example.com',
        items: 2,
        total: 32.75,
        status: 'Pending',
        orderDate: '2024-01-22',
        deliveryDate: null,
        paymentMethod: 'Cash on Delivery',
        address: '654 Maple Dr, Phoenix, AZ'
    }
];

const OrdersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState('All');

    const filteredOrders = mockOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Pending':
                return 'bg-gray-100 text-gray-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle size={16} />;
            case 'Shipped':
                return <Truck size={16} />;
            case 'Processing':
                return <Package size={16} />;
            case 'Pending':
                return <Clock size={16} />;
            case 'Cancelled':
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const totalRevenue = mockOrders
        .filter(order => order.status === 'Delivered')
        .reduce((sum, order) => sum + order.total, 0);

    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(order => order.status === 'Pending').length;
    const processingOrders = mockOrders.filter(order => order.status === 'Processing').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600">Track and manage customer orders</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <Truck size={20} />
                        Track Orders
                    </button>
                    <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        <Package size={20} />
                        Export Orders
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Processing</p>
                            <p className="text-2xl font-bold text-orange-600">{processingOrders}</p>
                        </div>
                        <Package className="w-8 h-8 text-orange-500" />
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
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="lg:w-48">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="lg:w-48">
                        <select
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All Time</option>
                            <option value="Today">Today</option>
                            <option value="This Week">This Week</option>
                            <option value="This Month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                        <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                                <div className="text-sm text-gray-500">{order.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.items} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button className="text-blue-600 hover:text-blue-900 p-1" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            <button className="text-orange-600 hover:text-orange-900 p-1" title="Edit Order">
                                                <Edit size={16} />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900 p-1" title="Track Order">
                                                <Truck size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                    <span className="font-medium">{mockOrders.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md">
                        1
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
