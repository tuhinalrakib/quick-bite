"use client"

import React, { useEffect, useState } from "react";
import { ShoppingBag, Eye, Calendar, CreditCard, Clock, User, AlertCircle } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";
import Spinner from "../../../../components/ui/Spinner";

const OrderManagementClient = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await apiClient.get(`${API_ENDPOINTS.ORDERS}/all`);
            if (res.data?.success) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.error("Error fetching admin orders:", err);
            setError(err.response?.data?.message || err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন
    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await apiClient.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, { status: newStatus });
            if (res.data?.success) {
                // Update local status representation
                setOrders(
                    orders.map((order) => (order._id === id ? { 
                        ...order, 
                        orderStatus: newStatus,
                        paymentStatus: newStatus === "Delivered" && order.paymentMethod === "cod" ? "Paid" : order.paymentStatus 
                    } : order))
                );
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert(err.response?.data?.message || "Failed to update order status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* হেডার */}
            <div className="border-b pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customer Orders</h1>
                <p className="text-sm text-gray-500">Track payments, manage delivery lifecycles, and update food order tasks.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* অর্ডার ডাটা টেবিল */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-500 tracking-wider">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items Ordered</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Payment Method & Status</th>
                            <th className="p-4">Order Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm text-gray-700">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                                    No customer orders placed yet.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                });

                                const itemsText = order.items
                                    .map((item) => `${item.quantity}x ${item.name}`)
                                    .join(", ");

                                return (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4 text-gray-400" />
                                            {order._id.substring(order._id.length - 8).toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{order.shippingDetails?.name || order.user?.name || "Guest User"}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                <Calendar className="h-3 w-3" /> {formattedDate}
                                            </div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                <User className="h-3 w-3" /> {order.shippingDetails?.phone || "No phone"}
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs truncate text-gray-600 font-medium" title={itemsText}>
                                            {itemsText}
                                        </td>
                                        <td className="p-4 font-extrabold text-[#E15B1E]">${order.totalAmount.toFixed(2)}</td>
                                        <td className="p-4 space-y-1">
                                            <div className="text-xs text-gray-500 font-semibold uppercase">
                                                {order.paymentMethod === "cod" ? "💵 COD" : "💳 Online"}
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                order.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                                                order.paymentStatus === "Failed" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                                            }`}>
                                                <CreditCard className="h-3 w-3" /> {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`text-xs font-bold rounded-lg border p-1.5 focus:outline-none bg-white ${
                                                    order.orderStatus === "Pending" ? "text-amber-600 border-amber-200 bg-amber-50/50" :
                                                    order.orderStatus === "Processing" ? "text-blue-600 border-blue-200 bg-blue-50/50" :
                                                    order.orderStatus === "Delivered" ? "text-green-600 border-green-200 bg-green-50/50" :
                                                    "text-red-500 border-red-200 bg-red-50/50"
                                                }`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagementClient;