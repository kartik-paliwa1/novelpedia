"use client";

import React, { useCallback } from "react";
// Import Embla Carousel React hook and typings
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";

import { ArrowLeft, ArrowRight, Eye, Star } from "lucide-react";

type TrendType = {
  title: string;
  rating: number;
  numReviews: number;
  viewers: number;
  image: React.ReactNode;
};

type Props = {
  carous: TrendType[];
};

export default function Latest({ carous }: Props) {
  // Set Embla options for a centered, looping carousel
  const options: EmblaOptionsType = {
    align: "center", // The key to centering the items
    loop: true,
    containScroll: "trimSnaps",
  };

  // Initialize Embla carousel with options
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // Scroll previous button handler
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  // Scroll next button handler
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="w-full bg-[#141a29] py-8">
      <div className="relative flex items-center justify-center mx-auto">
        {/* Left Arrow */}
        <button
          onClick={scrollPrev}
          className="absolute z-10 top-1/2 -translate-y-1/2 -left-2 bg-[#8B5CF6] hover:bg-[#A78BFA] p-3 rounded-full shadow text-white"
          aria-label="Scroll previous"
        >
          <ArrowLeft />
        </button>

        {/* Embla Viewport */}
        <div className="overflow-hidden mx-16" ref={emblaRef}>
          {/* Embla Container with gap */}
          <div className="flex gap-15 px-15">
          {/* <div className="flex gap-25"> */}
            {carous.map((item, idx) => (
              <div
                key={idx}
                // Responsive item widths based on breakpoints
                className="relative rounded-2xl shadow-lg basis-1/4 md:basis-1/5 lg:basis-1/6 flex-shrink-0"
              >
                {/* Poster */}
                <div className="aspect-[2/3.5] bg-slate-800 rounded-lg overflow-hidden relative border-[#393939] border-[1px]">
                  {item.image}
                  <div className="absolute bottom-3 left-3 w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10 border-2 border-[#22223C]">
                    {idx + 1}
                  </div>
                </div>
                {/* Details */}
                <div className="p-0.5">
                  <div className="flex items-center justify-between mt-1 mb-2 text-[12px]">
                    <div className="flex items-center gap-0.5 text-white border-[#606060] border-[1px] px-1 py-1.5 rounded-sm">
                      <div className="flex flex-row gap-1 items-center justify-center">
                        <Star fill="#f5c846" strokeWidth={0} size={18} />
                        {item.rating.toFixed(1)}
                      </div>
                      <span className="ml-1 text-gray-400">({item.numReviews})</span>
                    </div>
                    <div className="flex items-center text-gray-400 gap-2">
                      <Eye />
                      {item.viewers}
                    </div>
                  </div>
                  <div className="font-semibold text-white line-clamp-2">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollNext}
          className="absolute z-10 top-1/2 -translate-y-1/2 -right-2 bg-[#8B5CF6] hover:bg-[#A78BFA] p-3 rounded-full shadow text-white"
          aria-label="Scroll next"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
