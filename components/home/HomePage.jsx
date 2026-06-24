"use client"

import { FoodCard } from "./FoodCard";
import { HeroSlider } from "./HeroSlider";
import { PopularCategories } from "./PopularCategories";

// ডামি খাবারের ডেটা (যা পরে ব্যাকএন্ড API থেকে আসবে)
const dummyFoods = [
    { id: 1, name: "Classic Pepperoni Pizza", description: "Delicious pizza classic pepperoni pizza reptasant with cheese, etc.", price: 14.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500", rating: 4.0, restaurantName: "Restaurant Origin" },
    { id: 2, name: "Gourmet Burger", description: "Brief fest present with grestly chocolate, burger snk gormety and chelden.", price: 14.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500", rating: 4.0, restaurantName: "Restaurant Origin" },
    { id: 3, name: "Decadent Cake", description: "Decadent cake while invanar chececakes and decadent m chocolate.", price: 14.99, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500", rating: 4.0, restaurantName: "Restaurant Origin" },
];

const HomePage = () => {
    return (
        <div className="mx-5">
            <HeroSlider />
            <PopularCategories
                onSelectCategory={(cat) => console.log("Selected:", cat)}
            />
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Featured Food Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {dummyFoods.map((food) => (
                        <FoodCard key={food.id} food={food} onAddToCart={(f) => console.log("Added to cart:", f)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;