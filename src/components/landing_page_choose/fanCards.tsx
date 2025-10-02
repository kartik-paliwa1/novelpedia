"use client";

import React, { useMemo, useState, useRef } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react"; // Ensure you have this package installed
import Image from "next/image";

type Face = "AUTHOR" | "READER";

// Install: npm i @lottiefiles/dotlottie-react

/**
 * Playing-card style component with optional .lottie or GIF media at the top.
 * - Looks like a premium playing card (rounded corners, subtle edge patterns)
 * - On hover: card lifts + tilts a bit more; if it's a Lottie, it loops until hover ends
 */

type Media = string;

type CardProps = {
  title: string;
  description: string;
  media: Media;
  /**
   * Base rotation in degrees. Ex: -8 means rotated slightly counterclockwise
   * Provide a small negative for left, positive for right to mimic a fanned hand.
   */
  baseRotateDeg?: number;
  /** Accent ring + glow hue (any CSS color). */
  accent?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
};

function EdgePattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[1.25rem]"
      aria-hidden
    >
      {/* corner florets with radial gradients */}
      <div className="absolute left-2 top-2 h-8 w-8 rounded-full opacity-25 [background:radial-gradient(circle,_currentColor_0,_transparent_70%)]" />
      <div className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-25 [background:radial-gradient(circle,_currentColor_0,_transparent_70%)]" />
      <div className="absolute left-2 bottom-2 h-8 w-8 rounded-full opacity-25 [background:radial-gradient(circle,_currentColor_0,_transparent_70%)]" />
      <div className="absolute right-2 bottom-2 h-8 w-8 rounded-full opacity-25 [background:radial-gradient(circle,_currentColor_0,_transparent_70%)]" />

      {/* inner decorative border using conic + dashed effect */}
      <div className="absolute inset-[10px] rounded-[1rem] border border-white/10 [background:repeating-conic-gradient(from_0deg,_transparent_0_10deg,_white/5_10deg_20deg)] opacity-50" />
    </div>
  );
}

