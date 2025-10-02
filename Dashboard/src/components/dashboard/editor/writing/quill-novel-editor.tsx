'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Quill to avoid SSR issues
const QuillNovelWrapper = dynamic(() => import('./quill-novel-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-slate-900 rounded-lg border border-slate-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
        <p className="text-slate-300">Loading novel editor...</p>
      </div>
    </div>
  ),
});

interface QuillNovelEditorProps {
  value?: string;
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
  placeholder?: string;
  height?: number;
  width?: number | string;
  readOnly?: boolean;
  chapterTitle?: string;
}

export function QuillNovelEditor({
  value,
  initialContent = '',
  onContentChange,
  onSave,
  autoSave = true,
  autoSaveInterval = 30000,
  placeholder = 'Begin your story...',
  height = 600,
  width = '100%',
  readOnly = false,
  chapterTitle = 'Chapter',
}: QuillNovelEditorProps) {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState(initialContent);
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || readOnly || !isInitialized) return;
    if (!content || content === initialContent) return;
    
    const timer = setTimeout(() => {
      handleAutoSave();
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [content, autoSave, autoSaveInterval, readOnly, isInitialized, initialContent]);

  const handleAutoSave = async () => {
    if (!onSave || readOnly || !content) return;
    try {
      await onSave(content);
    } catch (e) {
      console.error('Auto-save failed:', e);
    }
  };

  const handleManualSave = async () => {
    if (!onSave || readOnly) return;
    const currentContent = value !== undefined ? value : content;
    try {
      await onSave(currentContent || '');
    } catch (e) {
      console.error('Manual save failed:', e);
    }
  };

  const handleEditorChange = (newContent: string) => {
    if (newContent === content) return;
    setContent(newContent);
    onContentChange?.(newContent);
  };

  // Listen for manual save requests (Ctrl+S)
  useEffect(() => {
    const listener = () => handleManualSave();
    window.addEventListener('editorSaveRequest', listener);
    return () => window.removeEventListener('editorSaveRequest', listener);
  }, [handleManualSave]);

  const editorConfig = useMemo(() => ({ 
    placeholder,
    chapterTitle 
  }), [placeholder, chapterTitle]);

  return (
    <QuillNovelWrapper
      value={value !== undefined ? value : content}
      initialValue={value === undefined ? initialContent : undefined}
      height={height}
      width={width}
      onInit={(evt: any, editor: any) => {
        editorRef.current = editor;
        setIsInitialized(true);
      }}
      onEditorChange={handleEditorChange}
      disabled={readOnly}
      init={editorConfig}
    />
  );
}