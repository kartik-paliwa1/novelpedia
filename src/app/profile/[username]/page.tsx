'use client';

import Header from '@/common/components/Header';
import BottomNav from '@/common/components/BottomNav';
import ProfileHeader from '@/modules/profile/components/ProfileHeader';
import ProfileInfoBlock from '@/modules/profile/components/ProfileInfoBlock';
import ProfileTabs from '@/modules/profile/components/ProfileTabs';
import ProfileStatsSection from '@/modules/profile/components/ProfileStatsSection';
import PublishedWorks from '@/modules/profile/components/PublishedWorks';
import CollectionsGrid from '@/modules/profile/components/CollectionsGrid';
import ActivityFeed from '@/modules/profile/components/ActivityFeed';
import UserSnapshot from '@/modules/profile/components/UserSnapshot';
import VanityStatsRow from '@/modules/profile/components/VanityStatsRow';
import { useState } from 'react';

const profileTabs = ['Profile Stats', 'Works', 'Collections', 'Activity'];

export default function PublicProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile Stats');
  const [isFollowing, setIsFollowing] = useState(false);

  const publicProfile = {
    username: 'Broly Sensei',
    displayName: 'Utkarsh',
    avatar: '/placeholder.svg?height=120&width=120',
    bio: 'Passionate reader and writer of cultivation novels and fantasy epics. Always hunting for hidden gems and underrated masterpieces. Love discussing plot twists and character development! \ud83d\udcda\u2728',
    joinDate: 'March 2022',
    location: "Mehul's Basement",
    isVerified: true,
    isAuthor: true,
    vanityStats: {
      followers: 2847,
      following: 156,
      publishedWorks: 12,
      totalReads: 1250000,
      averageRating: 4.7,
      reviews: 89,
    },
    readingStats: {
      chaptersRead: 15847,
      timeSpentReading: '146 hrs',
      readingStreak: 127,
      booksRead: 234,
      averageRatingGiven: 4.2,
    },
    authorStats: {
      seriesPublished: 12,
      totalWordsWritten: 222608,
      totalPageviews: 218959,
      reviewsReceived: 89,
      readersReached: 1057,
      followers: 2847,
    },
    engagementStats: {
      commentsMade: 1247,
      forumPosts: 89,
      reviewsWritten: 156,
      bookmarksCreated: 89,
      subscriptions: 234,
    },
    publishedWorks: [
      {
        id: 1,
        title: 'Nine Realms Ascension',
        description: "A young cultivator's journey through the nine realms of existence, facing trials that will determine the fate of all worlds.",
        cover: '/placeholder.svg?height=120&width=90',
        status: 'Ongoing',
        chapters: 234,
        reads: 450000,
        rating: 4.8,
        lastUpdated: '2 days ago',
        genre: 'Cultivation',
      },
      {
        id: 2,
        title: 'Shadow Monarch Chronicles',
        description: 'In a world where shadows hold power, one man must master the darkness to save the light.',
        cover: '/placeholder.svg?height=120&width=90',
        status: 'Completed',
        chapters: 156,
        reads: 320000,
        rating: 4.6,
        lastUpdated: '1 month ago',
        genre: 'Fantasy',
      },
      {
        id: 3,
        title: 'Immortal Sword Path',
        description: 'The path of the sword is endless, but for those who persist, immortality awaits.',
        cover: '/placeholder.svg?height=120&width=90',
        status: 'Ongoing',
        chapters: 89,
        reads: 180000,
        rating: 4.9,
        lastUpdated: '1 week ago',
        genre: 'Cultivation',
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: 'review',
        action: 'Posted a review for',
        target: 'Reverend Insanity',
        rating: 5.0,
        timeAgo: '3 days ago',
      },
      {
        id: 2,
        type: 'review',
        action: 'Reviewed',
        target: 'Lord of the Mysteries',
        rating: 4.8,
        timeAgo: '1 week ago',
      },
      {
        id: 3,
        type: 'review',
        action: 'Left a review on',
        target: 'Shadow Slave',
        rating: 4.9,
        timeAgo: '2 weeks ago',
      },
    ],
    collections: [
      {
        id: 1,
        name: 'Cultivation Favorites',
        description: "A collection of the best cultivation novels I've read.",
        coverImages: [
          '/placeholder.svg?height=64&width=48',
          '/placeholder.svg?height=64&width=48',
          '/placeholder.svg?height=64&width=48',
        ],
        novelCount: 12,
        followers: 320,
      },
      {
        id: 2,
        name: 'Fantasy Epics',
        description: 'Epic fantasy stories with deep world-building.',
        coverImages: [
          '/placeholder.svg?height=64&width=48',
          '/placeholder.svg?height=64&width=48',
          '/placeholder.svg?height=64&width=48',
        ],
        novelCount: 8,
        followers: 210,
      },
    ],
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-24" style={{ backgroundColor: '#131A2A' }}>
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40rem] -left-[20rem] w-[50rem] h-[50rem] bg-purple-900/12 rounded-full blur-[12rem]" />
        <div className="absolute -top-[30rem] -right-[20rem] w-[50rem] h-[50rem] bg-violet-900/12 rounded-full blur-[12rem]" />
      </div>

      <Header />

      {/* Profile Section */}
      <section className="px-4 py-6 sm:py-8 relative z-10">
        <ProfileHeader
          profile={{
            avatar: publicProfile.avatar,
            displayName: publicProfile.displayName,
            username: publicProfile.username,
            bio: publicProfile.bio,
            joinDate: publicProfile.joinDate,
            location: publicProfile.location,
            isVerified: publicProfile.isVerified,
            isAuthor: publicProfile.isAuthor,
          }}
          isFollowing={isFollowing}
          onFollowToggle={() => setIsFollowing(!isFollowing)}
        />
        <ProfileInfoBlock
          displayName={publicProfile.displayName}
          username={publicProfile.username}
          bio={publicProfile.bio}
          joinDate={publicProfile.joinDate}
          location={publicProfile.location}
          isVerified={publicProfile.isVerified}
        />
  
        <VanityStatsRow
          followers={publicProfile.vanityStats.followers}
          following={publicProfile.vanityStats.following}
          publishedWorks={publicProfile.vanityStats.publishedWorks}
          totalReads={publicProfile.vanityStats.totalReads}
          averageRating={publicProfile.vanityStats.averageRating}
          formatNumber={formatNumber}
        />
      </section>

      {/* Tabs & Content */}
      <section className="px-4 pb-8 relative z-10">
        <ProfileTabs tabs={profileTabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'Profile Stats' && (
          <>
            <ProfileStatsSection
              readingStats={publicProfile.readingStats}
              authorStats={publicProfile.authorStats}
              engagementStats={publicProfile.engagementStats}
              isAuthor={publicProfile.isAuthor}
              formatNumber={formatNumber}
            />
            <UserSnapshot
              lastActive="5 mins ago"
              memberSince="Since 2022"
              location={publicProfile.location}
              favoriteNovel="Reverend Insanity"
              bio={publicProfile.bio}
            />
          </>
        )}

        {activeTab === 'Works' && (
          <PublishedWorks works={publicProfile.publishedWorks} formatNumber={formatNumber} />
        )}

        {activeTab === 'Collections' && (
          <CollectionsGrid collections={publicProfile.collections} />
        )}

        {activeTab === 'Activity' && (
          <ActivityFeed recentActivity={publicProfile.recentActivity} />
        )}
      </section>

      <BottomNav />
    </div>
  );
}
