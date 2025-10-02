import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
};

export default config;
