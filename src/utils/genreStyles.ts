// lib/genreStyles.ts
export const genreStyleMap: Record<
  string,
  { bg: string; border?: string; text?: string }
> = {
  Fantasy: {
    bg: 'bg-[#5B3CC4]/20',
    border: 'border-[#5B3CC4]',
    text: 'text-[#C0A8F9]',
  },
  Action: {
    bg: 'bg-[#FF6B6B]/20',
    border: 'border-[#FF6B6B]',
    text: 'text-[#FFAAAA]',
  },
  Romance: {
    bg: 'bg-[#FF69B4]/20',
    border: 'border-[#FF69B4]',
    text: 'text-[#FFB6D5]',
  },
  Comedy: {
    bg: 'bg-[#FFD93B]/20',
    border: 'border-[#FFD93B]',
    text: 'text-[#FFF4B3]',
  },
  Ongoing: {
    bg: 'bg-[#3BB273]/20',
    border: 'border-[#3BB273]',
    text: 'text-[#A8EAC5]',
  },
  Complete: {
    bg: 'bg-[#6B7280]/20',
    border: 'border-[#6B7280]',
    text: 'text-[#D1D5DB]',
  },
};
