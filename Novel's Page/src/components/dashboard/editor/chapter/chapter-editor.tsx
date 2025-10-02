'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Settings, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import { Badge } from '@/components/dashboard/ui/badge';
import { RichTextEditor } from '@/components/dashboard/editor/writing/rich-text-editor';
import { AuthorWorkflowGuide } from '@/components/dashboard/editor/guides/author-workflow-guide';
import { Chapter, Project } from '@/types/editor';
import { cn } from '@/lib/utils';

interface ChapterEditorProps {
  chapter: Chapter;
  novel: Project;
  onBack: () => void;
  onSave: (updatedChapter: Chapter) => void;
  previewMode: 'editor' | 'reader';
}

export function ChapterEditor({
  chapter,
  novel,
  onBack,
  onSave,
  previewMode
}: ChapterEditorProps) {
  const [chapterData, setChapterData] = useState(chapter);
  const [content, setContent] = useState(chapter.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const [editorHeight, setEditorHeight] = useState(600);

  // Calculate optimal editor height
  useEffect(() => {
    const updateEditorHeight = () => {
      if (typeof window !== 'undefined') {
        // Viewport height minus header (64px) minus padding/margins (96px) 
        const optimalHeight = window.innerHeight - 160;
        const finalHeight = Math.max(optimalHeight, 400); // Minimum 400px
        console.log('Updating editor height:', finalHeight, 'viewport:', window.innerHeight);
        setEditorHeight(finalHeight);
      }
    };

    updateEditorHeight();
    window.addEventListener('resize', updateEditorHeight);
    return () => window.removeEventListener('resize', updateEditorHeight);
  }, []);

  useEffect(() => {
    // Load chapter content with helpful placeholder
    const defaultContent = chapter.content || `<h1>Chapter ${chapter.order}: ${chapter.title}</h1>
<p><em>Welcome to your chapter editor! Here are some quick tips:</em></p>
<ul>
  <li>🖊️ Start writing your story - your work auto-saves every 30 seconds</li>
  <li>💾 Use Ctrl+S for manual save anytime</li>
  <li>🎯 Focus Mode hides all distractions (toggle with the eye icon)</li>
  <li>📖 Switch to Reader Mode to see how readers will experience your chapter</li>
</ul>
<p>Ready to begin your story? Just start typing below...</p>`;
    
    setContent(defaultContent);
    
    // Show workflow guide for new chapters (no content)
    if (!chapter.content || chapter.wordCount === 0) {
      setShowWorkflowGuide(true);
    }
  }, [chapter]);

  const handleSave = async (newContent?: string, showNotification = true) => {
    setIsSaving(true);
    try {
      const contentToSave = newContent || content;
      
      // Calculate word count from content
      const textContent = contentToSave.replace(/<[^>]*>/g, ''); // Strip HTML
      const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
      
      const updatedChapter: Chapter = {
        ...chapterData,
        content: contentToSave,
        wordCount,
        publishedAt: new Date().toISOString(),
        status: wordCount > 100 ? 'completed' : 'draft' // Consider completed if more than 100 words
      };
      
      await onSave(updatedChapter);
      setChapterData(updatedChapter);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      if (showNotification) {
        setSaveNotification('Chapter saved successfully!');
        setTimeout(() => setSaveNotification(null), 3000);
      }
    } catch (error) {
      console.error('Failed to save chapter:', error);
      setSaveNotification('Failed to save chapter. Please try again.');
      setTimeout(() => setSaveNotification(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setChapterData(prev => ({ ...prev, title: newTitle }));
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  };

  // Auto-save wrapper that doesn't show notifications
  const handleAutoSave = (newContent: string) => {
    return handleSave(newContent, false);
  };

  const getStatusInfo = () => {
    if (chapterData.wordCount === 0) {
      return { 
        icon: AlertCircle, 
        color: 'text-amber-500', 
        bgColor: 'bg-amber-50', 
        text: 'Start Writing', 
        description: 'Your chapter is empty - begin writing to save progress' 
      };
    } else if (chapterData.wordCount < 100) {
      return { 
        icon: Clock, 
        color: 'text-blue-500', 
        bgColor: 'bg-blue-50', 
        text: 'In Progress', 
        description: `${chapterData.wordCount} words - keep writing to complete` 
      };
    } else {
      return { 
        icon: CheckCircle, 
        color: 'text-green-500', 
        bgColor: 'bg-green-50', 
        text: 'Completed', 
        description: `${chapterData.wordCount} words - chapter is ready for readers` 
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header (no longer sticky) */}
      <div className="z-40 bg-background/95 backdrop-blur-sm border-b-2 border-gray-300 dark:border-gray-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Navigation and Info */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-foreground">{novel.title}</h1>
                  <p className="text-xs text-muted-foreground">Chapter {chapter.order}</p>
                </div>

                {/* Chapter Title - Inline editing in editor mode */}
                <div className="flex items-center gap-2">
                  {previewMode === 'editor' ? (
                    <Input
                      value={chapterData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Chapter title..."
                      className="font-medium border-none bg-transparent focus:bg-muted/50 px-3 py-2 h-9 max-w-xs text-base"
                    />
                  ) : (
                    <span className="font-medium text-foreground text-base px-3">{chapterData.title}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Save Notification */}
              {saveNotification && (
                <div className={cn(
                  "text-sm px-3 py-1 rounded-full border",
                  saveNotification.includes('success') 
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                )}>
                  {saveNotification}
                </div>
              )}

              {/* Word Count Badge */}
              <Badge variant="outline" className="bg-background">
                {chapterData.wordCount} words
              </Badge>

              {/* Last Saved */}
              {lastSaved && (
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}

              {/* Manual Save - Only in editor mode */}
              {previewMode === 'editor' && (
                <Button
                  onClick={() => handleSave()}
                  disabled={isSaving || !hasUnsavedChanges}
                  size="sm"
                  className={cn(
                    "gap-2",
                    hasUnsavedChanges ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
                  )}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flex grow to fit content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Workflow Guide - Show for new chapters */}
        {showWorkflowGuide && previewMode === 'editor' && (
          <AuthorWorkflowGuide
            variant="new-chapter"
            onDismiss={() => setShowWorkflowGuide(false)}
          />
        )}

        {/* Rich Text Editor - Take calculated height */}
        <div style={{ height: `${editorHeight}px` }}>
          <RichTextEditor
            initialContent={content}
            onContentChange={handleContentChange}
            onSave={handleAutoSave}
            autoSave={true}
            autoSaveInterval={30000}
            height={editorHeight}
            readOnly={previewMode === 'reader'}
            chapterTitle=""
          />
        </div>
      </div>
    </div>
  );
}
