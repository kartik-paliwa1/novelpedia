declare module 'three-stdlib' {
  import type { Object3D } from 'three';

  export interface GLTF {
    scene: {
      clone: () => Object3D;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }
}
