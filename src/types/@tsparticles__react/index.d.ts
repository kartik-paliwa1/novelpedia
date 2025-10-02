declare module '@tsparticles/react' {
  import type React from 'react';
  import type { Engine, ISourceOptions } from '@tsparticles/engine';

  export interface ParticlesProps {
    id?: string;
    options?: ISourceOptions;
    init?: (engine: Engine) => Promise<void> | void;
    loaded?: (container: unknown) => Promise<void> | void;
    className?: string;
    [key: string]: unknown;
  }

  const Particles: React.ComponentType<ParticlesProps>;
  export default Particles;

  export function initParticlesEngine(
    init: (engine: Engine) => Promise<void> | void
  ): Promise<void>;
}
