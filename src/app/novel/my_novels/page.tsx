'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '@/services/api';
import { Project } from '@/types/editor';
import { clearAuthTokens, isLoggedIn } from '@/utils/auth';

export default function MyNovelsPage() {
  const router = useRouter();
  const [novels, setNovels] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNovels = async () => {
      const authenticated = await isLoggedIn();
      if (!authenticated) {
        clearAuthTokens();
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await api.getMyNovels();
        setNovels(Array.isArray(response.data) ? (response.data as Project[]) : []);
        setError(null);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : (err as Error)?.message || 'Failed to fetch your novels.';
        setError(message);
        if (err instanceof ApiError && err.status === 401) {
          clearAuthTokens();
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadNovels();
  }, [router]);

  if (loading) return <p className="text-white p-4">Loading your novels...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  if (novels.length === 0)
    return <p className="text-white p-4">You don’t have any novels yet. <Link href="/novel/create" className="underline text-indigo-400">Create one now</Link>.</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#2e026d] via-[#15162c] to-[#23004d] text-white">
      <h1 className="text-3xl mb-6 font-semibold">My Novels</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {novels.map((novel) => {
          const href = novel.slug ? `/novel/${novel.slug}` : `/novel/${novel.id}`;
          const updatedAt = novel.lastUpdated || novel.lastEdited;

          return (
            <Link key={novel.id} href={href} className="bg-[#1e1b40] rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-700 transition-shadow">
              <img
                src={novel.cover || '/default-cover.png'}
                alt={novel.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{novel.title}</h2>
                <p className="text-sm line-clamp-3 text-gray-300">{novel.description || 'No synopsis provided.'}</p>
                {updatedAt && (
                  <p className="mt-2 text-xs text-gray-400">{new Date(updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
