"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Search,
  ShoppingCart,
  Menu,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-Menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnd";
import { setIsAuthenticated, setUserInfo } from "@/store/userSlice";

interface NavbarProps {
  cartCount?: number;
}

type NavbarUserState = {
  user: {
    userInfo?: {
      role?: string;
    } | null;
  };
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <Link
      href={href}
      className="hover:text-foreground transition-colors  font-bold hover:underline"
    >
      {children}
    </Link>
  );
};



const Navbar: React.FC<NavbarProps> = ({ cartCount = 2 }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { userInfo } = useSelector((state: NavbarUserState) => state.user)
  const dispatch = useDispatch()


  const router = useRouter();

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await apiClient.post(API_ENDPOINTS.LOGOUT)
    dispatch(setIsAuthenticated(false))
    dispatch(setUserInfo(null))
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#E6F2DD] backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xl font-bold tracking-tight text-[#E15B1E]">
              🍕 QuickBite
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <NavLink href="/foods">
              Browse Food
            </NavLink>
            {
              userInfo?.role === "customer" && <>
                <NavLink href="/orders">

                  My Orders
                </NavLink>

                <NavLink href="/account">
                  Profile
                </NavLink>
              </>
            }
            {
              userInfo?.role === "admin" && <>
                <NavLink href="/admin/Dashboard">
                  Dashboard
                </NavLink>
              </>
            }

          </nav>
        </div>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="search"
              placeholder="Search food items..."
              className="w-full pl-9 pr-4 bg-gray-50/50 rounded-lg focus-visible:ring-[#E15B1E]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-[#E15B1E] transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E15B1E] text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="hidden sm:flex items-center gap-1 bg-[#E15B1E] hover:bg-[#c84e17] text-white capitalize"
                >
                  <User className="h-4 w-4 mr-1" />
                  {userInfo?.role}
                  <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 mt-2">
                {userInfo?.role === "admin" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/Dashboard")}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}

                {
                  userInfo?.role === "customer" && <>
                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/orders")}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                  </>
                }

                <hr className="my-1" />

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-[#E15B1E] hover:bg-[#c84e17]"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-75 sm:w-100">
                <div className="flex flex-col gap-6 mt-8">
                  <form
                    onSubmit={handleSearch}
                    className="relative w-full sm:hidden"
                  >
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="search"
                      placeholder="Search food items..."
                      className="w-full pl-9 pr-4 bg-gray-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  <nav className="flex flex-col gap-4 text-lg font-medium">
                    <Link
                      href="/foods"
                      className="hover:text-[#E15B1E] transition-colors"
                    >
                      Browse Food
                    </Link>
                    {
                      userInfo?.role === "customer" && <>
                        <Link
                          href="/orders"
                          className="hover:text-[#E15B1E] transition-colors"
                        >
                          Your Orders
                        </Link>

                        <Link
                          href="/account"
                          className="hover:text-[#E15B1E] transition-colors"
                        >
                          Account
                        </Link>
                      </>
                    }


                    {userInfo?.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="text-blue-600 hover:underline"
                      >
                        Admin Panel
                      </Link>
                    )}
                  </nav>

                  <hr />

                  <Button
                    onClick={handleLogout}
                    className="bg-[#E15B1E] hover:bg-[#c84e17] w-full">
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
