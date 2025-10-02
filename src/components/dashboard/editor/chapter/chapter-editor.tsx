
'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import { QuillNovelEditor, type QuillContentSnapshot } from '@/components/dashboard/editor/writing/quill-novel-editor';
import type { Chapter } from '@/types/editor';

interface ChapterEditorProps {
  chapter: Chapter;
  onSave: (updatedChapter: Chapter) => Promise<Chapter | void> | Chapter | void;
  onUpdateChapterTitle?: (title: string) => Promise<void> | void;
  onBack?: () => void;
}

const AUTO_SAVE_INTERVAL = 1_000;
const MAX_TITLE_LENGTH = 50;

export function ChapterEditor({
  chapter,
  onSave,
  onUpdateChapterTitle,
  onBack,
}: ChapterEditorProps) {
  const [content, setContent] = useState(chapter.content ?? '');
  const contentSnapshotRef = useRef<QuillContentSnapshot>({
    html: chapter.content ?? '',
    delta: chapter.contentDelta ?? null,
    images: chapter.images ?? [],
  });
  const [status, setStatus] = useState<Chapter['status']>(chapter.status);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [editorHeight, setEditorHeight] = useState(() => {
    if (typeof window === 'undefined') {
      return 720;
    }
    return Math.max(window.innerHeight - 200, 480);
  });
  const toolbarOffset = 96;
  const [chapterTitleInput, setChapterTitleInput] = useState(() => (chapter.title ?? '').slice(0, MAX_TITLE_LENGTH));
  const [isUpdatingChapterTitle, setIsUpdatingChapterTitle] = useState(false);

  useEffect(() => {
    setContent(chapter.content ?? '');
    contentSnapshotRef.current = {
      html: chapter.content ?? '',
      delta: chapter.contentDelta ?? null,
      images: chapter.images ?? [],
    };
    setStatus(chapter.status);
    setHasUnsavedChanges(false);
    setLastSaved(null);
    setChapterTitleInput((chapter.title ?? '').slice(0, MAX_TITLE_LENGTH));
  }, [chapter.id, chapter.content, chapter.title]);

  useEffect(() => {
    const updateHeight = () => {
      if (typeof window === 'undefined') {
        return;
      }
      const desired = window.innerHeight - 200;
      setEditorHeight(Math.max(desired, 500));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const wordCount = useMemo(() => computeWordCount(content), [content]);

  const persistChapter = useCallback(async () => {
    if (!hasUnsavedChanges || isSaving) {
      return;
    }

  const snapshot = contentSnapshotRef.current;
  const imageSources = snapshot.images ?? [];
  const firstImage = imageSources[0] ?? null;

    if (imageSources.length > 1) {
      window.alert('Only one image can be included in a chapter. Please remove additional images before saving.');
      return;
    }

    const TEN_MB = 10 * 1024 * 1024;
    const oversizedImage = imageSources.find((src) => {
      if (!src?.startsWith('data:image')) {
        return false;
      }
      const base64 = src.split(',')[1] ?? '';
      const sizeInBytes = Math.ceil((base64.length * 3) / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
      return sizeInBytes > TEN_MB;
    });

    if (oversizedImage) {
      window.alert('Images must be 10MB or smaller. Please compress or replace the image before saving.');
      return;
    }

    const nextWordCount = wordCount;

    setIsSaving(true);
    try {
      const updated: Chapter = {
        ...chapter,
        content: snapshot.html,
        contentDelta: snapshot.delta,
        images: snapshot.images,
        heroImageUrl: firstImage && !firstImage.startsWith('data:image') ? firstImage : null,
        title: chapterTitleInput.trim().slice(0, MAX_TITLE_LENGTH),
        wordCount: nextWordCount,
        status,
      };

      const persistedChapter = await onSave(updated);
      if (persistedChapter) {
        setContent(persistedChapter.content ?? '');
        contentSnapshotRef.current = {
          html: persistedChapter.content ?? '',
          delta: persistedChapter.contentDelta ?? null,
          images: persistedChapter.images ?? [],
        };
        setStatus(persistedChapter.status);
      }
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save chapter:', error);
    } finally {
      setIsSaving(false);
    }
  }, [chapter, content, chapterTitleInput, hasUnsavedChanges, isSaving, onSave, wordCount]);

  const handleContentChange = (snapshot: QuillContentSnapshot) => {
    setContent(snapshot.html);
    contentSnapshotRef.current = snapshot;
    setHasUnsavedChanges(true);
  };

  const statusLabel = isSaving
    ? 'Saving...'
    : hasUnsavedChanges
    ? 'Unsaved changes'
    : lastSaved
    ? `Auto-saved ${formatRelativeTime(lastSaved)}`
    : 'Auto-saved just now';

  const handleBackClick = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, [onBack]);

  const handleChapterTitleSubmit = useCallback(async () => {
    if (!onUpdateChapterTitle) {
      return;
    }

    const trimmed = chapterTitleInput.trim().slice(0, MAX_TITLE_LENGTH);
    if (trimmed === (chapter.title ?? '')) {
      return;
    }

    setIsUpdatingChapterTitle(true);
    try {
      await onUpdateChapterTitle(trimmed);
      setChapterTitleInput(trimmed);
    } catch (error) {
      console.error('Failed to update chapter title:', error);
      setChapterTitleInput((chapter.title ?? '').slice(0, MAX_TITLE_LENGTH));
    } finally {
      setIsUpdatingChapterTitle(false);
    }
  }, [chapter.title, chapterTitleInput, onUpdateChapterTitle]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-6 border-b border-border bg-background px-8 py-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-colors dark:shadow-[0_20px_60px_rgba(5,8,22,0.55)]">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>{statusLabel}</span>
          <Input
            value={chapterTitleInput}
            onChange={(event) => setChapterTitleInput(event.target.value.slice(0, MAX_TITLE_LENGTH))}
            onBlur={() => {
              void handleChapterTitleSubmit();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleChapterTitleSubmit();
              }
            }}
            disabled={!onUpdateChapterTitle || isUpdatingChapterTitle}
            maxLength={MAX_TITLE_LENGTH}
            className="w-64 border-border bg-transparent text-sm font-medium text-foreground shadow-none transition-colors focus-visible:border-primary focus-visible:ring-primary/40"
            placeholder="Chapter title"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{wordCount} words</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
          <Button
            onClick={persistChapter}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40 disabled:text-primary-foreground/70"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
          </Button>
        </div>
      </header>

      <main
        className="flex-1 px-12 pb-24 pt-10"
        style={{ '--novel-toolbar-offset': `${toolbarOffset}px` } as CSSProperties}
      >
        <div className="flex w-full flex-col">
          <QuillNovelEditor
            value={content}
            onContentChange={handleContentChange}
            onSave={(snapshot) => {
              contentSnapshotRef.current = snapshot;
              setContent(snapshot.html);
              void persistChapter();
            }}
            autoSave
            autoSaveInterval={AUTO_SAVE_INTERVAL}
            height={editorHeight}
            placeholder="Start writing your chapter..."
          />
        </div>
      </main>
    </div>
  );
}

function stripAuthorNotes(html: string): string {
  if (!html) {
    return '';
  }

  if (typeof window !== 'undefined') {
    try {
      const container = document.createElement('div');
      container.innerHTML = html;
      const notes = container.querySelectorAll('.novel-author-note');
      notes.forEach((node) => node.remove());
      return container.innerHTML;
    } catch {
      // fall through to regex fallback
    }
  }

  let result = html;
  const noteDivRegex = /<div[^>]*class="[^"]*novel-author-note[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
  const noteSpanRegex = /<span[^>]*class="[^"]*novel-author-note[^"]*"[^>]*>[\s\S]*?<\/span>/gi;
  result = result.replace(noteDivRegex, '');
  result = result.replace(noteSpanRegex, '');
  return result;
}

function computeWordCount(html: string): number {
  const sanitizedHtml = stripAuthorNotes(html);
  const text = sanitizedHtml
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function formatRelativeTime(value: Date): string {
  const diffMs = Date.now() - value.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}


