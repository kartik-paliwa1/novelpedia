declare module '@lottiefiles/dotlottie-react' {
  import type React from 'react';

  export interface DotLottieOptions {
    src?: string;
    autoplay?: boolean;
    loop?: boolean;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }

  export interface DotLottieReactHandle {
    play?: () => void;
    stop?: () => void;
    pause?: () => void;
    setLoop?: (loop: boolean) => void;
    [key: string]: unknown;
  }

  export const DotLottieReact: React.ForwardRefExoticComponent<
    DotLottieOptions & { dotLottieRefCallback?: (instance: DotLottie | null) => void }
  >;

  export class DotLottie {
    play?: () => void;
    stop?: () => void;
    pause?: () => void;
    setLoop?: (loop: boolean) => void;
    [key: string]: unknown;
  }
}
