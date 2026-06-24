"use client"

const categories = [
  { id: "pizza", name: "Pizza", icon: "🍕", bgColor: "bg-orange-50 hover:bg-orange-100 border-orange-100" },
  { id: "burgers", name: "Burgers", icon: "🍔", bgColor: "bg-yellow-50 hover:bg-yellow-100 border-yellow-100" },
  { id: "cake", name: "Cake", icon: "🍰", bgColor: "bg-pink-50 hover:bg-pink-100 border-pink-100" },
  { id: "salads", name: "Salads", icon: "🥗", bgColor: "bg-green-50 hover:bg-green-100 border-green-100" },
];

export const PopularCategories = ({ onSelectCategory }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">Popular Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory?.(cat.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sm ${cat.bgColor}`}
          >
            <span className="text-4xl">{cat.icon}</span>
            <span className="font-semibold text-gray-800 text-base">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};