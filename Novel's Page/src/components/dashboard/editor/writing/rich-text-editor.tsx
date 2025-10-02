'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const TinyMCEEditor = dynamic(() => import('./tinymce-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  ),
});

interface RichTextEditorProps {
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

export function RichTextEditor({
  value,
  initialContent = '',
  onContentChange,
  onSave,
  autoSave = true,
  autoSaveInterval = 30000,
  placeholder = 'Start writing your chapter...',
  height = 600,
  width = '100%',
  readOnly = false,
  chapterTitle = 'Chapter',
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState(initialContent);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!autoSave || readOnly || !isInitialized) return;
    if (!content || content === initialContent) return;
    const t = setTimeout(() => {
      handleAutoSave();
    }, autoSaveInterval);
    return () => clearTimeout(t);
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
    if (!onSave || readOnly || !editorRef.current) return;
    const currentContent = editorRef.current.getContent();
    try {
      await onSave(currentContent);
    } catch (e) {
      console.error('Manual save failed:', e);
    }
  };

  const handleEditorChange = (newContent: string) => {
    if (newContent === content) return;
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const editorConfig = useMemo(
    () => ({
      directionality: 'ltr',
      branding: false,
      readonly: readOnly,
      placeholder,
      autosave_ask_before_unload: false,
      autosave_interval: '30s',
      autosave_retention: '5m',
      setup: (editor: any) => {
        editor.on('init', () => {
          if (!readOnly) setTimeout(() => editor.focus(), 100);
        });
        editor.addShortcut('ctrl+s', 'Save Chapter', () => {
          handleManualSave();
        });
      },
    }),
    [readOnly, placeholder]
  );

  // Controlled value mode
  return (
    <TinyMCEEditor
      value={value !== undefined ? value : content}
      initialValue={value === undefined ? initialContent : undefined}
      height={height}
      width={width}
      onInit={(evt: any, editor: any) => {
        editorRef.current = editor;
        setIsInitialized(true);
        editor.on('editorSaveRequest', () => {
          handleManualSave();
        });
      }}
      onEditorChange={handleEditorChange}
      disabled={readOnly}
      init={editorConfig}
    />
  );
}
