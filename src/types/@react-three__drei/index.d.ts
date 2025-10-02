declare module '@react-three/drei' {
  import type React from 'react';
  import type { GLTF } from 'three-stdlib';

  export const Environment: React.ComponentType<Record<string, unknown>>;
  export const Loader: React.ComponentType<Record<string, unknown>>;
  export function useGLTF(path: string): GLTF;
  export namespace useGLTF {
    function preload(path: string): void;
  }
}
