"use client"

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { FoodCard } from "./FoodCard";
import { HeroSlider } from "./HeroSlider";
import { PopularCategories } from "./PopularCategories";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { addToCart } from "@/store/cartSlice";

const HomePage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await apiClient.get(API_ENDPOINTS.FOOD_ITEM);
                if (res.data && res.data.foods) {
                    setFoods(res.data.foods);
                }
            } catch (err) {
                console.error("Error fetching foods:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

    const handleAddToCart = (food) => {
        if (!userInfo) {
            Swal.fire({
                title: "Login Required",
                text: "Please login as a customer to add items to your cart.",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#E15B1E",
                cancelButtonColor: "#d33",
                confirmButtonText: "Go to Login",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/login");
                }
            });
            return;
        }

        dispatch(addToCart(food));

        Swal.fire({
            title: "Added to Cart!",
            text: `${food.name} has been added to your cart.`,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
        });
    };

    return (
        <div className="mx-5 space-y-8">
            <HeroSlider />
            <PopularCategories
                onSelectCategory={(cat) => console.log("Selected:", cat)}
            />
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Featured Food Items</h2>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#E15B1E]" />
                        <span className="ml-2 text-gray-500 font-medium">Loading yummy foods...</span>
                    </div>
                ) : foods.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No featured food items available right now.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {foods.slice(0, 3).map((food) => (
                            <FoodCard 
                                key={food._id || food.id} 
                                food={food} 
                                onAddToCart={handleAddToCart} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;