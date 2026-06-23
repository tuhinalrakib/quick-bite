"use client"

import React, { useState } from "react";
import { ShoppingBag, Eye, Calendar, CreditCard } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

// ডামি অর্ডার ডাটা
const initialOrders = [
    { id: "ORD-9832", customer: "Rahim Ali", date: "2026-06-22", items: "1x Classic Pizza, 2x Burger", total: 44.97, payment: "Paid", status: "Processing" },
    { id: "ORD-1204", customer: "Karim Hasan", date: "2026-06-23", items: "1x Decadent Cake", total: 14.99, payment: "Paid", status: "Pending" },
    { id: "ORD-5541", customer: "Sumaiya Khan", date: "2026-06-23", items: "3x Salads", total: 29.97, payment: "Failed", status: "Cancelled" },
];

const OrderManagementClient = () => {
    const [orders, setOrders] = useState(initialOrders);

    // অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন
    const handleStatusChange = (id, newStatus) => {
        setOrders(
            orders.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* হেডার */}
            <div className="border-b pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customer Orders</h1>
                <p className="text-sm text-gray-500">Track payments, manage delivery lifecycles, and update food order tasks.</p>
            </div>

            {/* অর্ডার ডাটা টেবিল */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-500 tracking-wider">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items Ordered</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">PayHere Payment</th>
                            <th className="p-4">Order Status</th>
                            <th className="p-4 text-center">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm text-gray-700">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                                    {order.id}
                                </td>
                                <td className="p-4">
                                    <div className="font-medium">{order.customer}</div>
                                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                        <Calendar className="h-3 w-3" /> {order.date}
                                    </div>
                                </td>
                                <td className="p-4 max-w-xs truncate text-gray-600">{order.items}</td>
                                <td className="p-4 font-semibold">${order.total.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${order.payment === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                        <CreditCard className="h-3 w-3" /> {order.payment}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`text-xs font-semibold rounded-lg border p-1.5 focus:outline-none bg-white ${order.status === "Pending" ? "text-amber-600 border-amber-200" :
                                                order.status === "Processing" ? "text-blue-600 border-blue-200" :
                                                    order.status === "Delivered" ? "text-green-600 border-green-200" :
                                                        "text-gray-500 border-gray-200"
                                            }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4 text-center">
                                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagementClient;