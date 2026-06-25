"use client"
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Search, Utensils, Upload, X, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";
import Swal from "sweetalert2";

const FoodClientPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // মেইন ফর্ম স্টেটসমূহ
    const [newFood, setNewFood] = useState({ name: "", category: "pizza", price: "", description: "", isAvailable: true });
    const [image, setImage] = useState(null); // ব্যাকএন্ডে পাঠানোর জন্য র ফাইল স্টেট
    const [preview, setPreview] = useState(""); // UI-তে দেখানোর জন্য লোকাল URL স্টেট
    const [editingFood, setEditingFood] = useState(null);

    // API থেকে খাবার নিয়ে আসার জন্য useEffect
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await apiClient.get(`${API_ENDPOINTS.FOOD_ITEM}`);
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

    // Image Input handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setImage(file);
    };


    const handleRemoveImage = () => {
        setImage(null);
        setPreview("");
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFood(null);
        setNewFood({ name: "", category: "pizza", price: "", description: "", isAvailable: true });
        setImage(null);
        setPreview("");
    };

    const handleEditClick = (food) => {
        setEditingFood(food);
        setNewFood({
            name: food.name,
            category: food.category,
            price: food.price.toString(),
            description: food.description || "",
            isAvailable: food.isAvailable !== undefined ? food.isAvailable : true
        });
        setPreview(food.image || "");
        setImage(null);
        setIsModalOpen(true);
    };

    // Handle Delete 
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#E15B1E",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await apiClient.delete(`${API_ENDPOINTS.FOOD_ITEM}/${id}`);
                    if (res.data?.success) {
                        setFoods(foods.filter((food) => (food._id || food.id) !== id));
                        Swal.fire({
                            title: "Deleted!",
                            text: "Food item has been deleted.",
                            icon: "success",
                            confirmButtonColor: "#E15B1E"
                        });
                    }
                } catch (err) {
                    const msg = err?.response?.data?.message || "Failed to delete food item."
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: msg,
                        confirmButtonColor: "#E15B1E"
                    });
                }
            }
        });
    };

    // Add/Edit food handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingFood && !image) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please upload a food image.",
            });
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", newFood.name);
            formData.append("category", newFood.category);
            formData.append("price", newFood.price);
            formData.append("description", newFood.description);
            if (image) {
                formData.append("image", image);
            }
            if (editingFood) {
                formData.append("isAvailable", newFood.isAvailable);
            }

            if (editingFood) {
                const res = await apiClient.put(
                    `${API_ENDPOINTS.FOOD_ITEM}/${editingFood._id || editingFood.id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );

                if (res.data?.success) {
                    const updatedFood = res.data.data;
                    setFoods(foods.map((food) => (food._id || food.id) === (editingFood._id || editingFood.id) ? updatedFood : food));
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Item Updated!",
                        text: "Food item updated successfully!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    closeModal();
                }
            } else {
                const res = await apiClient.post(
                    `${API_ENDPOINTS.FOOD_ITEM}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );

                if (res.data?.success) {
                    const createdFood = res.data.data;
                    setFoods([createdFood, ...foods]);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Item Added!",
                        text: "Food item added successfully!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    closeModal();
                }
            }
        } catch (err) {
            console.error("Error saving food:", err);
            const msg = err?.response?.data?.message || "Failed to save food item."
            Swal.fire({ icon: "error", title: "Oops!", text: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const filteredFoods = foods.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* হেডার সেকশন */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Food Items</h1>
                    <p className="text-sm text-gray-500">Add, edit or remove dishes from your restaurant menu.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-[#E15B1E] hover:bg-[#c84e17]">
                    <Plus className="mr-2 h-4 w-4" /> Add New Food
                </Button>
            </div>

            {/* সার্চ ফিল্টার */}
            <div className="flex items-center max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search food by name..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* ফুড আইটেম টেবিল */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-500 tracking-wider">
                            <th className="p-4">Item Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-[#E15B1E]" />
                                        <span>Loading food items...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredFoods.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No food items found.
                                </td>
                            </tr>
                        ) : (
                            filteredFoods.map((food) => (
                                <tr key={food._id || food.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        {food.image || food.preview ? (
                                            <img src={food.image || food.preview} alt={food.name} className="h-9 w-9 object-cover rounded-lg border" />
                                        ) : (
                                            <div className="p-2 bg-orange-50 text-[#E15B1E] rounded-lg">
                                                <Utensils className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-gray-950">{food.name}</div>
                                            {food.description && <div className="text-xs text-gray-400 line-clamp-1 max-w-[250px]">{food.description}</div>}
                                        </div>
                                    </td>
                                    <td className="p-4 capitalize">{food.category}</td>
                                    <td className="p-4">${Number(food.price).toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${food.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}>
                                            {food.isAvailable ? "Available" : "Out of Stock"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(food)} className="text-gray-500 hover:text-gray-700">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(food._id || food.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* কাস্টম অ্যাড/এডিট ফুড মোডাল (পপআপ ফর্ম) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-900">
                            {editingFood ? "Edit Food Item" : "Add Food to Menu"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* ইমেজ আপলোড সেকশন */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 block mb-1">Food Image</label>
                                {preview ? (
                                    <div className="relative h-32 w-full border rounded-xl overflow-hidden bg-gray-50">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                                            disabled={submitting}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-32 w-full border border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                                            <Upload className="h-8 w-8 mb-2 stroke-1" />
                                            <p className="text-xs font-medium">Click to upload food image</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            disabled={submitting}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* ফুড নেম */}
                            <div>
                                <label className="text-xs font-medium text-gray-500">Food Name</label>
                                <Input required value={newFood.name} onChange={(e) => setNewFood({ ...newFood, name: e.target.value })} placeholder="e.g., BBQ Chicken Pizza" disabled={submitting} />
                            </div>

                            {/* ক্যাটাগরি এবং প্রাইস */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Category</label>
                                    <select className="w-full h-9 rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E15B1E] bg-white" value={newFood.category} onChange={(e) => setNewFood({ ...newFood, category: e.target.value })} disabled={submitting}>
                                        <option value="pizza">Pizza</option>
                                        <option value="burgers">Burgers</option>
                                        <option value="cake">Cake</option>
                                        <option value="salads">Salads</option>
                                        <option value="sandwich">Sandwich</option>
                                        <option value="beverages">Beverages</option>
                                        <option value="trending">Trending</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Price ($)</label>
                                    <Input required type="number" step="0.01" value={newFood.price} onChange={(e) => setNewFood({ ...newFood, price: e.target.value })} placeholder="12.99" disabled={submitting} />
                                </div>
                            </div>

                            {/* নতুন যুক্ত করা ডেসক্রিপশন ফিল্ড */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 block mb-1">Description</label>
                                <textarea
                                    value={newFood.description}
                                    onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                                    placeholder="Write a brief description about the food..."
                                    rows={3}
                                    className="w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E15B1E] resize-none"
                                    disabled={submitting}
                                    required
                                />
                            </div>

                            {/* Availability checkbox - only visible in Edit mode */}
                            {editingFood && (
                                <div className="flex items-center gap-2 py-2">
                                    <input
                                        type="checkbox"
                                        id="isAvailable"
                                        checked={newFood.isAvailable}
                                        onChange={(e) => setNewFood({ ...newFood, isAvailable: e.target.checked })}
                                        disabled={submitting}
                                        className="h-4 w-4 text-[#E15B1E] focus:ring-[#E15B1E] border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Available / In Stock
                                    </label>
                                </div>
                            )}

                            {/* অ্যাকশন বাটন */}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={closeModal} disabled={submitting}>Cancel</Button>
                                <Button type="submit" className="bg-[#E15B1E] hover:bg-[#c84e17]" disabled={submitting}>
                                    {submitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        "Save Item"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodClientPage;
