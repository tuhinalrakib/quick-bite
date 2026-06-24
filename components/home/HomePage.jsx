"use client"

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { FoodCard } from "./FoodCard";
import { HeroSlider } from "./HeroSlider";
import { PopularCategories } from "./PopularCategories";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";

const HomePage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <FoodCard key={food._id || food.id} food={food} onAddToCart={(f) => console.log("Added to cart:", f)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;