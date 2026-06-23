"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../constants/apiEnd";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated, setUserInfo } from "@/store/userSlice";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const LoginClient = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {userInfo} = useSelector((state)=>state.user)

    const router = useRouter();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(()=>{
        if(userInfo){
            router.replace("/")
        }
    },[])

    const onSubmit = async (data) => {
        setServerError("");
        setIsLoading(true);

        try {
            const res = await axios.post(
                API_ENDPOINTS.SIGN_IN,
                data,
                {
                    withCredentials: true,
                }
            );

            if (res?.data) {
                dispatch(setIsAuthenticated(true));
                dispatch(setUserInfo(res?.data?.user));

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Welcome back!",
                    text: "Login successful",
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset()
                router.push("/");
            }
        } catch (error) {
            let msg = "Something went wrong. Please try again.";
            const errorMsg = error?.response?.data?.message;
            // console.log(errorMsg)
            
            // if (errorMsg) {
            //     const errorMap = {
            //         "Email and password not found": "Email and password required",
            //         "User not found": "No account found with this email!",
            //         "Account deactivated": "User did not active",
            //         "Password mismatch": "Invalid credentials",
            //     };
            //     msg = errorMap[errorMsg] || msg;
            //     console.log(errorMap[errorMsg])
            // }
            msg = errorMsg || msg
            Swal.fire({ icon: "error", title: "Oops!", text: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);

        try {
            // Google Login Logic
        } catch (error) {
            setServerError(
                error?.message || "Google sign-in failed."
            );

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl p-8 shadow-md backdrop-blur-lg bg-amber-100">
                <div className="text-center">
                    <span className="text-3xl font-bold tracking-tight text-[#E15B1E]">
                        🍕 QuickBite
                    </span>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                        Welcome Back!
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Please sign in to your account
                    </p>
                </div>

                {serverError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {serverError}
                    </div>
                )}

                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>

                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                            </div>

                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
                                    })}
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-10 bg-[#E15B1E] hover:bg-[#c84e17]"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}

                        {!isLoading && (
                            <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                    </Button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-[#E15B1E] hover:underline"
                        >
                            Sign up here
                        </Link>
                    </p>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>

                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-amber-100 px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 border-gray-300"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    Google Sign In
                </Button>
            </div>
        </div>
    );
};

export default LoginClient;