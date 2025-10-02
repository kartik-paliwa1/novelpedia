"use client"

import React, { useState } from 'react';
import ChapterReader from '@/components/novel/chapter-reader';
import { Project, Chapter } from '@/types/editor';

// Mock data for demonstration
const novels: Project[] = [
  {
    id: 1,
    slug: 'the-lost-realm',
    title: 'The Lost Realm',
    lastChapter: 'Prologue',
    lastEdited: '2025-09-10',
    wordCount: 45000,
    status: 'Draft',
    genre: 'Fantasy',
    chapters: 12,
    words: 45000,
    views: 1200,
    collections: 100,
    rating: 4.5,
    lastUpdated: '2025-09-11',
    cover: '',
    description: 'An epic fantasy adventure.',
    tags: ['adventure', 'magic'],
    progress: 80,
  },
  {
    id: 2,
    slug: 'city-of-glass',
    title: 'City of Glass',
    lastChapter: 'Chapter 20',
    lastEdited: '2025-09-09',
    wordCount: 80000,
    status: 'Completed',
    genre: 'Dystopian',
    chapters: 20,
    words: 80000,
    views: 3000,
    collections: 250,
    rating: 4.8,
    lastUpdated: '2025-09-10',
    cover: '',
    description: 'A dystopian thriller.',
    tags: ['thriller', 'future'],
    progress: 100,
  },
];

const chapters: Chapter[] = [
  { id: 101, title: 'Prologue', content: 'In the beginning...', order: 1, wordCount: 500, publishedAt: '2025-09-11', status: 'completed' },
  { id: 102, title: 'Chapter 1', content: 'The journey starts...', order: 2, wordCount: 1200, publishedAt: '2025-09-12', status: 'draft' },
];

export default function NovelPage() {
  const [selectedNovel, setSelectedNovel] = useState<Project | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  if (selectedChapter && selectedNovel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600 p-8 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-l from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-30"></div>
          <div className="absolute left-0 top-1/2 w-1/4 h-24 bg-gradient-to-b from-purple-400 to-transparent blur-2xl opacity-20"></div>
        </div>
        <button
          onClick={() => setSelectedChapter(null)}
          className="mb-6 px-4 py-2 bg-fuchsia-700 text-white rounded shadow hover:bg-fuchsia-800 transition font-bold"
        >
          ← Back to Chapters
        </button>
        <div className="w-full max-w-2xl">
          <ChapterReader
            chapter={selectedChapter}
            mode="reader"
          />
        </div>
      </div>
    );
  }

  if (selectedNovel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600 p-8 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-l from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-30"></div>
          <div className="absolute left-0 top-1/2 w-1/4 h-24 bg-gradient-to-b from-purple-400 to-transparent blur-2xl opacity-20"></div>
        </div>
        <button
          onClick={() => setSelectedNovel(null)}
          className="mb-6 px-4 py-2 bg-fuchsia-700 text-white rounded shadow hover:bg-fuchsia-800 transition font-bold"
        >
          ← Back to Novels
        </button>
        <div className="w-full max-w-2xl bg-gradient-to-br from-purple-800 via-fuchsia-700 to-indigo-900 rounded-2xl shadow-2xl p-8 border-2 border-fuchsia-400">
          <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg font-serif">{selectedNovel.title}</h2>
          <p className="text-white/90 italic mb-6 font-light">{selectedNovel.description}</p>
          <h3 className="text-xl font-bold text-fuchsia-200 mb-4">Chapters</h3>
          <ul className="space-y-3">
            {chapters.map(ch => (
              <li key={ch.id}>
                <button
                  onClick={() => setSelectedChapter(ch)}
                  className="w-full text-left px-4 py-2 rounded bg-fuchsia-700 bg-opacity-80 text-white font-semibold shadow hover:bg-fuchsia-800 transition border border-fuchsia-400"
                >
                  {ch.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600 p-8 flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-l from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-30"></div>
        <div className="absolute left-0 top-1/2 w-1/4 h-24 bg-gradient-to-b from-purple-400 to-transparent blur-2xl opacity-20"></div>
      </div>
      <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-xl tracking-wide font-serif">Fantasy Novels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {novels.map(novel => (
          <div
            key={novel.id}
            className="bg-gradient-to-br from-purple-700 via-fuchsia-700 to-indigo-800 border-2 border-fuchsia-400 rounded-2xl p-6 shadow-2xl cursor-pointer hover:scale-105 hover:shadow-fuchsia-500/40 transition flex flex-col justify-between relative"
            onClick={() => setSelectedNovel(novel)}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-fuchsia-400 rounded-full blur-2xl opacity-30"></div>
            <h2 className="text-2xl font-extrabold text-white mb-2 drop-shadow-lg font-serif">{novel.title}</h2>
            <p className="text-white/90 mb-4 italic font-light">{novel.description}</p>
            <span className="text-xs font-semibold text-fuchsia-200 bg-fuchsia-700 bg-opacity-60 px-2 py-1 rounded-full shadow">Status: {novel.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
