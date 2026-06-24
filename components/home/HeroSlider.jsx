"use client"
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const slides = [
  {
    id: 1,
    title: "Craving something delicious? Order now!",
    subtitle: "Healthy & Fresh food delivered to your door step.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop", // Pizza background
    buttonText: "View Full Menu",
  },
  {
    id: 2,
    title: "Juicy Burgers & Crispy Fries!",
    subtitle: "Get 20% off on your first order.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop", // Burger background
    buttonText: "Grab Deal",
  }
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // প্রতি ৫ সেকেন্ড পর পর স্লাইড চেঞ্জ হবে
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-87.5 md:h-100 rounded-3xl overflow-hidden shadow-lg group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent z-20" />
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-30 max-w-xl text-white space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {slide.title}
            </h1>
            <p className="text-sm md:text-base text-gray-200">{slide.subtitle}</p>
            <Button className="w-fit bg-[#E15B1E] hover:bg-[#c84e17] text-white font-medium px-6 py-2 rounded-xl">
              {slide.buttonText}
            </Button>
          </div>
        </div>
      ))}

      {/* Slider Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              index === current ? "bg-[#E15B1E] w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};