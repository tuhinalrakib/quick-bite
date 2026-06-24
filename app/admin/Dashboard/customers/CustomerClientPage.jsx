"use client"
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search, Trash2, ShieldAlert, ShieldCheck, Loader2, UserMinus, UserCheck, Phone, Mail } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";

const CustomerClientPage = () => {
    const { userInfo } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiClient.get(`${API_ENDPOINTS.USERS}`);
                if (res.data && res.data.users) {
                    setUsers(res.data.users);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Change user role
    const handleRoleChange = async (userId, currentRole) => {
        const targetRole = currentRole === "admin" ? "customer" : "admin";
        
        // Confirm demotion if the user is currently an admin
        if (currentRole === "admin") {
            if (!confirm("Are you sure you want to demote this Admin to a Customer?")) {
                return;
            }
        } else {
            if (!confirm("Are you sure you want to promote this Customer to an Admin?")) {
                return;
            }
        }

        setActionLoadingId(userId);
        try {
            const res = await apiClient.patch(`${API_ENDPOINTS.USERS}/${userId}/role`, {
                role: targetRole
            });

            if (res.data?.success) {
                setUsers(prevUsers => prevUsers.map(user => 
                    (user._id || user.id) === userId ? { ...user, role: targetRole } : user
                ));
                alert(`User role updated to ${targetRole} successfully!`);
            }
        } catch (err) {
            console.error("Error updating role:", err);
            alert(err?.response?.data?.message || "Failed to update user role.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone!")) {
            return;
        }

        setActionLoadingId(userId);
        try {
            const res = await apiClient.delete(`${API_ENDPOINTS.USERS}/${userId}`);
            if (res.data?.success) {
                setUsers(prevUsers => prevUsers.filter(user => (user._id || user.id) !== userId));
                alert("User deleted successfully!");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert(err?.response?.data?.message || "Failed to delete user.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter users list based on search term
    const filteredUsers = users.filter((user) => {
        const name = user.name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();
        return name.includes(term) || email.includes(term);
    });

    // Check if the user is the currently logged in admin
    const isCurrentUser = (userId) => {
        if (!userInfo) return false;
        const loggedInId = userInfo._id || userInfo.id;
        return userId === loggedInId;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="border-b pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Customers & Admins</h1>
                <p className="text-sm text-gray-500">View user details, update system roles, and manage account access.</p>
            </div>

            {/* Filters Section */}
            <div className="flex items-center max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name or email..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-500 tracking-wider">
                            <th className="p-4">User</th>
                            <th className="p-4">Contact Info</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-[#E15B1E]" />
                                        <span>Loading system users...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => {
                                const userId = user._id || user.id;
                                const isSelf = isCurrentUser(userId);

                                return (
                                    <tr key={userId} className="hover:bg-gray-50/50 transition-colors">
                                        {/* User Identity Column */}
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-orange-50 text-[#E15B1E] flex items-center justify-center font-bold border border-orange-100 uppercase">
                                                {user.name ? user.name.substring(0, 2) : "US"}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-950 flex items-center gap-2">
                                                    {user.name}
                                                    {isSelf && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</div>
                                            </div>
                                        </td>

                                        {/* Contact Column */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="flex items-center gap-1.5 text-gray-700">
                                                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                    <span>{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Role Badge Column */}
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                user.role === "admin" 
                                                    ? "bg-red-50 text-red-700 border border-red-100" 
                                                    : "bg-green-50 text-green-700 border border-green-100"
                                            }`}>
                                                {user.role === "admin" ? (
                                                    <ShieldCheck className="h-3.5 w-3.5 stroke-[2]" />
                                                ) : (
                                                    <UserCheck className="h-3.5 w-3.5 stroke-[2]" />
                                                )}
                                                <span className="capitalize">{user.role}</span>
                                            </span>
                                        </td>

                                        {/* Action Buttons Column */}
                                        <td className="p-4 text-right space-x-2">
                                            {/* Role Toggle Button */}
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleRoleChange(userId, user.role)}
                                                disabled={isSelf || actionLoadingId !== null}
                                                className={`text-xs ${
                                                    user.role === "admin" 
                                                        ? "hover:bg-amber-50 hover:text-amber-700 border-amber-200" 
                                                        : "hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                                }`}
                                            >
                                                {actionLoadingId === userId ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : user.role === "admin" ? (
                                                    <span className="flex items-center gap-1">
                                                        <UserMinus className="h-3.5 w-3.5" /> Make Customer
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <ShieldAlert className="h-3.5 w-3.5" /> Make Admin
                                                    </span>
                                                )}
                                            </Button>

                                            {/* Delete Button */}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDeleteUser(userId)}
                                                disabled={isSelf || actionLoadingId !== null}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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

export default CustomerClientPage;
