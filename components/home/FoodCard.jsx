"use client"
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSelector } from "react-redux";

export const FoodCard = ({ food, onAddToCart }) => {
  const { name, description, price, image, rating, restaurantName } = food;
  const { userInfo } = useSelector((state) => state.user);
  const isAdmin = userInfo?.role === "admin";

  return (
    <div className="flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Food Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Food Details */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">{description}</p>
        
        {/* Rating and Restaurant Info */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md font-medium">
            🏪 {restaurantName || "Restaurant Origin"}
          </span>
          <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-md">
            <Star className="h-3.5 w-3.5 fill-current" /> {rating?.toFixed(1) || "4.0"}
          </span>
        </div>

        <hr className="my-2 border-gray-100" />

        {/* Price and Add to Cart Action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-extrabold text-gray-900">${price?.toFixed(2)}</span>
          {!isAdmin ? (
            <Button
              onClick={() => onAddToCart?.(food)}
              className="bg-[#E15B1E] hover:bg-[#c84e17] text-white rounded-xl text-xs h-9 px-3 font-semibold flex items-center gap-1.5"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </Button>
          ) : (
            <span className="text-[11px] text-gray-400 font-semibold italic border border-gray-100 rounded-lg px-2.5 py-1.5 bg-gray-50/80">
              Admin Mode (No Cart)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};