export function PlayingCard({
  title,
  description,
  media,
  baseRotateDeg = 0,
  accent = "hsl(262, 83%, 60%)",
  onMouseEnter,
  onMouseLeave,
  onClick,
}: CardProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const baseRotate = useMemo(
    () => `rotate(${baseRotateDeg}deg)`,
    [baseRotateDeg]
  );
  const hoverRotate = useMemo(
    () => `rotate(${baseRotateDeg + (baseRotateDeg >= 0 ? 5 : -5)}deg)`,
    [baseRotateDeg]
  );

  const onEnter = () => {
    if (dotLottie) {
      // Loop while hovered
      try {
        dotLottie?.setLoop?.(true);
        dotLottie?.play?.();
      } catch {}
    }

    onMouseEnter?.();
  };

  const onLeave = () => {
    if (dotLottie) {
      // Stop at first frame when hover ends
      try {
        dotLottie?.setLoop?.(false);
        dotLottie?.stop?.();
      } catch {}
    }
    onMouseLeave?.();
  };

  return (
    <div
      // className="group relative h-[270px] w-[180px] select-none lg:h-[360px] lg:w-[240px] max-[370px]:h-[195px] max-[370px]:w-[130px]"
      className="group relative select-none h-[300px] w-[200px] lg:h-[360px] lg:w-[240px]"
      style={{ perspective: 1000 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div
        className="relative h-full w-full rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,24,0.9),rgba(10,10,12,0.9))] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 will-change-transform"
        style={{ transform: baseRotate }}
      >
        {/* glow ring */}
        <div
          className="absolute -inset-px rounded-[1.3rem] opacity-40 blur-[2px]"
          style={{ boxShadow: `0 0 0 2px ${accent}` }}
        />

        {/* subtle gradient sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] [background:linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.06)_60%,transparent_80%)]" />

        <EdgePattern />

        <div className="relative z-10 flex h-full w-full flex-col items-center p-4">
          {/* Media area */}
          {/* <div className="mt-2 flex h-40 w-[90%] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30"> */}
          <div className="mt-2 flex h-40 w-[90%] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#131A2A]">
            <DotLottieReact
              dotLottieRefCallback={setDotLottie}
              src={media}
              autoplay={false}
              loop={false}
              className="h-32 lg:h-38 w-auto"
            />
          </div>

          {/* Title */}
          <h3 className="mt-4 text-center text-lg font-semibold tracking-wide text-white/95">
            {title}
          </h3>
          {/* Description */}
          <p className="mt-1 max-w-[90%] text-center text-xs leading-snug text-white/70">
            {description}
          </p>
        </div>
      </div>

      {/* Hover transforms */}
      <style jsx>{`
        .group:hover > div {
          transform: translateY(-10px) ${hoverRotate};
        }
      `}</style>
    </div>
  );
}

function FingersOverlay() {
  return (
    <div className="pointer-events-none absolute -bottom-[10%] left-1/2 z-20 items-end -translate-x-1/2 flex scale-75 max-[600px]:scale-65 max-[600px]:-bottom-[16%] lg:scale-100">
      {[0, 1, 2].map((i) => {
        if (i === 0) {
          return (
            // <div
            //   key={i}
            //   className="h-15 w-8 rotate-10 rounded-full opacity-90 shadow-[inset_0_2px_2px_rgba(255,255,255,0.35),_0_3px_8px_rgba(0,0,0,0.5)]"
            //   style={{ background: "linear-gradient(#f6c7a5,#db9f7a)" }}
            // />
            
            <Image
              key={i}
              src="/finger.png"
              alt="Description of the image"
              width={115} // Required for intrinsic sizing
              height={333} // Required for intrinsic sizing
              priority
              className="w-auto h-32 -rotate-18"
            />
          );
        } else if (i === 1) {
          return (
            // <div
            //   key={i}
            //   className="h-15 w-8 rounded-full opacity-90 shadow-[inset_0_2px_2px_rgba(255,255,255,0.35),_0_3px_8px_rgba(0,0,0,0.5)]"
            //   style={{ background: "linear-gradient(#f6c7a5,#db9f7a)" }}
            // />
            <Image
              key={i}
              src="/finger.png"
              alt="Description of the image"
              width={115} // Required for intrinsic sizing
              height={333} // Required for intrinsic sizing
              priority
              className="w-auto h-38"
            />
          );
        } else if (i === 2) {
          return (
            // <div
            //   key={i}
            //   className="h-15 w-8 -rotate-10 rounded-full opacity-90 shadow-[inset_0_2px_2px_rgba(255,255,255,0.35),_0_3px_8px_rgba(0,0,0,0.5)]"
            //   style={{ background: "linear-gradient(#f6c7a5,#db9f7a)" }}
            // />
            <Image
              key={i}
              src="/finger.png"
              alt="Description of the image"
              width={115} // Required for intrinsic sizing
              height={333} // Required for intrinsic sizing
              priority
              className="w-auto h-32 rotate-16"
            />
          );
        }
      })}
    </div>
  );
}

/**
 * Demo/showcase: two cards fanned like they’re held between fingers.
 * Provide your own .lottie URL and GIF URL.
 */
export default function CardsHeldLikePlayingCards({
  onHoverAuthor,
  onHoverReader,
  onHoverNone,
  handleClick,
}: {
  onHoverAuthor?: () => void;
  onHoverReader?: () => void;
  onHoverNone?: () => void;
  handleClick?: (dest: '/dashboard' | '/waitlist',face: Face) => void;
} = {}) {
  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="relative flex flex-row scale-90 max-[430]:scale-75 lg:scale-100">
        {/* Slight fan spread */}
        <div className="relative z-10 -mr-5 inline-block hover:z-20 hover:-translate-x-2 hover:-translate-y-2 transition-transform duration-300">
          <PlayingCard
            title="AUTHOR"
            description="Publish boldly. Keep your rights. Build your fandom."
            media="https://lottie.host/7b52f2f3-179a-4035-9c78-4bc3e085a63f/8R8It8Arw2.lottie"
            baseRotateDeg={-8}
            accent="hsl(254, 87%, 67%)"
            onMouseEnter={onHoverAuthor}
            onMouseLeave={onHoverNone}
            onClick={() => handleClick?.("/dashboard","AUTHOR")}
            aria-label="Continue as Author"
          />
        </div>
        <div className="relative z-0 inline-block hover:z-20 hover:translate-x-2 hover:-translate-y-2 transition-transform duration-300">
          <PlayingCard
            title="READER"
            description="Discover stories your way. Follow, tip, and join the fun."
            media="https://lottie.host/9273293c-fe90-48c8-a44c-bc6c0eb5a506/435tLnTuhj.lottie"
            baseRotateDeg={6}
            accent="hsl(293, 100%, 36%)"
            onMouseEnter={onHoverReader}
            onMouseLeave={onHoverNone}
            onClick={() => handleClick?.("/waitlist","READER")}
            aria-label="Continue as Reader"
          />
        </div>

        {/* Fingers overlay */}
        <FingersOverlay />
      </div>
    </div>
  );
}
