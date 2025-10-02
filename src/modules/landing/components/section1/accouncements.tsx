// components/Announcement.tsx

import React from "react";
import Image from "next/image";

type AnnouncementType = {
  title: string;
  description: string;
  time: string;
  badge?: string;
  icon?: React.ReactNode; // Function to render icon
};

type Props = {
  announcements: AnnouncementType[];
};

export default function Announcement({ announcements }: Props) {
  return (
    <div className="max-w-xl mx-auto p-4 max-[1300]:scale-95">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 max-[1300]:scale-95">
        <span className="inline-block bg-gradient-to-l from-fuchsia-500 to-[#7248e1] text-white shadow p-1.5 rounded-[30%]">
          <Image
            src="/uiElements/gift.svg"
            alt="gift Icon"
            width={24}
            height={24}
          />
        </span>
        Announcements
        <span className="inline-block text-white p-1.5 rounded-[30%]">
          <Image
            src="/tabLogos/gemini.svg"
            alt="Announcement Icon"
            width={24}
            height={24}
            />
        </span>
        <span className="ml-auto mr-1 text-[14px] max-[1300]:text-[10px] text-[#C084FC]">View All →</span>
      </h2>
      <div className="flex flex-col gap-4 h-[500px] overflow-y-auto pr-2 scrollbar-hide">
        {announcements.map((item, idx) => (
          <div key={idx} className="bg-[#181e2e] p-4 rounded-lg shadow flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-gradient-to-l from-[#A855F733] to-[#3B82F633] p-4 rounded">
                {/* Different icons for different types can be added */}
               {item.icon ? item.icon : <Image src="/uiElements/medle.svg" alt="Announcement Icon" width={24} height={24} />}
              </span>
              <span className="font-bold text-white">{item.title}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-1 text-[14px] rounded-full bg-gradient-to-l from-[#EF4444] to-[#EC4899] text-white">{item.badge}</span>
              )}
            </div>
            <div className="pl-[13%]">
                <div className="text-gray-200">{item.description}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                {/* <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3"/>
                </svg> */}
                🕑 {item.time}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
