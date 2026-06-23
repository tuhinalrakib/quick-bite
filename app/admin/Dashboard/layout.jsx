"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Users,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "@/components/ui/Button";

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/Dashboard",
    },
    {
      icon: Utensils,
      label: "Manage Food",
      path: "/admin/Dashboard/food",
    },
    {
      icon: ShoppingBag,
      label: "Orders",
      path: "/admin/Dashboard/order",
    },
    {
      icon: Users,
      label: "Customers",
      path: "/admin/Dashboard/customers",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/60">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-white px-4 py-6">
        <div className="flex items-center gap-2 border-b px-2 pb-6">
          <span className="text-xl font-bold text-[#E15B1E]">
            🍕 QuickBite
          </span>

          <span className="flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-xs font-semibold text-[#E15B1E]">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </span>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#E15B1E]/10 text-[#E15B1E]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => router.push("/")}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Exit Panel
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-8">
          <h1 className="text-lg font-semibold capitalize text-gray-800">
            {pathname.split("/").pop()} Panel
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Welcome, Super Admin
            </span>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E15B1E] font-bold text-white">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;