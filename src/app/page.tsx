'use client';

// src/app/page.tsx
import React from 'react';

import Header from '@/common/components/Header';
import NavTabs from '@/common/components/NavTabs';
import FeaturedCarousel from '@/common/components/FeaturedCarousel';
import Announcements from '@/common/components/Announcements';
import SectionCarousel from '@/common/components/SectionCarousel';
import GenreBlock from '@/modules/genre_landingpage/components/GenreBlock';
import RecentlyUpdatedBlock from '@/modules/recent-updates/components/Recently_Updated';
import BottomNav from '@/common/components/BottomNav';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { ensureArray } from '@/utils/safe-array';

export default function Home() {
    const [popularBooks, setPopularBooks] = useState<any[]>([]);
    const [latestReleases, setLatestReleases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [popular, latest] = await Promise.all([
                    api.getPopularNovels(),
                    api.getLatestReleases(),
                ]);
                // Handle paginated response format from Django REST Framework
                const popularData = ensureArray(popular.data);
                const latestData = ensureArray(latest.data);
                setPopularBooks(popularData);
                setLatestReleases(latestData);
                setError(null);
            } catch (err) {
                setError("Failed to fetch data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
      <div className="min-h-screen overflow-x-hidden bg-[#131A2A] text-white pb-20">
        <Header />
        <NavTabs />
        <main className="space-y-3 pb-[80px]">
          <FeaturedCarousel />
          <Announcements />
          <SectionCarousel title="Popular This Week" books={popularBooks} />
          <SectionCarousel title="Latest Releases" books={latestReleases} />
          <GenreBlock />
          <RecentlyUpdatedBlock />
        </main>
        <BottomNav />
      </div>
    );
  }