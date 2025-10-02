
import Navbar  from "@/components/navbar";
import CategoryTabs from "@/components/tabs";
import HighlightCarousel from "@/components/section1/imagescroll";
import Announcement from "@/components/section1/accouncements";

import ThisWeek from "@/components/section2/thisweek";
import TitleWeek from "@/components/section2/weektitle";

import Latest from "@/components/section3/latest";
import TitleLatest from "@/components/section3/latesttitle";

import Recently_Updated from "@/components/section5/recent-updates/Recently_Updated";
import GenreBlock from "@/components/section4/genre_landingpage/GenreBlock";

import FooterContacts from "@/components/footers/footercontact";

import { Highlight } from "@/interfaces/Highlights";
import Image from "next/image";
import FooterBody from "@/components/footers/footerbody";
import CertificationsFooter from "@/components/footers/footercertificate";


const carous = [
  {
    title: "Nine Star Hegemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  
  {
    title: "Nine Star125362 Hegemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  
  {
    title: "Nine Star Heg12215emon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  {
    title: "Nine Star H13251egemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  {
    title: "Nine Star Hegemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  {
    title: "Nine Star Hegemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  {
    title: "Nine Star Hegemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  {
    title: "Nine Star Hegemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  {
    title: "Nine Star Hegemon Body Art",
    rating: 4.6,
    numReviews: 50,
    viewers: 256,
    image: (
      <Image
        src="/covers/cover.png"
        alt="Nine Star Hegemon Body Art"
        // width={190}
        // height={270}
        fill
        className="rounded-t-2xl w-full h-full object-cover"
      />
    ),
  },
  // More items...
];

const highlights: Highlight[] = [
  {
    image: "/covers/corousel.png",
    title: "Wandering Knight",
    tags: ["Fantasy", "Ongoing"],
    likeRate: 0.94,
    chapterCount: 567,
    description: "The land of Aleisterre is a world of might and magic, sword and sorcery, where wandering...",
  },
  {
    image: "/covers/corousel.png",
    title: "Wandering Knight",
    tags: ["Fantasy", "Ongoing"],
    likeRate: 0.94,
    chapterCount: 567,
    description: "The land of Aleisterre is a world of might and magic, sword and sorcery, where wandering...",
  },
  // Add more highlight items here
];

const announcements = [
    {
      title: "Server Maintenance",
      description: "Our servers will be down for scheduled maintenance tonight from 12AM to 3AM IST.",
      time: "2 hours ago",
      badge: "Important",
      icon: (
         <Image
            src="/uiElements/medle.svg"
            alt="Announcement Icon"
            width={24}
            height={24} 
            />
      ),
    },
    {
      title: "New Feature Released",
      description: "Dark mode is now available in your settings. Switch and enjoy a better night-time experience!",
      time: "Yesterday",
      badge: "New",
      icon: (
        //  <Image
        //     src="/tabLogos/star.svg"
        //     alt="Announcement Icon"
        //     width={24}
        //     height={24} 
        //     />
        <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.2552 1.06921L14.3439 7.32661L21.2511 8.33618L16.2531 13.2042L17.4327 20.0813L11.2552 16.8326L5.07781 20.0813L6.25732 13.2042L1.2594 8.33618L8.16652 7.32661L11.2552 1.06921Z" stroke="#C084FC" strokeWidth="1.99917" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
    },
    {
      title: "Welcome to the Community!",
      description: "Join our Discord and connect with fellow members.",
      time: "3 days ago",
      icon: (
         <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.7566 14.5739C9.41936 14.5739 10.055 14.3107 10.5236 13.842C10.9923 13.3734 11.2556 12.7378 11.2556 12.075C11.2556 10.6956 10.7558 10.0758 10.256 9.07624C9.18442 6.93413 10.0321 5.02392 12.2551 3.07874C12.7549 5.57769 14.2543 7.97669 16.2535 9.57603C18.2526 11.1754 19.2522 13.0746 19.2522 15.0737C19.2522 15.9926 19.0712 16.9025 18.7196 17.7514C18.368 18.6003 17.8526 19.3717 17.2028 20.0214C16.5531 20.6712 15.7817 21.1866 14.9328 21.5382C14.0839 21.8898 13.174 22.0708 12.2551 22.0708C11.3363 22.0708 10.4264 21.8898 9.57747 21.5382C8.72855 21.1866 7.95719 20.6712 7.30745 20.0214C6.65772 19.3717 6.14231 18.6003 5.79068 17.7514C5.43904 16.9025 5.25806 15.9926 5.25806 15.0737C5.25806 13.9212 5.69088 12.7807 6.25764 12.075C6.25764 12.7378 6.52092 13.3734 6.98957 13.842C7.45821 14.3107 8.09383 14.5739 8.7566 14.5739Z" stroke="#C084FC" strokeWidth="1.99917" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
    },
    {
      title: "Welcome to the Community!",
      description: "Join our Discord and connect with fellow members.",
      time: "3 days ago",
      icon: (
         <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.7566 14.5739C9.41936 14.5739 10.055 14.3107 10.5236 13.842C10.9923 13.3734 11.2556 12.7378 11.2556 12.075C11.2556 10.6956 10.7558 10.0758 10.256 9.07624C9.18442 6.93413 10.0321 5.02392 12.2551 3.07874C12.7549 5.57769 14.2543 7.97669 16.2535 9.57603C18.2526 11.1754 19.2522 13.0746 19.2522 15.0737C19.2522 15.9926 19.0712 16.9025 18.7196 17.7514C18.368 18.6003 17.8526 19.3717 17.2028 20.0214C16.5531 20.6712 15.7817 21.1866 14.9328 21.5382C14.0839 21.8898 13.174 22.0708 12.2551 22.0708C11.3363 22.0708 10.4264 21.8898 9.57747 21.5382C8.72855 21.1866 7.95719 20.6712 7.30745 20.0214C6.65772 19.3717 6.14231 18.6003 5.79068 17.7514C5.43904 16.9025 5.25806 15.9926 5.25806 15.0737C5.25806 13.9212 5.69088 12.7807 6.25764 12.075C6.25764 12.7378 6.52092 13.3734 6.98957 13.842C7.45821 14.3107 8.09383 14.5739 8.7566 14.5739Z" stroke="#C084FC" strokeWidth="1.99917" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
    },
    {
      title: "Welcome to the Community!",
      description: "Join our Discord and connect with fellow members.",
      time: "3 days ago",
      icon: (
         <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.7566 14.5739C9.41936 14.5739 10.055 14.3107 10.5236 13.842C10.9923 13.3734 11.2556 12.7378 11.2556 12.075C11.2556 10.6956 10.7558 10.0758 10.256 9.07624C9.18442 6.93413 10.0321 5.02392 12.2551 3.07874C12.7549 5.57769 14.2543 7.97669 16.2535 9.57603C18.2526 11.1754 19.2522 13.0746 19.2522 15.0737C19.2522 15.9926 19.0712 16.9025 18.7196 17.7514C18.368 18.6003 17.8526 19.3717 17.2028 20.0214C16.5531 20.6712 15.7817 21.1866 14.9328 21.5382C14.0839 21.8898 13.174 22.0708 12.2551 22.0708C11.3363 22.0708 10.4264 21.8898 9.57747 21.5382C8.72855 21.1866 7.95719 20.6712 7.30745 20.0214C6.65772 19.3717 6.14231 18.6003 5.79068 17.7514C5.43904 16.9025 5.25806 15.9926 5.25806 15.0737C5.25806 13.9212 5.69088 12.7807 6.25764 12.075C6.25764 12.7378 6.52092 13.3734 6.98957 13.842C7.45821 14.3107 8.09383 14.5739 8.7566 14.5739Z" stroke="#C084FC" strokeWidth="1.99917" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
    },
    {
      title: "Welcome to the Community!",
      description: "Join our Discord and connect with fellow members.",
      time: "3 days ago",
      icon: (
         <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.7566 14.5739C9.41936 14.5739 10.055 14.3107 10.5236 13.842C10.9923 13.3734 11.2556 12.7378 11.2556 12.075C11.2556 10.6956 10.7558 10.0758 10.256 9.07624C9.18442 6.93413 10.0321 5.02392 12.2551 3.07874C12.7549 5.57769 14.2543 7.97669 16.2535 9.57603C18.2526 11.1754 19.2522 13.0746 19.2522 15.0737C19.2522 15.9926 19.0712 16.9025 18.7196 17.7514C18.368 18.6003 17.8526 19.3717 17.2028 20.0214C16.5531 20.6712 15.7817 21.1866 14.9328 21.5382C14.0839 21.8898 13.174 22.0708 12.2551 22.0708C11.3363 22.0708 10.4264 21.8898 9.57747 21.5382C8.72855 21.1866 7.95719 20.6712 7.30745 20.0214C6.65772 19.3717 6.14231 18.6003 5.79068 17.7514C5.43904 16.9025 5.25806 15.9926 5.25806 15.0737C5.25806 13.9212 5.69088 12.7807 6.25764 12.075C6.25764 12.7378 6.52092 13.3734 6.98957 13.842C7.45821 14.3107 8.09383 14.5739 8.7566 14.5739Z" stroke="#C084FC" strokeWidth="1.99917" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
    },
    {
      title: "Welcome to the Community!",
      description: "Join our Discord and connect with fellow members.",
      time: "3 days ago",
      icon: (
         <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.7566 14.5739C9.41936 14.5739 10.055 14.3107 10.5236 13.842C10.9923 13.3734 11.2556 12.7378 11.2556 12.075C11.2556 10.6956 10.7558 10.0758 10.256 9.07624C9.18442 6.93413 10.0321 5.02392 12.2551 3.07874C12.7549 5.57769 14.2543 7.97669 16.2535 9.57603C18.2526 11.1754 19.2522 13.0746 19.2522 15.0737C19.2522 15.9926 19.0712 16.9025 18.7196 17.7514C18.368 18.6003 17.8526 19.3717 17.2028 20.0214C16.5531 20.6712 15.7817 21.1866 14.9328 21.5382C14.0839 21.8898 13.174 22.0708 12.2551 22.0708C11.3363 22.0708 10.4264 21.8898 9.57747 21.5382C8.72855 21.1866 7.95719 20.6712 7.30745 20.0214C6.65772 19.3717 6.14231 18.6003 5.79068 17.7514C5.43904 16.9025 5.25806 15.9926 5.25806 15.0737C5.25806 13.9212 5.69088 12.7807 6.25764 12.075C6.25764 12.7378 6.52092 13.3734 6.98957 13.842C7.45821 14.3107 8.09383 14.5739 8.7566 14.5739Z" stroke="#C084FC" strokeWidth="1.99917" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      ),
    },
  ];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#141a29] text-white">
      <Navbar />
      <main className="flex flex-col gap-[32px] items-center flex-grow ">
        <div className="flex flex-row items-center justify-start bg-[#141a29] w-full h-[73px] px-25">
        {/* <div className="flex flex-row items-center justify-start bg-[#1E293B80] w-full h-16 px-4 blur-sm"> */}
        {/* <div className="flex flex-row items-center justify-start bg-[#1E293B80] w-full h-16 px-4 blur-lg"> */}
          <CategoryTabs />
        </div>

        <div className="flex  flex-col h-auto w-full max-w-[90%] p-6 rounded-lg shadow-lg ">
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="basis-[60%]">
              <HighlightCarousel highlights={highlights} intervalMs={10000} />
            </div>
            <div className="basis-[40%]">
              <Announcement announcements={announcements} />
            </div>
          </div>
          {/* <div className="bg-amber-200 flex flex-col h-[400px] mb-90"> */}
          <div className="flex flex-col h-[400px] mb-60 mt-5">
            <TitleWeek />
            <ThisWeek carous={carous} />
          </div>

          <div className="flex flex-col h-[400px] mb-65">
            <TitleLatest />
            <Latest carous={carous} />
          </div>
          <div className="mb-9">
            <GenreBlock />
          </div>
          <div className="mb-10">
            <Recently_Updated />
          </div>
        </div>
      </main>
      <footer className="bottom-0 bg-amber-500 flex flex-col items-center justify-center">
        <FooterContacts />

        <FooterBody />

        <CertificationsFooter />
      </footer>
    </div>
  );
}
