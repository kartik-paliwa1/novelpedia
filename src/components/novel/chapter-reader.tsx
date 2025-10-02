import React from 'react';
import { Chapter } from '@/types/editor';

interface ChapterReaderProps {
  chapter: Chapter;
  chapterNumber?: number; // Display number based on order position
  mode: 'editor' | 'reader';
  onModeChange?: (mode: 'editor' | 'reader') => void;
}

const ChapterReader: React.FC<ChapterReaderProps> = ({ chapter, chapterNumber, mode, onModeChange }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded text-black shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{chapter.title}</h2>
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${mode === 'editor' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
          {mode === 'editor' ? 'Editing' : 'Reading'}
        </span>
      </div>
      <div className="mb-4">
        <span className="inline-flex items-center gap-2 text-sm text-gray-600">
          <svg width="16" height="16" fill="currentColor" className="inline-block"><circle cx="8" cy="8" r="7" stroke="gray" strokeWidth="2" fill="none" /><text x="8" y="12" textAnchor="middle" fontSize="10" fill="gray">C</text></svg>
          {`Chapter ${chapterNumber ?? chapter.order + 1}`}
        </span>
      </div>
      <div className={mode === 'reader' ? 'prose prose-lg' : 'border p-4'}>
        {chapter.content}
      </div>
      {onModeChange && (
        <div className="mt-6 flex gap-2">
          <button
            className={`px-4 py-2 rounded ${mode === 'editor' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => onModeChange('editor')}
          >
            Editor Mode
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'reader' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => onModeChange('reader')}
          >
            Reader Mode
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterReader;
