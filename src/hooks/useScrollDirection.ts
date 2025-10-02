// hooks/useScrollDirection.ts
import { useEffect, useState } from 'react';

export function useScrollDirection(threshold = 10) {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < threshold) return;

      setScrollDir(y > lastY ? 'down' : 'up');
      lastY = y;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrollDir;
}
