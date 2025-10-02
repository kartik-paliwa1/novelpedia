declare module '@tsparticles/engine' {
  export interface Engine {
    addPreset: (...args: unknown[]) => void;
    [key: string]: unknown;
  }

  export interface ISourceOptions {
    [key: string]: unknown;
  }
}
