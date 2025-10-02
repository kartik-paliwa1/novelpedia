"use client";

import Image from 'next/image';
import './componentcss/navbar.css';
import SearchBar from '@/modules/landing/components/searchbar';
import { useState } from 'react';

export default function Navbar() {

  const [section, setSection] = useState('home');

  const [notification, setNotification] = useState(true);
  const [profile_notification, setProfileNotification] = useState(true);

  return (
    // <nav className="bg-[#0D1320] p-4">
    <div className="fixed top-0 w-full z-50 bg-[#0D1320] p-4 border-b border-[#5c4464]">
      <div className="w-full flex justify-between items-center">
        <div className="text-white flex justify-between items-center font-bold">
            <Image
                src="/logo.svg"
                alt="Logo Icon"
                width={36}
                height={36}
            />
            <span className="logo-title">NovelPedia</span>
        </div>
        

        <div className="flex mx-0.5 space-x-16 max-[1330]:space-x-2 max-[1250]:space-x-2 text-[#9CA3AF] items-center">
          <div className={section=="home"? 'py-0.5 px-1.5 bg-[#39254A33] rounded text-[#A598D8]' : 'y-0.5 px-1.5 bg-transparent'}><a href="#" onClick={ (e) => {  e.preventDefault(); setSection("home") }} className="hover:text-[#A598D8]">Home</a></div>
          <div className={section=="explore"? 'py-0.5 px-1.5 bg-[#39254A33] rounded text-[#A598D8]' : 'y-0.5 px-1.5 bg-transparent'}><a href="#" onClick={ (e) => {  e.preventDefault(); setSection("explore") }} className="hover:text-[#A598D8]">Explore</a></div>
          <div className={section=="forums"? 'py-0.5 px-1.5 bg-[#39254A33] rounded text-[#A598D8]' : 'y-0.5 px-1.5 bg-transparent'}><a href="#" onClick={ (e) => {  e.preventDefault(); setSection("forums") }} className="hover:text-[#A598D8]">Forums</a></div>
          <div className={section=="feed"? 'py-0.5 px-1.5 bg-[#39254A33] rounded text-[#A598D8]' : 'y-0.5 px-1.5 bg-transparent'}><a href="#" onClick={ (e) => {  e.preventDefault(); setSection("feed") }} className="hover:text-[#A598D8]">Feed</a></div>
          <div className={section=="library"? 'py-0.5 px-1.5 bg-[#39254A33] rounded text-[#A598D8]' : 'y-0.5 px-1.5 bg-transparent'}><a href="#" onClick={ (e) => {  e.preventDefault(); setSection("library") }} className="hover:text-[#A598D8]">Library</a></div>
        </div>

        {/* <div className='flex flex-grow w-full max-w-md'> */}
            <SearchBar />
        {/* </div> */}

        <div className="flex items-center space-x-4 max-[1250]:space-x-0.5 mr-3">
            <Image
                // src="/notification.png"
                src={notification? "/navbarLogos/notification.png" : "/navbarLogos/notification_off.png"}
                alt="Notification Icon"
                width={30}
                height={36}
                className="cursor-pointer hover:opacity-80"
            />

            <div className="relative">

              <Image
                  src="/navbarLogos/profile.svg"
                  alt="Profile Icon"
                  width={36}
                  height={36}
                  className="cursor-pointer hover:opacity-80 ml-4 max-[1250]:ml-0.5"
              />

              {profile_notification && (
                  <Image
                  src="/navbarLogos/attention.png"  // replace with your overlay image source
                  alt="Overlay Icon"
                  width={9.4}  // size as needed
                  height={9.4}
                  className="absolute -top-1 -right-1"
              />
              )}
            
            </div>
        </div>
      </div>
    </div>
  );
}