"use client";

import React, { useState, useRef } from "react";

import { ArrowLeft, ArrowRight, Eye, Star } from "lucide-react";

type TrendType = {
  title: string;
  rating: number;
  numReviews: number;
  viewers: number;
  image: React.ReactNode; // Now ReactNode!
};

type Props = {
  carous: TrendType[];
};

export default function ThisWeek({ carous }: Props) {
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE = Math.min(5, carous.length); // Show 5 at a time

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  //   const nextSlide = () => setStartIndex((old) => (old + 1) % carous.length);
  //   const prevSlide = () => setStartIndex((old) => (old - 1 + carous.length) % carous.length);

  const nextSlide = () => {
    if (!scrollerRef.current) return;

    const scroller = scrollerRef.current;
    const itemWidth = scroller.firstElementChild?.clientWidth ?? 0;

    scroller.scrollBy({ left: itemWidth, behavior: "smooth" });

    setStartIndex((old) => (old + 1) % carous.length);
  };

  const prevSlide = () => {
    if (!scrollerRef.current) return;

    const scroller = scrollerRef.current;
    const itemWidth = scroller.firstElementChild?.clientWidth ?? 0;

    scroller.scrollBy({ left: -itemWidth, behavior: "smooth" });

    setStartIndex((old) => (old - 1 + carous.length) % carous.length);
  };

  const visibleCarous = Array.from(
    { length: VISIBLE },
    (_, i) => carous[(startIndex + i) % carous.length]
  );

  return (
    <div className="w-full bg-[#141a29] py-8">
      {/* // <div className="w-full bg-[#f15500] py-8"> */}
      {/* <div className="bg-[#d7a488] relative flex items-center mx-auto"> */}
      <div className="relative flex items-center mx-auto">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="relative z-10 -left-15 top-1/2 -translate-y-1/2 bg-[#8B5CF6] hover:bg-[#A78BFA] p-3 rounded-full shadow text-white"
        >
          {/* <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
          <ArrowLeft />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-25 w-full items-center justify-center overflow-hidden"
        >
          {visibleCarous.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl shadow-lg relative w-[190px] min-w-[190px] flex-shrink-0 transition-transform duration-500"
            >
              {/* Poster */}
              {/* <div className="relative h-[270px] w-full flex items-center justify-center"> */}
              <div className="aspect-[2/3.5] bg-slate-800 rounded-lg overflow-hidden relative border-[#393939] border-[1px]">
                {item.image}
                <div className="absolute bottom-3 left-3 w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10 border-2 border-[#22223C]">
                  {((startIndex + idx) % carous.length) + 1}
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
                    <span className="ml-1 text-gray-400">
                      ({item.numReviews})
                    </span>
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
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="relative z-10 -right-15 top-1/2 -translate-y-1/2 bg-[#8B5CF6] hover:bg-[#A78BFA] p-3 rounded-full shadow text-white"
        >
          {/* <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
