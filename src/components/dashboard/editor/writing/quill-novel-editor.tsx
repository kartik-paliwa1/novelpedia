'use client';

import { useRef, useEffect, useState, useMemo, type ComponentType } from 'react';
import dynamic from 'next/dynamic';

type QuillContentSnapshot = {
  html: string;
  delta: unknown;
  images: string[];
};

type QuillNovelWrapperProps = {
  value?: string;
  initialValue?: string;
  height?: number | string;
  width?: number | string;
  onEditorChange?: (snapshot: QuillContentSnapshot) => void;
  onInit?: (quill: any) => void;
  init?: Record<string, any>;
  disabled?: boolean;
};

// Dynamically import Quill to avoid SSR issues
const QuillNovelWrapper = dynamic(() => import('@/components/dashboard/editor/writing/quill-novel-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border border-border bg-card transition-colors">
      <div className="text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading novel editor...</p>
      </div>
    </div>
  ),
}) as ComponentType<QuillNovelWrapperProps>;

export type { QuillContentSnapshot };

interface QuillNovelEditorProps {
  value?: string;
  initialContent?: string;
  onContentChange?: (snapshot: QuillContentSnapshot) => void;
  onSave?: (snapshot: QuillContentSnapshot) => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
  placeholder?: string;
  height?: number | string;
  width?: number | string;
  readOnly?: boolean;
}

export function QuillNovelEditor({
  value,
  initialContent = '',
  onContentChange,
  onSave,
  autoSave = true,
  autoSaveInterval = 1000,
  placeholder = 'Begin your story...',
  height = 600,
  width = '100%',
  readOnly = false,
}: QuillNovelEditorProps) {
  const editorRef = useRef<any>(null);
  const latestSnapshotRef = useRef<QuillContentSnapshot>({ html: initialContent, delta: null, images: [] });
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
    if (!onSave || readOnly) return;
    try {
      await onSave(latestSnapshotRef.current);
    } catch (e) {
      console.error('Auto-save failed:', e);
    }
  };

  const handleManualSave = async () => {
    if (!onSave || readOnly) return;
    try {
      await onSave(latestSnapshotRef.current);
    } catch (e) {
      console.error('Manual save failed:', e);
    }
  };

  const handleEditorChange = (snapshot: QuillContentSnapshot) => {
    setContent(snapshot.html);
    latestSnapshotRef.current = snapshot;
    onContentChange?.(snapshot);
  };

  // Listen for manual save requests (Ctrl+S)
  useEffect(() => {
    const listener = () => handleManualSave();
    window.addEventListener('editorSaveRequest', listener);
    return () => window.removeEventListener('editorSaveRequest', listener);
  }, [handleManualSave]);

  const editorConfig = useMemo(() => ({ 
    placeholder
  }), [placeholder]);

  return (
    <QuillNovelWrapper
      value={undefined}
      initialValue={value !== undefined ? value : initialContent}
      height={height}
      width={width}
      onInit={(quillInstance: any) => {
        editorRef.current = quillInstance;
        latestSnapshotRef.current = {
          html: quillInstance.root?.innerHTML ?? initialContent,
          delta: quillInstance.getContents?.() ?? null,
          images: Array.from(quillInstance.root?.querySelectorAll?.('img') ?? []).map((img: HTMLImageElement) => img.getAttribute('src') || ''),
        };
        setIsInitialized(true);
      }}
      onEditorChange={handleEditorChange}
      disabled={readOnly}
      init={editorConfig}
    />
  );
}