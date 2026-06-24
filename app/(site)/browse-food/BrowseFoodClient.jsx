"use client"
import React, { useState, useEffect } from "react";
import { Search, Loader2, UtensilsCrossed } from "lucide-react";
import { FoodCard } from "../../../components/home/FoodCard";
import { Input } from "../../../components/ui/Input";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";

const BrowseFoodClient = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Fetch foods from backend
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

    // Filter categories list
    const categories = [
        { id: "all", label: "All Items" },
        { id: "pizza", label: "Pizza" },
        { id: "burgers", label: "Burgers" },
        { id: "cake", label: "Cake" },
        { id: "salads", label: "Salads" },
        { id: "beverages", label: "Beverages" },
        { id: "trending", label: "Trending" }
    ];

    // Filter foods based on selected category and search term
    const filteredFoods = foods.filter((food) => {
        const matchesCategory = selectedCategory === "all" || food.category?.toLowerCase() === selectedCategory;
        const matchesSearch = food.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            food.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-[80vh]">
            {/* Header section */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Explore Our Delicious Menu
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                    Find and order your favorite dishes made with fresh ingredients, prepared with love.
                </p>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b pb-6">
                {/* Search Box */}
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                    <Input
                        placeholder="Search food by name or description..."
                        className="pl-10 h-10 shadow-sm border-gray-200 focus-visible:ring-[#E15B1E]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Categories Scrollable container */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                                selectedCategory === cat.id
                                    ? "bg-[#E15B1E] text-white border-[#E15B1E] shadow-sm shadow-orange-500/20"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Food Grid section */}
            <div>
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-[#E15B1E]" />
                        <span className="text-gray-500 font-medium text-sm">Preparing menu...</span>
                    </div>
                ) : filteredFoods.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-20 text-center space-y-3">
                        <div className="p-4 bg-orange-50 text-[#E15B1E] rounded-full">
                            <UtensilsCrossed className="h-8 w-8 stroke-1.5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No Food Items Found</h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                            We couldn't find any dishes matching your current filters. Try searching for something else!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredFoods.map((food) => (
                            <FoodCard 
                                key={food._id || food.id} 
                                food={food} 
                                onAddToCart={(f) => console.log("Added to cart:", f)} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseFoodClient;
