import React from 'react';
import ChapterReader from '@/components/novel/chapter-reader';
// import your actual data fetching logic here

export default function ChapterPage({ params }: { params: { novelslug: string; chapterslug: string } }) {
  // Replace with actual data fetching
  const chapter = {
    id: 1,
    title: decodeURIComponent(params.chapterslug.replace(/-/g, ' ')),
    wordCount: 1200,
    publishedAt: '2025-09-11',
  status: "completed" as const,
    order: 1,
    content: 'Chapter content goes here.',
  };

  return (
    <div className="p-6">
      <ChapterReader chapter={chapter} mode="reader" />
    </div>
  );
}
