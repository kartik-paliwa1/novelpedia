declare module 'maath' {
  export const easing: {
    damp: (
      object: unknown,
      key: string,
      target: number,
      smoothing: number,
      delta: number
    ) => void;
    [key: string]: unknown;
  };
}
