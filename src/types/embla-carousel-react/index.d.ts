declare module 'embla-carousel-react' {
  import type React from 'react';
  import type { EmblaOptionsType } from 'embla-carousel';
  type EmblaCarouselType = {
    scrollPrev: () => void;
    scrollNext: () => void;
  } | undefined;
  const useEmblaCarousel: (
    options?: EmblaOptionsType
  ) => [React.RefObject<HTMLDivElement>, EmblaCarouselType];
  export default useEmblaCarousel;
}
