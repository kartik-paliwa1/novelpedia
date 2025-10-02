import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: Record<string, unknown>;
      primitive: Record<string, unknown>;
      [key: string]: Record<string, unknown>;
    }
  }
}
