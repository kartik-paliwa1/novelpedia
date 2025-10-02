'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim'; // or loadAll from '@tsparticles/all'

export default function BackgroundParticles() {
  const [ready, setReady] = useState(false);
  const [options, setOptions] = useState<ISourceOptions | null>(null);

  useEffect(() => {
    // initialize the engine once
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine); // or await loadAll(engine)
    }).then(() => setReady(true));

    // load your JSON config at runtime
    fetch('/background.json')
      .then((r) => r.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error('Failed to load background.json', err));
  }, []);

  if (!ready || !options) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        // zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Particles id="tsparticles" options={options} />
    </div>
  );
}
