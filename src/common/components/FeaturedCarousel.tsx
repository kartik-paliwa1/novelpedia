'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ThumbsUp, BookOpen } from 'lucide-react';
import { genreStyleMap } from '@/utils/genreStyles';

const featured = [
  {
    id: 1,
    title: 'Wandering Knight',
    tags: ['Fantasy', 'Ongoing'],
    likes: 94,
    chapters: 567,
    image: '/novel-1.svg',
    synopsis:
      'The land of Aleisterre is a world of might and magic, sword and sorcery, where wandering...',
  },
  {
    id: 2,
    title: 'My Journey to Immortality Begins with Hunting',
    tags: ['Fantasy', 'Ongoing'],
    likes: 77,
    chapters: 420,
    image: '/novel-1.svg',
    synopsis:
      'After blacking out at a class reunion, Li Yuan awakens in a brutal world reminiscent of ancient China...',
  },
  {
    id: 3,
    title: 'The Forgotten Blade',
    tags: ['Action', 'Complete'],
    likes: 88,
    chapters: 360,
    image: '/novel-1.svg',
    synopsis:
      'Reincarnated with a cursed blade, he must slay to remember who he was—and survive the memory.',
  },
];

export default function FeaturedCarousel() {
  // State to track the currently active carousel item
  const [active, setActive] = useState(0);
  // Reference to the carousel container for scroll control
  const carouselRef = useRef<HTMLDivElement>(null);
  // State to pause/resume the carousel auto-scroll
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Automatically scrolls to the next carousel item every 2 seconds unless paused
    const interval = setInterval(() => {
      if (!isPaused && carouselRef.current) {
        const nextIndex = (active + 1) % featured.length;
        const cardWidth =
          carouselRef.current.querySelector('.carousel-card')?.clientWidth ||
          320;
        carouselRef.current.scrollTo({
          left: cardWidth * nextIndex,
          behavior: 'smooth',
        });
        setActive(nextIndex);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [active, isPaused]);

  return (
    <div className="w-full mt-2 overflow-x-hidden box-border">
      <div className="relative">
        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-3 pr-3 gap-3 sm:pl-5 sm:pr-5 sm:gap-4 box-border max-w-screen"
          onScroll={(e) => {
            const cardWidth =
              e.currentTarget.querySelector('.carousel-card')?.clientWidth ||
              320;
            const scrollLeft = e.currentTarget.scrollLeft;
            const index = Math.round(scrollLeft / cardWidth);
            setActive(index);
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="w-[7vw] sm:w-[24px] shrink-0" />
          {featured.map((item, idx) => (
            <div
              key={item.id}
              className="carousel-card relative snap-center shrink-0 w-[85vw] max-w-[382px] h-[85vw] max-h-[370px] sm:w-[382px] sm:h-[370px] rounded-2xl overflow-hidden box-border transition-transform duration-500"
            >
              {/* Background image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority={idx === 0}
              />

              {/* Gradient overlay */}
              <div
                className="absolute bottom-0 right-0 h-[130px] w-full z-0"
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgb(14, 14, 21), rgba(14, 14, 21, 0))',
                }}
              />

              {/* Content */}
              <div className="absolute bottom-1 w-full p-4 text-white space-y-2 z-10">
                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        genreStyleMap[tag]?.bg || 'bg-white/10'
                      } ${genreStyleMap[tag]?.text || 'text-white'} ${genreStyleMap[tag]?.border || 'border-white/20'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#F9F6EE]">
                  {item.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <ThumbsUp
                      className="w-4 h-4 text-[#9381E0]"
                      strokeWidth={2}
                    />
                    <span className="text-white">{item.likes}</span>
                  </span>
                  <span className="flex items-center gap-1 text-white">
                    <BookOpen
                      className="w-4 h-4 text-[#9381E0]"
                      strokeWidth={2}
                    />
                    {item.chapters} chapters
                  </span>
                </div>

                {/* Synopsis */}
                <p className="text-[14px] leading-snug text-gray-200 font-normal tracking-wide line-clamp-2">
                  {item.synopsis}
                </p>
              </div>

              {/* Pagination Dots (on image) */}
              {idx === active && (
                <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {featured.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`rounded-full transition-all duration-300 ${
                        dotIdx === idx
                          ? 'bg-[#8664F4] w-2 h-2'
                          : 'bg-white/30 w-1.5 h-1.5'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="w-[7vw] sm:w-[24px] shrink-0" />
        </div>
        <div className="border-b-2 border-[#5F4167] mx-0 mt-2" />
      </div>
    </div>
  );
}
