'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/services/api';
import { clearAuthTokens, isLoggedIn } from '@/utils/auth';

import Header from '@/common/components/Header';
import BottomNav from '@/common/components/BottomNav';
import ProfileHeader from '@/modules/profile/components/ProfileHeader';
import ProfileTabs from '@/modules/profile/components/ProfileTabs';
import OverviewTab from '@/modules/profile/components/private/OverviewTab';
import PersonalInfoTab from '@/modules/profile/components/private/PersonalInfoTab';
import MyActivityTab from '@/modules/profile/components/private/MyActivity';
import SettingsTab from '@/modules/profile/components/private/SettingsTab';
import { privateProfile } from '@/data/privateProfileMock';

export default function PrivateProfilePage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(privateProfile.isPrivate);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // State for logged-in user's data
  const [userData, setUserData] = useState<{name: string; bio: string; imageURI: string} | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const authenticated = await isLoggedIn();
      if (!authenticated) {
        clearAuthTokens();
        router.push('/login');
        return;
      }

      try {
        const response = await api.getProfile();
        const data = response.data as { name?: string; bio?: string; imageURI?: string } | null;
        if (data) {
          setUserData({
            name: data.name ?? privateProfile.username,
            bio: data.bio ?? privateProfile.bio,
            imageURI: data.imageURI ?? privateProfile.avatar,
          });
        }
      } catch (error) {
        const message = error instanceof ApiError ? error.message : (error as Error)?.message;
        console.error('Failed to fetch profile information', message);
        clearAuthTokens();
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router]);

  const handleFollowToggle = () => setIsFollowing((prev) => !prev);

  // Prepare profile data for ProfileHeader by replacing username, bio, avatar with userData if available
  const profileHeaderData = {
    ...privateProfile,
    username: userData?.name || privateProfile.username,
    displayName: userData?.name || privateProfile.username,
    bio: userData?.bio || privateProfile.bio,
    avatar: userData?.imageURI || privateProfile.avatar,
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-24" style={{ backgroundColor: '#131A2A' }}>
      {/* Ambient background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40rem] -left-[20rem] w-[50rem] h-[50rem] bg-purple-900/12 rounded-full blur-[12rem]" />
        <div className="absolute -top-[30rem] -right-[20rem] w-[50rem] h-[50rem] bg-violet-900/12 rounded-full blur-[12rem]" />
      </div>

      <Header />

      {/* Profile header (shared across public/private) */}
      <ProfileHeader
        profile={profileHeaderData}
        isOwner={true}
        isEditing={isEditing}
        isPrivate={isPrivate}
        isFollowing={isFollowing}
        setIsEditing={setIsEditing}
        setIsPrivate={setIsPrivate}
        onFollowToggle={handleFollowToggle}
      />

      <section className="px-4 pb-8 relative z-10">
        <ProfileTabs tabs={profileTabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'Overview' && (
          <OverviewTab
            readingGoals={privateProfile.readingGoals}
            stats={privateProfile.authorStats}
          />
        )}

        {activeTab === 'Personal Info' && (
          <PersonalInfoTab
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing(!isEditing)}
            personalInfo={{
              birthday: privateProfile.birthday,
              gender: privateProfile.gender,
              location: privateProfile.location,
              favouriteNovel: privateProfile.favourite_novel,
              bio: userData?.bio || privateProfile.bio,
            }}
          />
        )}

        {activeTab === 'My Activity' && (
          <MyActivityTab
            avatar={profileHeaderData.avatar}
            displayName={profileHeaderData.displayName}
            comments={privateProfile.myComments}
          />
        )}

        {activeTab === 'Settings' && (
          <SettingsTab
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            email={privateProfile.email}
          />
        )}
      </section>

      <BottomNav />
    </div>
  );
}

const profileTabs = ['Overview', 'Personal Info', 'My Activity', 'Settings'];
