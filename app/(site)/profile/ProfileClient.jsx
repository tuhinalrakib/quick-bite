"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Shield, 
  ChevronLeft, 
  Save, 
  KeyRound, 
  Calendar,
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";
import { setUserInfo } from "@/store/userSlice";

const ProfileClient = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Redux user state
  const { userInfo } = useSelector((state) => state.user);

  // Tab State: 'info' or 'password'
  const [activeTab, setActiveTab] = useState("info");

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form fields once userInfo is loaded
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        phone: userInfo.phone || "",
        street: userInfo.address?.street || "",
        city: userInfo.address?.city || "",
        postalCode: userInfo.address?.postalCode || "",
      });
    }
  }, [userInfo]);

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userInfo, router]);

  if (!userInfo) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 text-center">
        <Spinner />
        <p className="mt-4 text-gray-500 font-semibold animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.put(API_ENDPOINTS.PROFILE, {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
        },
      });

      if (res.data?.success) {
        // Update local Redux state
        dispatch(setUserInfo(res.data.user));

        Swal.fire({
          title: "Profile Updated!",
          text: "Your profile information has been successfully updated.",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
      
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#E15B1E",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All password fields are required.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.put(API_ENDPOINTS.PROFILE, {
        currentPassword,
        newPassword,
      });

      if (res.data?.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });

        Swal.fire({
          title: "Password Changed!",
          text: "Your password has been successfully updated.",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        
        setActiveTab("info");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || err.message || "Failed to change password.");
      
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.message || "Current password may be incorrect.",
        icon: "error",
        confirmButtonColor: "#E15B1E",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formattedDate = userInfo.createdAt 
    ? new Date(userInfo.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  return (
    <div className="min-h-screen bg-[#F9FBFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/browse-food" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#E15B1E] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Menu
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <User className="text-[#E15B1E] h-7 w-7" />
            My Profile
          </h1>
        </div>

        {/* Profile Card Banner */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8">
          <div className="h-32 bg-gradient-to-r from-[#E6F2DD] to-[#E15B1E]/10" />
          <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-10">
            
            {/* Avatar */}
            {userInfo.image ? (
              <img 
                src={userInfo.image} 
                alt={userInfo.name} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-[#E15B1E] to-[#c84e17] text-white flex items-center justify-center text-3xl font-extrabold">
                {getInitials(userInfo.name)}
              </div>
            )}

            {/* Profile Brief Info */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {userInfo.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 text-sm text-gray-500 font-medium">
                <span>{userInfo.email}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:inline" />
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2 items-center sm:items-end">
              <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#E15B1E]/10 text-[#E15B1E] border border-[#E15B1E]/20">
                {userInfo.role || "customer"}
              </span>
              <span className="px-3.5 py-1 text-xs font-semibold capitalize rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                via {userInfo.provider || "credentials"}
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Side Tabs */}
          <div className="md:col-span-1 flex flex-row md:flex-col gap-2 bg-white p-2.5 rounded-2xl border border-gray-100 h-fit w-full">
            <button
              onClick={() => { setActiveTab("info"); setError(""); }}
              className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === "info"
                  ? "bg-[#E15B1E] text-white shadow-sm shadow-[#E15B1E]/20"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User className="h-4 w-4" />
              Edit Profile
            </button>
            {userInfo.provider === "credentials" && (
              <button
                onClick={() => { setActiveTab("password"); setError(""); }}
                className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  activeTab === "password"
                    ? "bg-[#E15B1E] text-white shadow-sm shadow-[#E15B1E]/20"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <KeyRound className="h-4 w-4" />
                Security
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="md:col-span-3 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-shake">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {activeTab === "info" ? (
              /* TAB: EDIT PROFILE */
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Personal Details</h3>
                  <p className="text-gray-400 text-sm">Update your name and primary phone number.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="tel"
                        placeholder="+8801xxxxxxxxx"
                        className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="email"
                      value={userInfo.email}
                      disabled
                      className="pl-10 rounded-xl bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-gray-400" />
                    Email address cannot be changed as it is locked to your account.
                  </p>
                </div>

                <hr className="border-gray-100 my-6" />

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Delivery Address</h3>
                  <p className="text-gray-400 text-sm">Provide your address details for smoother food deliveries.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="House 12, Road 4, Sector 7"
                        className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        City
                      </label>
                      <Input
                        type="text"
                        placeholder="Dhaka"
                        className="rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Postal Code
                      </label>
                      <Input
                        type="text"
                        placeholder="1230"
                        className="rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-[#E15B1E] hover:bg-[#c84e17] text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner className="h-4 w-4 text-white" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* TAB: SECURITY / PASSWORD UPDATE */
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Update Password</h3>
                  <p className="text-gray-400 text-sm">Ensure your account is using a strong, unique password.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-[#E15B1E] hover:bg-[#c84e17] text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner className="h-4 w-4 text-white" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileClient;
