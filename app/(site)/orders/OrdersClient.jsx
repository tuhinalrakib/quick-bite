"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Clock,
  Utensils,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";
import Spinner from "@/components/ui/Spinner";

const OrdersClient = () => {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.user);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ORDERS);
        if (response.data?.success) {
          setOrders(response.data.orders);
        } else {
          setError("Failed to load orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, router]);

  const toggleExpandOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Processing":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "Delivered":
        return "bg-green-50 text-green-600 border border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 text-center">
        <Spinner />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/browse-food" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#E15B1E] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Menu
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="text-[#E15B1E] h-7 w-7" />
            My Orders
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm max-w-md mx-auto flex flex-col items-center">
            <div className="p-6 bg-orange-50 text-[#E15B1E] rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 stroke-1.25" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 text-sm mb-8">
              You haven't placed any food orders yet. Explore our menu to order something delicious!
            </p>
            <Button
              onClick={() => router.push("/browse-food")}
              className="bg-[#E15B1E] hover:bg-[#c84e17] text-white px-8 py-3 rounded-2xl font-bold shadow-md transition-all"
            >
              Browse Food Menu
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div 
                  key={order._id} 
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Order Card Header */}
                  <div 
                    onClick={() => toggleExpandOrder(order._id)}
                    className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formattedDate}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400 font-semibold">Total Amount</p>
                        <p className="text-lg font-extrabold text-[#E15B1E]">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div className="text-gray-400 bg-gray-50 p-2 rounded-xl">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Tracker and Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 space-y-8 bg-gray-50/30">
                      
                      {/* Delivery Status Visual Stepper */}
                      {order.orderStatus !== "Cancelled" && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Status Tracker</h4>
                          <div className="grid grid-cols-3 relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-[16.6%] right-[16.6%] h-[2px] bg-gray-200 -z-10">
                              <div 
                                className="h-full bg-[#E15B1E] transition-all duration-500" 
                                style={{ 
                                  width: order.orderStatus === "Pending" ? "0%" : 
                                         order.orderStatus === "Processing" ? "50%" : "100%" 
                                }}
                              />
                            </div>

                            {/* Step 1: Placed */}
                            <div className="flex flex-col items-center text-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                order.orderStatus === "Pending" || order.orderStatus === "Processing" || order.orderStatus === "Delivered"
                                  ? "bg-[#E15B1E] text-white ring-4 ring-orange-100" 
                                  : "bg-gray-200 text-gray-400"
                              }`}>
                                <Clock className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-bold text-gray-800 mt-2">Placed</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">Kitchen notified</span>
                            </div>

                            {/* Step 2: Processing */}
                            <div className="flex flex-col items-center text-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                order.orderStatus === "Processing" || order.orderStatus === "Delivered"
                                  ? "bg-[#E15B1E] text-white ring-4 ring-orange-100" 
                                  : "bg-gray-200 text-gray-400"
                              }`}>
                                <Utensils className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-bold text-gray-800 mt-2">Preparing</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">Cooking meals</span>
                            </div>

                            {/* Step 3: Delivered */}
                            <div className="flex flex-col items-center text-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                order.orderStatus === "Delivered"
                                  ? "bg-[#E15B1E] text-white ring-4 ring-orange-100" 
                                  : "bg-gray-200 text-gray-400"
                              }`}>
                                <Truck className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-bold text-gray-800 mt-2">Delivered</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">Arrived safely</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {order.orderStatus === "Cancelled" && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <div>
                            <p className="font-bold">This order was cancelled</p>
                            <p className="text-xs text-red-500/80">Please contact customer service if you have any questions.</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        {/* Left: Items List */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Ordered</h4>
                          <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-4 space-y-3.5">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center gap-4 pt-3.5 first:pt-0">
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="h-10 w-10 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                                    />
                                  )}
                                  <div>
                                    <h5 className="font-bold text-sm text-gray-900 leading-snug">{item.name}</h5>
                                    <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-extrabold text-sm text-gray-800">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Payment & Delivery Details */}
                        <div className="space-y-6">
                          {/* Payment Meta */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Details</h4>
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 text-xs font-semibold text-gray-600">
                              <div className="flex justify-between">
                                <span>Method</span>
                                <span className="text-gray-900 uppercase">
                                  {order.paymentMethod === "cod" ? "💵 Cash On Delivery" : "💳 Online Payment"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Status</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                                  {order.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Address Details */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Information</h4>
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 text-xs font-semibold text-gray-600">
                              <p className="flex items-center gap-2 text-gray-900 font-bold">
                                <span className="bg-gray-100 p-1 rounded-md text-gray-500">
                                  <Clock className="h-3.5 w-3.5" />
                                </span>
                                {order.shippingDetails.name}
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="bg-gray-100 p-1 rounded-md text-gray-500">
                                  <Phone className="h-3.5 w-3.5" />
                                </span>
                                {order.shippingDetails.phone}
                              </p>
                              <p className="flex items-start gap-2 leading-relaxed">
                                <span className="bg-gray-100 p-1 rounded-md text-gray-500 mt-0.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                </span>
                                {order.shippingDetails.address}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersClient;
