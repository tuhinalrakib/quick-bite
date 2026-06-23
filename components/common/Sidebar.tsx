import React from "react";
import { 
  Leaf, 
  Pizza, 
  UtensilsCrossed, 
  CakeSlice, 
  Coffee, 
  Flame,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  color?: string;
}

const SidebarItem = ({ icon: Icon, label, isActive, color }: SidebarItemProps) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:rounded-xl",
            isActive 
              ? "bg-[#E15B1E]/10 text-[#E15B1E] shadow-sm shadow-[#E15B1E]/20" 
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          )}
        >
          <Icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", color)} />
          {isActive && (
            <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#E15B1E]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const Sidebar = () => {
  const menuItems = [
    { icon: LayoutGrid, label: "All Categories", isActive: false },
    { icon: Flame, label: "Trending", isActive: false },
    { icon: Leaf, label: "Healthy Food", isActive: true, color: "text-green-500" },
    { icon: Pizza, label: "Pizza & Pasta", isActive: false },
    { icon: UtensilsCrossed, label: "Main Course", isActive: false },
    { icon: CakeSlice, label: "Desserts", isActive: false },
    { icon: Coffee, label: "Beverages", isActive: false },
  ];

  return (
    <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-64px)] w-10 flex-col items-center bg-white py-6">
      <div className="flex flex-col gap-6">
        {menuItems.map((item, index) => (
          <SidebarItem 
            key={index} 
            icon={item.icon} 
            label={item.label} 
            isActive={item.isActive}
            color={item.color}
          />
        ))}
      </div>

      {/* নিচের দিকে কোনো অপশন রাখতে চাইলে (যেমন Help বা Settings) */}
      {/* <div className="mt-auto pb-4">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          ?
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;