"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Highlight } from "@/interfaces/Highlights";
import { ensureArray } from "@/utils/safe-array";

// Static color palette
const tagColors = [
  { b: "#312375", f: "#7668AD" },
  { b: "#30918D", f: "#60C495" },
  // add more if you like
];

// Deterministic hashing of a string to pick a color index
function hashString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0; // to 32-bit int
  }
  return Math.abs(hash);
}

// Pick color deterministically for a tag
function getColorForTag(tag: string) {
  const index = hashString(tag) % tagColors.length;
  return tagColors[index];
}

type Props = {
  highlights: Highlight[];
  intervalMs?: number; // default 10s
};

export default function HighlightCarousel({
  highlights,
  intervalMs = 10000,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const safeHighlights = ensureArray<Highlight>(highlights);
  const count = safeHighlights.length;

  // const snapTo = useCallback((i: number) => {
  //   const el = scrollerRef.current;
  //   if (!el) return;
  //   const child = el.children[i] as HTMLElement | undefined;
  //   if (!child) return;
  //   child.scrollIntoView({
  //     behavior: "smooth",
  //     inline: "center",
  //     block: "nearest",
  //   });
  //   setIndex(i);
  // }, []);

  const snapTo = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;

    // Calculate the horizontal scroll position so it aligns center-ish
    const scrollLeft =
      child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;

    el.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });

    setIndex(i);
  }, []);
  // autoplay
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

  // Horizontal scroll with wheel
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) === 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Update index on scroll snap
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
    return () => el.removeEventListener("scroll", onScroll);
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
        className="highlight-carousel-scroll flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {safeHighlights.map((h, i) => (
          <article
            key={h.title + i}
            className="relative shrink-0 w-full aspect-[16/10] snap-start"
          >
            {/* Background image */}
            <Image
              src={h.image}
              alt={h.title}
              fill
              className="object-cover rounded-xl"
              sizes="100vw"
              priority={i === 0}
            />

            {/* Content */}
            <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-end gap-2 sm:gap-3 text-white mb-6">
              {/* Tags */}
              <div className="flex items-center gap-2">
                {ensureArray<string>(h.tags).map((t, tagIndex) => {
                  const color = getColorForTag(t);
                  return (
                    <span
                      key={`${t}-${tagIndex}`}
                      className="text-xs px-4 py-3 rounded-[14px] backdrop-blur font-inter font-medium text-[14px] leading-none tracking-normal align-middle"
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
                <span className="flex items-center gap-1 font-semibold text-[17.5px]">
                  <Image
                    src="/uiElements/like.svg"
                    alt="Like icon"
                    width={16}
                    height={16}
                    className="inline-block mr-1"
                    />
                  {Math.round(h.likeRate <= 1 ? h.likeRate * 100 : h.likeRate)}%
                </span>

                <span className="flex items-center gap-1 text-[17px]">
                  <div className="flex flex-row items-center justify-center">
                    <Image
                        src="/tabLogos/bookleft.svg"
                        alt="Novel Icon"
                        width={11}
                        height={14}
                        className="-mr-[1px] shrink-0"
                    />
                    <Image
                        src="/tabLogos/bookright.svg"
                        alt="Novel Icon"
                        width={10}
                        height={14}
                        className="shrink-0"
                    />
                </div>
                  {h.chapterCount} chapters</span>
              </div>

              {/* Description */}
              <p className="max-w-[42%] text-sm sm:text-base text-white/80 line-clamp-2">
                {h.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-4 z-10">
        {safeHighlights.map((_, i) => (
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
                background: i === index ? "#8664F4" : "#a1a1aa",
                transition: "background 0.2s",
              }}
            />
          </button>
        ))}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
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
