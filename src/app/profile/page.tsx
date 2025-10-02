'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/services/api';
import { clearAuthTokens, isLoggedIn } from '@/utils/auth';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  dob: string;
  gender: string;
  role: string;
  time_read: number;
  user_status: string;
  books_read: number;
  followers_count: number;
  profile_likes: number;
  bio: string;
  imageURI: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const authenticated = await isLoggedIn();
      if (!authenticated) {
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await api.getProfile();
        const data = response.data as Partial<UserProfile> | null;
        if (data) {
          setUser({
            id: data.id ?? 0,
            name: data.name ?? 'Unknown',
            email: data.email ?? '',
            dob: data.dob ?? '',
            gender: data.gender ?? '',
            role: data.role ?? '',
            time_read: data.time_read ?? 0,
            user_status: data.user_status ?? '',
            books_read: data.books_read ?? 0,
            followers_count: data.followers_count ?? 0,
            profile_likes: data.profile_likes ?? 0,
            bio: data.bio ?? '',
            imageURI: data.imageURI ?? '',
          });
        }
      } catch (error) {
        const message = error instanceof ApiError ? error.message : (error as Error)?.message;
        console.error('Failed to load profile', message);
        clearAuthTokens();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <div className="text-white">Loading profile...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9] py-10">
      <div className="bg-[#231942]/80 rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col items-center">
        <img
          src={user?.imageURI || 'https://www.freepik.com/free-psd/contact-icon-illustration-isolated_397057724.htm#fromView=keyword&page=1&position=1&uuid=fc50f9db-af0f-49e6-b5df-a3c621a5a64a&query=Default+User'}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-violet-500"
        />
        <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
        <p className="text-violet-200 mb-2">{user.email}</p>
        <p className="text-violet-200 mb-2">{user.bio || 'No bio yet.'}</p>
        <div className="grid grid-cols-2 gap-4 mt-4 text-violet-300 text-sm">
          <div>
            <span className="font-semibold">Role:</span> {user.role}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {user.user_status}
          </div>
          <div>
            <span className="font-semibold">Books Read:</span> {user.books_read}
          </div>
          <div>
            <span className="font-semibold">Followers:</span> {user.followers_count}
          </div>
          <div>
            <span className="font-semibold">Profile Likes:</span> {user.profile_likes}
          </div>
          <div>
            <span className="font-semibold">Time Read:</span> {user.time_read} min
          </div>
        </div>
        <div className="mt-6 text-violet-200">
          <span className="font-semibold">Gender:</span> {user.gender} <br />
          <span className="font-semibold">DOB:</span> {user.dob}
        </div>
      </div>
    </div>
  );
}
