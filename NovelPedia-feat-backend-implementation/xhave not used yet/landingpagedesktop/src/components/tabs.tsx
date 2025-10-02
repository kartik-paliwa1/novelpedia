"use client";
import { useState } from "react";
import Image from "next/image";

type Tab = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

export default function CategoryTabs() {
  const [active, setActive] = useState<string>("novels");

  const tabs: Tab[] = [
    {
      key: "novels",
      label: "Novels",
      icon: (
        <div className="flex flex-row items-center justify-center">
            <Image
                src="/tabLogos/bookleft.svg"
                alt="Novel Icon"
                width={11}
                height={14}
                className="-mr-[1px] shrink-0"
            />
            <Image
                src="/tabLogos/bookright.svg"
                alt="Novel Icon"
                width={10}
                height={14}
                className="shrink-0"
            />
        </div>
      ),
    },
    {
      key: "fanfiction",
      label: "Fanfiction",
      icon: (
        <Image
            src="/tabLogos/gemini.svg"
            alt="Fanfiction Icon"
            width={18}
            height={18}
            className="shrink-0"
        />
      ),
    },
    {
      key: "rankings",
      label: "Rankings",
      icon: (
        <Image
            src="/tabLogos/ranking.svg"
            alt="Ranking Icon"
            width={18}
            height={18}
            className="shrink-0"
        />
      ),
    },
    {
      key: "for-you",
      label: "For You",
      icon: (
        <Image
            src="/tabLogos/star.svg"
            alt="For You Icon"
            width={18}
            height={18}
            className="shrink-0"
        />
      ),
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
        //   <button
        //     key={t.key}
        //     onClick={() => setActive(t.key)}
        //     className={[
        //       "inline-flex items-center gap-4 px-5 py-3 rounded-2xl transition-colors w-[140px] h-[40px]",
        //       "font-sans font-medium text-[14px] leading-[20px] tracking-[0] text-center align-middle",
        //       "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        //       isActive
        //         ? "bg-gradient-to-l from-fuchsia-500 to-purple-600 text-white shadow"
        //         : "bg-[#18181B] text-[#FFFFFFB2] hover:bg-neutral-800",
        //     ].join(" ")}
        //   >
        //     {t.icon}
        //     <span className="text-sm font-medium">{t.label}</span>
        //   </button>
        <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={[
                "inline-flex items-center px-5 py-3 rounded-2xl w-[140px] h-[40px]",
                "font-sans font-medium text-[14px] leading-[20px] tracking-[0] text-center align-middle",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                "transition-colors duration-300",
                isActive
                ? "bg-gradient-to-l from-fuchsia-500 to-[#7248e1] text-white shadow"
                : "bg-[#18181B] text-[#FFFFFFB2] hover:bg-neutral-800",
            ].join(" ")}
            >
            <span
                className={[
                "inline-flex items-center justify-center gap-4 w-full",
                "transition-all duration-300 ease-out origin-center will-change-transform will-change-opacity",
                isActive ? "opacity-100 scale-100" : "opacity-80 scale-95",
                ].join(" ")}
            >
                {t.icon}
                <span className="text-sm font-medium">{t.label}</span>
            </span>
        </button>

        );
      })}
    </div>
  );
}
