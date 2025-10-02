declare module '@react-three/fiber' {
  import type React from 'react';

  export const Canvas: React.ComponentType<Record<string, unknown>>;
  export function useFrame(
    callback: (state: unknown, delta: number) => void,
    renderPriority?: number
  ): void;
}
