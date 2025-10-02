'use client';
import FeaturedTopBook from '@/modules/genre_landingpage/components/FeaturedTopBook';
import GenreBookList from '@/modules/genre_landingpage/components/GenreBookList';
import { genreData, GenreKey } from '@/modules/genre_landingpage/components/genreData';

type Props = {
  genre: GenreKey;
  refProp: React.RefObject<HTMLDivElement | null>;
};

export default function GenreCard({ genre, refProp }: Props) {
  const genreInfo = genreData[genre];
  const [topBook, ...otherBooks] = genreInfo.books;

  return (
    <div ref={refProp} className="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl:w-[40%] 2xl:w-[33%]">
      <div className="rounded-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className={`relative rounded-t-xl p-5 bg-gradient-to-r ${genreInfo.color} overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-5 w-16 h-16 border border-white/20 rounded-full" />
            <div className="absolute bottom-10 right-5 w-12 h-12 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-8 h-8 border border-white/20 rounded-full" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl">{genreInfo.icon}</span>
              <h3 className="text-white text-xl font-bold">{genre}</h3>
            </div>
            <p className="text-white/80">{genreInfo.description}</p>
          </div>
        </div>

        {/* Top Book */}
        <FeaturedTopBook book={topBook} gradient={genreInfo.color} />

        {/* Book List */}
        <GenreBookList
          genre={genre}
          books={otherBooks}
          bgColor={genreInfo.bgColor}
          textColor={genreInfo.textColor}
          color={genreInfo.color}
        />
      </div>
    </div>
  );
}
