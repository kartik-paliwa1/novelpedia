"use client";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Highlight } from "@/interfaces/Highlights";
// export interface Highlight {
//   image: string;
//   title: string;
//   tags: string[];
//   likeRate: number;
//   chapterCount: number;
//   description: string;
// }

type Props = {
  highlights: Highlight[];
  intervalMs?: number; // default 10s
};

const tagColors = [
  { b: "#312375", f: "#7668AD" },
  { b: "#30918D", f: "#60C495" },
];

// Utility to get a random item from an array
const getRandomColor = () =>
  tagColors[Math.floor(Math.random() * tagColors.length)];

export default function HighlightCarousel({
  highlights,
  intervalMs = 10000,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const count = highlights.length;

  const snapTo = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setIndex(i);
  }, []);

  const tagColorMap = useMemo(() => {
    const map = new Map<string, { b: string; f: string }>();
    highlights.forEach((h) => {
      h.tags.forEach((t) => {
        if (!map.has(t)) {
          map.set(t, getRandomColor());
        }
      });
    });
    return map;
  }, [highlights]);

  useEffect(() => {
    if (isPaused || count <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % count;
        requestAnimationFrame(() => snapTo(next));
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs, isPaused, snapTo]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;    

    const onWheel = (e: WheelEvent) => {
      // Prevent vertical scroll, scroll horizontally instead
      if (Math.abs(e.deltaX) === 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const scrollLeft = el.scrollLeft;
      const containerCenter = scrollLeft + el.offsetWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(childCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setIndex(closestIndex);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="highlight-carousel-scroll flex overflow-x-auto snap-x snap-mandatory scroll-smooth scroll-pl-0 w-full"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {highlights.map((h, i) => (
          <article
            key={h.title + i}
            className="relative shrink-0 w-full h-[500px] snap-start"
          >
            {/* Background image using Next/Image */}
            <Image
              src={h.image}
              alt={h.title}
              fill
              className="object-cover rounded-xl"
              sizes="100vw"
              priority={i === 0}
            />
            {/* Gradient overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-xl" /> */}
            {/* Text content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end gap-3 text-white mb-6">
              {/* Tags */}
              <div className="flex items-center gap-2">
                {h.tags.map((t, tagIndex) => {
                //   const color = getRandomColor();
                  const color = tagColorMap.get(t)!;
                  return (
                    <span
                      key={`${t}-${tagIndex}`}
                      className={["text-xs px-4 py-3 rounded-[14px] backdrop-blur","font-inter font-medium text-[14px] leading-none tracking-normal align-middle"].join(" ")}
                      style={{
                        backgroundColor: color.b,
                        color: color.f,
                        borderColor: color.f,
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      {t}
                    </span>
                  );
                })}
              </div>
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-semibold">{h.title}</h2>
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-white/90">
                <span>
                  {Math.round(h.likeRate <= 1 ? h.likeRate * 100 : h.likeRate)}%
                  like
                </span>
                <span>-</span>
                <span>{h.chapterCount} chapters</span>
              </div>
              {/* Description */}
              <p className="max-w-[42%] text-sm sm:text-base text-white/80 line-clamp-2">
                {h.description}
              </p>
            </div>
          </article>
        ))}
      </div>
      {/* Dots Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-4 z-10">
        {highlights.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className="focus:outline-none"
            onClick={() => snapTo(i)}
            type="button"
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: i === index ? "#8664F4" : "#a1a1aa", // gray-400
                transition: "background 0.2s",
              }}
            />
          </button>
        ))}
      </div>
      <style jsx>{`
        /* Hide scrollbar only for HighlightCarousel */
        .highlight-carousel-scroll::-webkit-scrollbar {
          display: none;
        }
        .highlight-carousel-scroll {
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
