
"use client"
import React, { useEffect, useState } from "react";
import { ShoppingBag, Users, DollarSign, Utensils } from "lucide-react";
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

      {/* রিসেন্ট অ্যাক্টিভিটি বক্স */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Orders Activity</h3>
        <p className="text-sm text-gray-500">এখানে দ্রুত পেমেন্ট স্ট্যাটাস এবং নতুন অর্ডার ট্র্যাকিং গ্রাফ যুক্ত করা যাবে।</p>
      </div>
    </div>
  );
};

export default DashboardClient;