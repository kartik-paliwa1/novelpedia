'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Roller3D from '@/components/landing_page_choose/CodeAnimatedRoller';

import CardsHeldLikePlayingCards from '@/components/landing_page_choose/fanCards';
import ParticlesBackground from '@/components/landing_page_choose/ParticlesBackground';

export type Face = 'AUTHOR' | 'READER' | 'CHOOSE' | 'NONE';

export default function Home() {
  const [face, setFace] = useState<Face>('CHOOSE'); // default is CHOOSE (270°)
  const router = useRouter();
  const clickLock = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [size, setSize] = useState(1.1);

  useEffect(() => {
    const handleResize = () => {
      // You can adjust the breakpoint (640px) as needed
      setIsMobile(window.innerWidth < 1024); 
      if (window.innerWidth < 1024) {
        setSize(0.8); // Smaller size for mobile
      }
      if (window.innerWidth < 640) {
        setSize(0.5); // Smaller size for mobile
      }
    };

    
    // Set initial state on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onHoverAuthor = () => setFace('AUTHOR');
  const onHoverReader = () => setFace('READER');
  const onHoverNone = () => setFace('CHOOSE'); // when neither is hovered

  // Click: flip to NONE first, then navigate
  const handleClick = (dest: '/author' | '/reader', face: Face) => {
    if (clickLock.current) return;
    clickLock.current = true;
    
    // setFace('NONE');
    if (isMobile) {

      setFace(face);
    } else {
      setFace('NONE');
    }
    setTimeout(() => {  
      router.push(dest);
    }, 850); // matches the damp timing
  };

  return (
    
    <main className="min-h-[100svh] flex flex-col items-center justify-center gap-8 p-4 bg-[#0F172A]">
      <ParticlesBackground />
      {/* Cards row on top */}
      <div  className='text-[38px] text-purple-400 font-bold mt-8 text-center mb-2 font-noto-kr'>Select Your Experience</div>
      <section className="w-full relative">

        <CardsHeldLikePlayingCards onHoverAuthor={onHoverAuthor} onHoverReader={onHoverReader} onHoverNone={onHoverNone} handleClick={handleClick}/>
      </section>

      {/* 3D roller below the cards */}
      <section className="w-full relative flex-grow  flex justify-center items-center">
       
        <div className="w-full absolute top-2">
          <Roller3D target={face} scale={size} y={0} />
        </div>
      </section>
    </main>
  );
}
