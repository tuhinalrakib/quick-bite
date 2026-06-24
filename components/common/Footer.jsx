"use client";

import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Heart,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t mt-10 bg-gray-50/50 text-gray-600">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#E15B1E]">
                🍕 QuickBite
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500">
              Craving something delicious? We deliver fresh, hot, and hygienic
              food straight from restaurant kitchens to your doorstep in minutes.
            </p>

            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="rounded-full border bg-white p-2 text-gray-400 transition-all hover:border-[#E15B1E] hover:text-[#E15B1E]"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>

              <a
                href="#"
                className="rounded-full border bg-white p-2 text-gray-400 transition-all hover:border-[#E15B1E] hover:text-[#E15B1E]"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

              <a
                href="#"
                className="rounded-full border bg-white p-2 text-gray-400 transition-all hover:border-[#E15B1E] hover:text-[#E15B1E]"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/foods"
                  className="group flex items-center gap-1 transition-colors hover:text-[#E15B1E]"
                >
                  Browse Menu
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>

              <li>
                <Link
                  href="/orders"
                  className="transition-colors hover:text-[#E15B1E]"
                >
                  Track Orders
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#E15B1E]"
                >
                  About Us
                </Link>
              </li>

              {/* <li>
                <Link
                  href="/admin/dashboard"
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  Admin Panel
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E15B1E]" />
                <span>
                  123 Foodie Street, Sector 10,
                  <br />
                  Dhaka, Bangladesh
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#E15B1E]" />
                <span>+880 1234-567890</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#E15B1E]" />
                <span>support@quickbite.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Newsletter
            </h3>

            <p className="text-sm text-gray-500">
              Subscribe to get the latest updates, discount coupons, and special
              offers.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-2"
            >
              <Input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white focus-visible:ring-[#E15B1E]"
                required
              />

              <Button
                type="submit"
                className="w-full bg-[#E15B1E] text-white hover:bg-[#c84e17]"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t bg-white py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-xs text-gray-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {currentYear} QuickBite. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made with
            <Heart className="h-3 w-3 fill-[#E15B1E] text-[#E15B1E]" />
            for a great dining experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;