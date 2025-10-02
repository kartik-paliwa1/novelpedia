import { BookOpen, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { ensureArray } from '@/utils/safe-array';

// Collection item structure for user's curated book collections
interface Collection {
  id: number;
  name: string;
  description: string;
  coverImages: string[]; // Array of cover images to display in a stack
  novelCount: number;
  followers: number;
}

interface CollectionsGridProps {
  collections: Collection[];
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  const safeCollections = ensureArray<Collection>(collections);
  
  return (
    <div className="space-y-4">
      {safeCollections.map((collection) => (
        <div
          key={collection.id}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/20 hover:border-violet-500/30 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Stacked book covers with negative margin for overlap effect */}
            <div className="flex gap-1 justify-center sm:justify-start">
              {ensureArray(collection.coverImages).map((image, index) => (
                <div
                  key={index}
                  className="w-12 h-16 bg-gray-800/50 rounded-md overflow-hidden"
                  style={{ transform: `translateX(-${index * 4}px)`, zIndex: 3 - index }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-3">
                <h3 className="text-white font-semibold text-lg mb-2 sm:mb-0">{collection.name}</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                  Public
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{collection.description}</p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{collection.novelCount} novels</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{collection.followers} followers</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-sm"
                >
                  View Collection
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
