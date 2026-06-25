
"use client"
import React, { useEffect, useState } from "react";
import { ShoppingBag, Users, DollarSign, Utensils, Calendar, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";

export const DashboardClient = () => {
  const {userInfo, isLoading} = useSelector((state)=>state.user)
  const router = useRouter()
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(()=>{
    if(!userInfo || userInfo.role !== "admin"){
      router.push("/")
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS);
        if (res.data) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  },[userInfo])

  const stats = [
    { label: "Total Orders", value: statsLoading ? "..." : statsData?.totalOrders ?? "0", icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Total Customers", value: statsLoading ? "..." : statsData?.totalCustomers ?? "0", icon: Users, color: "bg-green-500" },
    { label: "Total Revenue", value: statsLoading ? "..." : statsData?.totalRevenue ?? "$0.00", icon: DollarSign, color: "bg-amber-500" },
    { label: "Active Items", value: statsLoading ? "..." : statsData?.activeItems ?? "0", icon: Utensils, color: "bg-purple-500" },
  ];

  if(isLoading) return <Spinner />

  return (
    <div className="space-y-6 m-10">
      {/* স্ট্যাটস গ্রিড */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h4>
            </div>
            <div className={`p-3 rounded-xl text-white ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Activity */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-gray-500" />
          Recent Orders Activity
        </h3>
        
        {statsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E15B1E]"></div>
          </div>
        ) : !statsData?.recentOrders || statsData.recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-medium text-sm">
            No recent orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
                  <th className="pb-3 text-left">Order ID</th>
                  <th className="pb-3 text-left">Customer</th>
                  <th className="pb-3 text-left">Items</th>
                  <th className="pb-3 text-left">Total</th>
                  <th className="pb-3 text-left">Payment</th>
                  <th className="pb-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {statsData.recentOrders.map((order) => {
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
                      <td className="py-4 font-bold text-gray-900">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-gray-900">
                          {order.shippingDetails?.name || order.user?.name || "Guest User"}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" /> {formattedDate}
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 font-medium max-w-xs truncate" title={itemsText}>
                        {itemsText}
                      </td>
                      <td className="py-4 font-extrabold text-[#E15B1E]">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-4 space-y-1">
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
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          order.orderStatus === "Pending" ? "text-amber-600 border-amber-200 bg-amber-50/50" :
                          order.orderStatus === "Processing" ? "text-blue-600 border-blue-200 bg-blue-50/50" :
                          order.orderStatus === "Delivered" ? "text-green-600 border-green-200 bg-green-50/50" :
                          "text-red-500 border-red-200 bg-red-50/50"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardClient;