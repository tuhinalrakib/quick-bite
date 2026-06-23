"use client"
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import Link from 'next/link';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/apiEnd';
import Swal from 'sweetalert2';

const RegisterClient = () => {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";

        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // regsiter with backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // এখানে আপনার ব্যাকএন্ডের API কল হ্যান্ডেল হবে
            console.log("Registering with:", formData);
            const res = await axios.post(API_ENDPOINTS.SIGN_UP, formData)

            if (res.data) {
                Swal.fire({
                    icon: "success",
                    title: "Registration successful!",
                    text: "Welcome to our shop. Please login now.",
                    timer: 2000,
                    showConfirmButton: false
                });
                router.push("/login");
            }

            // সফলভাবে রেজিস্ট্রেশন হলে লগইন পেজে রিডাইরেক্ট
        } catch (error) {
            setErrors({ server: error.message || "Registration failed. Try again." });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-amber-100 p-8 shadow-md backdrop-blur-lg">
                <div className="text-center">
                    <span className="text-3xl font-bold tracking-tight text-[#E15B1E]">🍕 QuickBite</span>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Create an Account</h2>
                    <p className="mt-1 text-sm text-gray-600">Join us to order your favorite foods</p>
                </div>

                {errors.server && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{errors.server}</div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className="pl-10"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-xs text-destructive text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-destructive text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                name="phone"
                                type="text"
                                placeholder="+880 1234..."
                                className="pl-10"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs text-destructive text-red-600">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-destructive text-red-600">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-xs text-destructive text-red-600">{errors.confirmPassword}</p>}
                    </div>

                    <Button type="submit" className="w-full h-10 bg-[#E15B1E] hover:bg-[#c84e17] mt-2" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </Button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-[#E15B1E] hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterClient;