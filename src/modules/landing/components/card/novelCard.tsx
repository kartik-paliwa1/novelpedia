"use client";

import React from "react";
import { Eye, Star } from "lucide-react";

export type TrendType = {
  title: string;
  rating: number;
  numReviews: number;
  viewers: number;
  image: React.ReactNode;
};

export default function NovelCard({
  item,
  index,
}: {
  item: TrendType;
  index: number;
}) {
  return (
    <div className="embla__slide shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 px-2 overflow-visible">
      <div className="group relative rounded-2xl">
        <div
          className="
            relative rounded-2xl border border-[#393939] bg-[#0f1320] shadow-lg
            transform-gpu transition-transform duration-300 ease-out will-change-transform
            group-hover:-translate-y-1
            motion-reduce:transform-none
          "
        >
          {/* Poster */}
          <div className="aspect-[2/3.5] rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-slate-800" />
            {item.image}
            <div className="absolute bottom-3 left-3 w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10 border-2 border-[#22223C]">
              {index + 1}
            </div>
          </div>

          {/* Details */}
          <div className="p-2">
            <div className="flex items-center justify-between mt-1 mb-2 text-[12px]">
              <div className="flex items-center gap-0.5 text-white border-[#606060] border px-1 py-1.5 rounded-sm">
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
            <div className="font-semibold text-white line-clamp-2">
              {item.title}
            </div>
          </div>

          {/* Hover ring & shadow */}
          <div
            className="
              pointer-events-none absolute inset-0 rounded-2xl ring-0
              transition-all duration-300
              group-hover:ring-2 group-hover:ring-[#8B5CF6]/50 group-hover:shadow-2xl
            "
          />
        </div>
      </div>
    </div>
  );
}
