"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";

import NovelCard, { TrendType } from "@/modules/landing/components/card/novelCard";

type Props = {
  carous: TrendType[];
};

export default function Latest({ carous }: Props) {
  const options: EmblaOptionsType = {
    align: "center",
    loop: true,
    containScroll: "trimSnaps",
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
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
        <div
          ref={emblaRef}
          className="
            embla__viewport overflow-hidden mx-4 pt-2 sm:mx-8 md:mx-16
            touch-pan-y
          "
        >
          {/* Embla Container */}
          <div className="embla__container flex -mx-2">
            {carous.map((item, idx) => (
              <NovelCard key={idx} item={item} index={idx} />
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
