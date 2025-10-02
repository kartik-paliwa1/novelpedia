declare namespace THREE {
  class Object3D {
    add(...objects: Object3D[]): this;
    rotation: {
      x: number;
      y: number;
      z: number;
      [key: string]: number;
    };
  }

  class Group extends Object3D {}
}

declare module 'three' {
  const value: typeof THREE;
  export = value;
}
