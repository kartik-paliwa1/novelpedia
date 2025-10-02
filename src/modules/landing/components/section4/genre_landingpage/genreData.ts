// Holds mock genre data used across GenreBlock, GenreCard, FeaturedBook, etc.

export type Book = {
  title: string;
  rating: number;
  image: string;
  chapters: number;
};

export type GenreKey = keyof typeof genreData;

export const genreData = {
  Fantasy: {
    color: 'from-violet-600 to-indigo-800',
    textColor: 'text-violet-300',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
    icon: '✨',
    description: 'Epic adventures await',
    books: [
      {
        title: 'Nine Star Hegemon Body Art',
        rating: 71,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 3245,
      },
      {
        title: "Emperor's Domination",
        rating: 75,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 4563,
      },
      {
        title: "The People's God",
        rating: 82,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 23,
      },
    ],
  },
  Mystery: {
    color: 'from-cyan-600 to-blue-800',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    icon: '🔍',
    description: 'Unravel the unknown',
    books: [
      {
        title: 'Yama Rising',
        rating: 66,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 1245,
      },
      {
        title: 'Lord of the Mysteries',
        rating: 92,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 1394,
      },
      {
        title: 'My House of Horrors',
        rating: 88,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 1530,
      },
    ],
  },
  Romance: {
    color: 'from-pink-600 to-rose-800',
    textColor: 'text-pink-300',
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/10',
    icon: '❤️',
    description: 'Love conquers all',
    books: [
      {
        title: "The Duke's Son :Re",
        rating: 86,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 67,
      },
      {
        title: "Bringing the Nation's Husband Home",
        rating: 79,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 1653,
      },
      {
        title: "A Stay-at-home Dad's Restaurant",
        rating: 83,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 3245,
      },
    ],
  },
  Action: {
    color: 'from-orange-600 to-red-800',
    textColor: 'text-orange-300',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
    icon: '⚔️',
    description: 'Adrenaline rush',
    books: [
      {
        title: "World's No.1 Swordsman",
        rating: 78,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 45,
      },
      {
        title: 'Shadow Monarch',
        rating: 94,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 567,
      },
      {
        title: 'Martial World',
        rating: 81,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 2345,
      },
    ],
  },
  Cultivation: {
    color: 'from-emerald-600 to-green-800',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    icon: '🧘',
    description: 'Ascend to immortality',
    books: [
      {
        title: 'I Shall Seal the Heavens',
        rating: 84,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 1614,
      },
      {
        title: 'Desolate Era',
        rating: 79,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 1452,
      },
      {
        title: 'A Will Eternal',
        rating: 88,
        image: '/placeholder.svg?height=200&width=150',
        chapters: 1341,
      },
    ],
  },
} as const;
