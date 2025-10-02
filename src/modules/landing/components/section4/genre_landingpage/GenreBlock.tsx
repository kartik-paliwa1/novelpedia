'use client';

import { useRef, useState } from 'react';
import GenreCard from '@/modules/landing/components/section4/genre_landingpage/GenreCard';
import { genreData, GenreKey } from '@/modules/landing/components/section4/genre_landingpage/genreData';
import Image from 'next/image';

export default function GenreBlock() {
  const [activeGenre, setActiveGenre] = useState<GenreKey>('Fantasy');

  const genreRefs: Record<GenreKey, React.RefObject<HTMLDivElement | null>> = {
    Fantasy: useRef(null),
    Mystery: useRef(null),
    Romance: useRef(null),
    Action: useRef(null),
    Cultivation: useRef(null),
  };

  return (
    <section className="px-4 pb-10 relative z-10">
      <div className="mb-6">
        {/* <h3 className="text-xl font-bold text-white mb-2">
          First, The Top Series
        </h3>
        <p className="text-gray-400 text-lg">
          Let&rsquo;s read top stories by genre!
        </p> */}
        <div className="flex flex-row items-center gap-2">
          <div className="relative w-7 h-22">
            <Image
                src="/uiElements/vertical.svg"
                alt="This Week Icon"
                // width={7}
                // height={20}
                fill
                className="object-fill"
            />
          </div>
          {/* <h3 className="text-4xl font-bold text-white">Recently Updated</h3> */}
          <div className='flex flex-col'>
            <h3 className="text-4xl font-bold text-white mb-2">
            First, The Top Series
            </h3>
            <p className="text-gray-400 text-lg">
              Let&rsquo;s read top stories by genre!
            </p>
          </div>
        </div>
      </div>

      {/* Genre Selector Buttons */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {(Object.keys(genreData) as GenreKey[]).map((genre) => (
            <button
              key={genre}
              onClick={() => {
                genreRefs[genre].current?.scrollIntoView({
                  behavior: 'smooth',
                  inline: 'center',
                  block: 'nearest',
                });
                setActiveGenre(genre);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                activeGenre === genre
                  ? `bg-gradient-to-r ${genreData[genre].color} text-white shadow-lg`
                  : `${genreData[genre].bgColor} ${genreData[genre].textColor} border ${genreData[genre].borderColor}`
              }`}
            >
              <span>{genreData[genre].icon}</span>
              <span className="font-medium">{genre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Genre Cards */}
      <div className="flex overflow-x-auto gap-4 px-1 -mx-1 scrollbar-hide snap-x snap-mandatory pb-4">
        {(Object.keys(genreData) as GenreKey[]).map((genre) => (
          <GenreCard key={genre} genre={genre} refProp={genreRefs[genre]} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-6 flex justify-center">
        <button className="px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all duration-300">
          Browse All Genres
        </button>
      </div>
    </section>
  );
}
