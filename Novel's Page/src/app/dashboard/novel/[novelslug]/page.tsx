import React from 'react';
// import your actual data fetching logic here
// import UnifiedNovelCard from '@/components/novel/unified-novel-card';
// import EditorChapterManager from '@/components/novel/editor-chapter-manager';
// import StatusBadge from '@/components/ui/status-badge';

export default function NovelDetailPage({ params }: { params: { novelslug: string } }) {
  // Replace with actual data fetching
  const novel = {
    title: decodeURIComponent(params.novelslug),
    status: 'Draft',
    description: 'Novel description here.',
    chapters: [
      { id: 'chapter-1', title: 'Prologue' },
      { id: 'chapter-2', title: 'Chapter 1' },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
      {/* <StatusBadge status={novel.status} /> */}
      <p className="mb-4">{novel.description}</p>
      <h2 className="text-xl font-semibold mb-2">Chapters</h2>
      <ul>
        {novel.chapters.map(ch => (
          <li key={ch.id}>
            <a
              href={`/dashboard/novel/${params.novelslug}/${ch.id}`}
              className="underline text-blue-600"
            >
              {ch.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
