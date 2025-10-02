'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';

import type QuillType from 'quill';

// Import Quill CSS
import 'quill/dist/quill.snow.css';

export interface QuillNovelWrapperProps {
  value?: string;
  initialValue?: string;
  height?: number | string;
  width?: string | number;
  onEditorChange?: (payload: {
    html: string;
    delta: unknown;
    images: string[];
  }) => void;
  onInit?: (quill: QuillType) => void;
  init?: Record<string, any>;
  disabled?: boolean;
}

export default function QuillNovelWrapper({
  value,
  initialValue = '',
  height = 400,
  width = '100%',
  onEditorChange,
  onInit,
  init = {},
  disabled = false,
}: QuillNovelWrapperProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const rootElRef = useRef<HTMLElement | null>(null);
  const clickHandlerRef = useRef<((e: Event) => void) | null>(null);
  const textChangeHandlerRef = useRef<((...args: any[]) => void) | null>(null);
  const selectionChangeHandlerRef = useRef<((...args: any[]) => void) | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [hasAuthorNote, setHasAuthorNote] = useState(false);
  const [authorNoteError, setAuthorNoteError] = useState('');
  const AUTHOR_NOTE_MAX_WORDS = 500;

  const countWords = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, []);

  const noteWordCount = useMemo(() => countWords(noteDraft), [noteDraft, countWords]);
  const isNoteTooLong = noteWordCount > AUTHOR_NOTE_MAX_WORDS;

  useEffect(() => {
    if (isNoteTooLong) {
      setAuthorNoteError(`Author's note is limited to ${AUTHOR_NOTE_MAX_WORDS} words. Please shorten it.`);
    } else {
      setAuthorNoteError('');
    }
  }, [isNoteTooLong]);

  const getExistingAuthorNoteText = useCallback((): string => {
    const root: HTMLElement | null = quillRef.current?.root ?? null;
    if (!root) return '';
    const existing = root.querySelector('.novel-author-note') as HTMLElement | null;
    return existing?.textContent?.trim?.() ?? '';
  }, []);

  const openAuthorNoteDialog = useCallback(() => {
    setNoteDraft(getExistingAuthorNoteText());
    setIsNoteDialogOpen(true);
  }, [getExistingAuthorNoteText]);

  const collapseTrailingWhitespace = useCallback((instance?: any) => {
    const q: any = instance ?? quillRef.current;
    if (!q?.getLines) return;

    const lines = q.getLines() as any[];
    let emptyCount = 0;

    for (let i = lines.length - 1; i >= 0; i -= 1) {
      const line = lines[i];
      if (!line) continue;

      const domNode: HTMLElement | null = (line as any).domNode ?? null;
      if (domNode?.classList?.contains?.('novel-author-note')) {
        break;
      }

      const textContent = (domNode?.textContent ?? '').trim();
      const lineLength = typeof line.length === 'function' ? line.length() : 0;

      if (textContent.length === 0 && lineLength <= 1) {
        emptyCount += 1;
        if (emptyCount > 1) {
          const index = q.getIndex?.(line) ?? null;
          if (typeof index === 'number' && lineLength > 0) {
            q.deleteText(index, lineLength, 'silent');
          }
        }
      } else {
        break;
      }
    }
  }, []);

  const getAuthorNoteInfo = useCallback((instance?: any) => {
    const q: any = instance ?? quillRef.current;
    if (!q) return null;

    const root: HTMLElement | null = q.root ?? null;
    if (!root) return null;

    const noteEl = root.querySelector('.novel-author-note') as HTMLElement | null;
    if (!noteEl) return null;

    const blot = q.scroll?.find?.(noteEl);
    if (!blot) return null;

    const noteIndex = q.getIndex?.(blot) ?? null;
    const noteLength = typeof blot.length === 'function' ? blot.length() : 1;
    if (typeof noteIndex !== 'number') return null;

    return { q, root, noteEl, noteIndex, noteLength };
  }, []);

  const removeAllAuthorNotes = useCallback(() => {
    const q: any = quillRef.current;
    const root: HTMLElement | null = q?.root ?? null;
    if (!root || !q) {
      collapseTrailingWhitespace(q);
      return;
    }
    const notes = Array.from(root.querySelectorAll('.novel-author-note')) as HTMLElement[];
    if (notes.length === 0) {
      collapseTrailingWhitespace(q);
      return;
    }
    notes.forEach((el) => {
      try {
        const blot = q.scroll?.find?.(el);
        if (blot) {
          const index = q.getIndex?.(blot) ?? null;
          const length = typeof blot.length === 'function' ? blot.length() : 1;
          if (typeof index === 'number' && length > 0) {
            q.deleteText(index, length, 'silent');
          } else {
            el.remove();
          }
        } else {
          el.remove();
        }
      } catch {
        el.remove();
      }
    });
    collapseTrailingWhitespace(q);
    setHasAuthorNote(false);
  }, [collapseTrailingWhitespace]);

  const enforceAuthorNoteBounds = useCallback((instance?: any) => {
    const info = getAuthorNoteInfo(instance);
    if (!info) {
      collapseTrailingWhitespace(instance);
      return;
    }

    const { q, root, noteEl, noteIndex, noteLength } = info;

    try {
      if (noteEl !== root.lastElementChild) {
        root.appendChild(noteEl);
      }
    } catch {}

    const trailingStart = noteIndex + noteLength + 1;
    const totalLength = q.getLength();
    if (trailingStart < totalLength) {
      const trailing = totalLength - trailingStart;
      if (trailing > 0) {
        q.deleteText(trailingStart, trailing, 'silent');
      }
    }

    collapseTrailingWhitespace(q);

    const selection = q.getSelection?.();
    if (selection && selection.index > noteIndex) {
      q.setSelection(noteIndex, 0, 'silent');
    }
  }, [collapseTrailingWhitespace, getAuthorNoteInfo]);

    const upsertAuthorNoteAtEnd = useCallback((text: string) => {
    const q: any = quillRef.current;
    if (!q) return;

    const rawNote = typeof text === 'string' ? text : '';
    const trimmedNote = rawNote.trim();

    if (trimmedNote) {
      const wordTotal = countWords(trimmedNote);
      if (wordTotal > AUTHOR_NOTE_MAX_WORDS) {
        setAuthorNoteError(`Author's note is limited to ${AUTHOR_NOTE_MAX_WORDS} words. Please shorten it.`);
        setNoteDraft(rawNote);
        setIsNoteDialogOpen(true);
        return;
      }
    }

    removeAllAuthorNotes();

    if (!trimmedNote) {
      collapseTrailingWhitespace(q);
      enforceAuthorNoteBounds(q);
      return;
    }

    collapseTrailingWhitespace(q);

    const insertIndex = Math.max(q.getLength() - 1, 0);
    q.insertEmbed(insertIndex, 'author-note', trimmedNote, 'user');

    enforceAuthorNoteBounds(q);

    q.setSelection(Math.max(q.getLength() - 1, 0), 0, 'silent');

    setHasAuthorNote(true);
  }, [collapseTrailingWhitespace, enforceAuthorNoteBounds, removeAllAuthorNotes, countWords]);

  // Initialize Quill editor
  useEffect(() => {
    if (!editorRef.current) return;
    if (quillRef.current) return;

    const container = editorRef.current;
    if (container) {
      container.innerHTML = '';
    }

    let disposed = false;

    // Dynamic import to avoid SSR issues
  import('quill').then(({ default: Quill }) => {
      if (disposed || !editorRef.current) {
        return;
      }
      const BlockEmbed = Quill.import('blots/block/embed') as any;
      const Inline = Quill.import('blots/inline') as any;
      const Block = Quill.import('blots/block') as any;

      // Author Note Blot - for notes that won't export
      class AuthorNoteBlot extends BlockEmbed {
        static blotName = 'author-note';
        static tagName = 'div';
        static className = 'novel-author-note';

        static create(value: string) {
          const node = super.create();
          node.classList.add('novel-author-note');
          node.textContent = value || "Author's note";
          // Make the note non-editable in-place; editing is via modal
          node.setAttribute('contenteditable', 'false');
          node.setAttribute('title', 'Author Note - Will not appear in final export');
          return node;
        }

        static formats() {
          return true;
        }

        static value(node: HTMLElement) {
          return node.textContent || '';
        }
      }

      // Register the author note blot
      Quill.register('formats/author-note', AuthorNoteBlot);

      // Custom toolbar configuration for novel writing - basic formatting + author notes
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        [{ script: 'sub' }, { script: 'super' }],
        ['blockquote'],
        // Custom author's note button
        ['author-note'],
        ['clean'],
      ];

      // Create Quill instance
      const quill = new Quill(editorRef.current!, {
        theme: 'snow',
        readOnly: disabled,
        modules: {
          toolbar: {
            container: toolbarOptions,
          },

          // History module for undo/redo with delayed saving
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true,
          },

          // Keyboard shortcuts
          keyboard: {
            bindings: {
              // Ctrl+S for manual save
              save: {
                key: 's',
                shortKey: true,
                handler: () => {
                  window.dispatchEvent(new CustomEvent('editorSaveRequest'));
                  return false;
                },
              },
            },
          },

        },
        formats: [
          'bold',
          'italic',
          'underline',
          'strike',
          'script',
          'blockquote',
          'author-note',
        ],
        placeholder: init.placeholder || 'Begin your story...',
      });

      quillRef.current = quill;

      // Set initial content
      if (value !== undefined) {
        quill.root.innerHTML = value;
      } else if (initialValue) {
        quill.root.innerHTML = initialValue;
      }

      enforceAuthorNoteBounds(quill);

      let lastValidDelta = quill.getContents();

      const emitEditorChange = () => {
        const html = quill.root.innerHTML;
        const delta = quill.getContents();

        lastValidDelta = delta;

        // Track whether an author's note exists
        try {
          const exists = Boolean(quill.root.querySelector('.novel-author-note'));
          setHasAuthorNote(exists);
        } catch {}

        onEditorChange?.({
          html,
          // Delta instances are not serialisable by default; callers can access ops
          delta,
          images: [], // No images supported
        });
      };

      const handleTextChange = () => {
        enforceAuthorNoteBounds(quill);
        emitEditorChange();
      };
      textChangeHandlerRef.current = handleTextChange;
      quill.on('text-change', handleTextChange);

      const handleSelectionChange = (range: any, _oldRange: any, source: string) => {
        if (source !== 'user' || !range) return;
        const info = getAuthorNoteInfo(quill);
        if (!info) return;
        const { noteIndex } = info;
        if (range.index > noteIndex || (range.index === noteIndex && range.length > 0)) {
          quill.setSelection(noteIndex, 0, 'silent');
        }
      };
      selectionChangeHandlerRef.current = handleSelectionChange;
      quill.on('selection-change', handleSelectionChange);

      // Clicking the author's note opens the edit dialog
      const handleRootClick = (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest && target.closest('.novel-author-note')) {
          e.preventDefault();
          e.stopPropagation();
                    setNoteDraft(getExistingAuthorNoteText());
          setIsNoteDialogOpen(true);
        }
      };
      rootElRef.current = quill.root as HTMLElement;
      clickHandlerRef.current = handleRootClick;
      rootElRef.current.addEventListener('click', handleRootClick, true);

      const toolbarModule = quill.getModule('toolbar') as { addHandler?: (format: string, handler: () => void) => void } | undefined;
      if (toolbarModule?.addHandler) {
        toolbarModule.addHandler('author-note', () => {
                    setNoteDraft(getExistingAuthorNoteText());
          setIsNoteDialogOpen(true);
        });
      }

      // Store reference and call onInit
      onInit?.(quill);

      // Emit initial content snapshot after init
      emitEditorChange();
    });

    // Cleanup
    return () => {
      disposed = true;

      try {
        const root = rootElRef.current;
        const handler = clickHandlerRef.current;
        if (root && handler) {
          root.removeEventListener('click', handler, true);
        }
      } catch {}

      try {
        const q = quillRef.current;
        const textHandler = textChangeHandlerRef.current;
        if (q && textHandler) {
          q.off('text-change', textHandler);
        }
        const selectionHandler = selectionChangeHandlerRef.current;
        if (q && selectionHandler) {
          q.off('selection-change', selectionHandler);
        }
      } catch {}

      quillRef.current = null;
      rootElRef.current = null;
      clickHandlerRef.current = null;
      textChangeHandlerRef.current = null;
      selectionChangeHandlerRef.current = null;

      if (container) {
        try {
          container.innerHTML = '';
        } catch {}
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    const q = quillRef.current;
    if (q && value !== undefined) {
      const currentContent = q.root.innerHTML;
      if (currentContent !== value) {
        q.root.innerHTML = value;
      }
      enforceAuthorNoteBounds(q);
      try {
        const exists = Boolean(q.root.querySelector('.novel-author-note'));
        setHasAuthorNote(exists);
      } catch {}
    }
  }, [value, enforceAuthorNoteBounds]);

  // Update readonly state
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  // Novel-writing specific styles
  const novelEditorStyles = useMemo(() => {
    const h = typeof height === 'number' ? `${height}px` : String(height);
    return `
      .novel-editor-root {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
        /* Keep placeholder and caret aligned */
        --novel-editor-padding-top: 48px;
        --novel-editor-padding-bottom: 160px;
        --novel-toolbar-surface: color-mix(in srgb, var(--card) 92%, rgba(15, 23, 42, 0.15) 8%);
        --novel-toolbar-border: color-mix(in srgb, var(--border) 70%, rgba(148, 163, 184, 0.4) 30%);
        --novel-toolbar-shadow: 0 20px 45px rgba(8, 14, 32, 0.2);
        --novel-toolbar-divider: color-mix(in srgb, var(--border) 38%, transparent);
        --novel-toolbar-button-color: color-mix(in srgb, var(--foreground) 84%, var(--muted-foreground) 16%);
        --novel-toolbar-button-hover: color-mix(in srgb, var(--accent) 50%, rgba(148, 163, 184, 0.1) 50%);
        --novel-toolbar-button-active: color-mix(in srgb, var(--primary) 65%, rgba(59, 130, 246, 0.35) 35%);
        --novel-toolbar-button-active-color: var(--primary-foreground);
      }

      @supports not (background: color-mix(in srgb, white 50%, black 50%)) {
        .novel-editor-root {
          --novel-toolbar-surface: var(--card);
          --novel-toolbar-border: var(--border);
          --novel-toolbar-shadow: 0 18px 36px rgba(8, 11, 22, 0.24);
          --novel-toolbar-divider: var(--border);
          --novel-toolbar-button-color: var(--foreground);
          --novel-toolbar-button-hover: color-mix(in srgb, var(--accent) 80%, transparent);
          --novel-toolbar-button-active: color-mix(in srgb, var(--primary) 85%, transparent);
          --novel-toolbar-button-active-color: var(--primary-foreground);
        }
      }

      .novel-editor-root .novel-editor-surface {
        width: 100%;
      }

      .novel-editor-root .ql-container {
        min-height: ${h};
        background: transparent;
        border: none;
        font-family: 'Georgia', 'Times New Roman', serif;
        padding: 0 clamp(24px, 9vw, 160px);
        display: flex;
        justify-content: center;
      }

      .novel-editor-root .ql-editor {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 19px;
        line-height: 1.9;
        padding: var(--novel-editor-padding-top) 0 var(--novel-editor-padding-bottom);
        background: transparent;
        color: var(--foreground);
        min-height: ${h};
        border: none;
        outline: none;
        max-width: 860px;
        width: 100%;
        margin: 0 auto;
        position: relative;
        transition: color 0.2s ease;
      }

      .novel-editor-root .ql-editor:focus {
        background: transparent;
        box-shadow: none;
        outline: none;
      }

      .novel-editor-root .ql-toolbar {
        position: sticky;
        top: var(--novel-toolbar-offset, 0px);
        z-index: 60;
        background: var(--novel-toolbar-surface);
        border: 1px solid var(--novel-toolbar-border);
  border-radius: 20px;
  padding: clamp(12px, 1.6vh, 18px) clamp(16px, 4.4vw, 34px);
        margin: 0 auto 24px;
        color: var(--foreground);
        backdrop-filter: saturate(180%) blur(22px);
        box-shadow: var(--novel-toolbar-shadow);
        width: min(100%, 880px);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
  gap: 6px clamp(12px, 2.6vw, 20px);
        transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .dark .novel-editor-root .ql-toolbar {
        box-shadow: 0 26px 60px rgba(5, 8, 22, 0.45);
      }

      .novel-editor-root .ql-toolbar button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
  width: 36px;
  height: 36px;
        color: var(--novel-toolbar-button-color);
        border: 1px solid transparent;
        border-radius: 14px;
        background: transparent;
        padding: 0;
        margin: 0;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 8px 18px rgba(8, 14, 32, 0.18);
        transition: transform 0.16s ease, color 0.16s ease, background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
      }

      .novel-editor-root .ql-toolbar button:hover,
      .novel-editor-root .ql-toolbar button:focus-visible {
        background: var(--novel-toolbar-button-hover);
        color: var(--foreground);
        border-color: color-mix(in srgb, var(--novel-toolbar-border) 60%, var(--accent) 40%);
  transform: translateY(-0.5px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 22px rgba(8, 14, 32, 0.22);
      }

      .novel-editor-root .ql-toolbar button.ql-active {
        background: var(--novel-toolbar-button-active);
        color: var(--novel-toolbar-button-active-color);
        border-color: color-mix(in srgb, var(--novel-toolbar-border) 40%, var(--primary) 60%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16), 0 12px 24px rgba(8, 14, 32, 0.26);
      }

      .novel-editor-root .ql-toolbar button .ql-stroke {
        stroke: currentColor;
      }

      .novel-editor-root .ql-toolbar button .ql-fill {
        fill: currentColor;
      }

      .novel-editor-root .ql-toolbar button svg {
        width: 16px;
        height: 16px;
      }

      /* Label for custom Author Note button */
      .novel-editor-root .ql-toolbar button.ql-author-note::after {
        content: 'Note';
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.2px;
      }

      .novel-editor-root .ql-toolbar .ql-picker {
        color: var(--novel-toolbar-button-color);
      }

      .novel-editor-root .ql-toolbar .ql-formats {
        display: flex;
        align-items: center;
  gap: 8px;
        margin: 0;
  padding: 0 clamp(16px, 3.2vw, 24px) 0 0;
        border-right: 1px solid var(--novel-toolbar-divider);
      }

      .novel-editor-root .ql-toolbar .ql-formats:last-of-type {
        padding-right: 0;
        border-right: none;
      }

      .novel-editor-root .ql-toolbar .ql-picker-label {
        border-radius: 14px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--novel-toolbar-button-color);
  padding: 6px 14px;
        transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      }

      .novel-editor-root .ql-toolbar .ql-picker-label:hover,
      .novel-editor-root .ql-toolbar .ql-picker-item.ql-selected {
        background: var(--novel-toolbar-button-hover);
        color: var(--foreground);
        border-color: color-mix(in srgb, var(--novel-toolbar-border) 60%, var(--accent) 40%);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
      }

      .novel-editor-root .ql-toolbar .ql-picker-options {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(15, 23, 42, 0.15);
      }

      .dark .novel-editor-root .ql-toolbar .ql-picker-options {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
      }

      .novel-editor-root .ql-toolbar .ql-picker-item:hover {
        background: var(--accent);
        color: var(--accent-foreground);
      }

      .novel-editor-root .ql-editor .novel-chapter {
        color: var(--primary);
        font-size: 2.4em;
        font-weight: 600;
        margin: 1.5em 0 1em 0;
        padding: 0.5em 0;
        border-bottom: 1px solid var(--primary);
        text-align: center;
        background: var(--accent);
        border-radius: 8px;
      }

      .novel-editor-root .ql-editor .novel-scene-break {
        text-align: center;
        margin: 4em 0;
        padding: 2em 0;
        border: none;
        background: transparent;
        position: relative;
      }

      .novel-editor-root .ql-editor .scene-break-stars {
        color: var(--muted-foreground);
        font-size: 1.8em;
        letter-spacing: 2em;
        padding-left: 2em;
        opacity: 0.7;
      }

      .novel-editor-root .ql-editor .novel-scene-break::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border), transparent);
        z-index: -1;
      }

      .novel-editor-root .ql-editor .novel-author-note {
        background: var(--accent);
        color: var(--accent-foreground);
        border: 1px solid var(--accent-foreground);
        border-radius: 6px;
        padding: 4px 8px;
        margin: 32px 4px 0 4px;
        font-style: italic;
        font-size: 0.9em;
        position: relative;
      }

      .novel-editor-root .ql-editor .novel-author-note::before {
        content: 'Author\'s note:';
        margin-right: 4px;
        opacity: 0.7;
      }

      .novel-editor-root .ql-editor h1 {
        font-size: 2.15em;
        color: var(--foreground);
        font-weight: 600;
        margin: 2.2em 0 0.9em 0;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.35em;
      }

      .novel-editor-root .ql-editor h2 {
        font-size: 1.65em;
        color: var(--foreground);
        font-weight: 500;
        margin: 1.6em 0 0.7em 0;
      }

      .novel-editor-root .ql-editor h3 {
        font-size: 1.35em;
        color: var(--foreground);
        font-weight: 500;
        margin: 1.2em 0 0.6em 0;
      }

      .novel-editor-root .ql-editor p {
        margin: 0 0 1.6em 0;
        text-indent: 0;
        color: var(--muted-foreground);
        transition: color 0.2s ease;
        text-align: left;
      }

      .novel-editor-root .ql-editor blockquote {
        border-left: 4px solid var(--primary);
        background: var(--muted);
        padding: 1em 1.5em;
        margin: 1.5em 0;
        font-style: italic;
        color: var(--foreground);
        border-radius: 0 8px 8px 0;
      }

      .novel-editor-root .ql-editor ul,
      .novel-editor-root .ql-editor ol {
        margin: 1em 0;
        padding-left: 2em;
      }

      .novel-editor-root .ql-editor li {
        margin: 0.5em 0;
        color: var(--muted-foreground);
      }

      .novel-editor-root .ql-editor a {
        color: var(--primary);
        text-decoration: underline;
        text-decoration-thickness: 1px;
      }

      .novel-editor-root .ql-editor a:hover {
        color: var(--primary-foreground);
        background: var(--accent);
      }

      .novel-editor-root .ql-editor strong {
        color: var(--foreground);
        font-weight: 600;
      }

      .novel-editor-root .ql-editor em {
        color: var(--muted-foreground);
        font-style: italic;
      }

      .novel-editor-root .ql-editor u {
        text-decoration: underline;
        text-decoration-color: var(--muted-foreground);
      }

      .novel-editor-root .ql-editor::-webkit-scrollbar {
        width: 6px;
      }

      .novel-editor-root .ql-editor::-webkit-scrollbar-track {
        background: transparent;
      }

      .novel-editor-root .ql-editor::-webkit-scrollbar-thumb {
        background: var(--muted-foreground);
        border-radius: 3px;
      }

      .novel-editor-root .ql-editor::-webkit-scrollbar-thumb:hover {
        background: var(--muted-foreground);
      }

      .novel-editor-root .ql-editor ::selection {
        background: var(--primary);
        color: var(--primary-foreground);
      }

      .novel-editor-root .ql-editor.ql-blank::before {
        color: var(--muted-foreground);
        font-style: italic;
        opacity: 0.75;
        /* Align placeholder with actual typing start (remove Quill's default 15px offset) */
        left: 0 !important;
        right: 0 !important;
        text-indent: 0;
        /* Match the editor's top padding so the placeholder sits on the first line */
        top: var(--novel-editor-padding-top) !important;
        transform: none !important;
        pointer-events: none;
      }

      .novel-editor-root .ql-container .ql-editor {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
      }

      /* Overrides for author's note appearance as a transparent box */
      .novel-editor-root .ql-editor .novel-author-note {
        display: block;
        width: 100%;
        background: transparent;
        color: var(--foreground);
        border: 1px dashed color-mix(in srgb, var(--border) 70%, transparent);
        border-radius: 12px;
        padding: 14px 16px;
        margin: 20px 0 0 0;
        font-style: italic;
        font-size: 0.95em;
        position: relative;
        opacity: 0.9;
        cursor: pointer;
      }
      .novel-editor-root .ql-editor .novel-author-note::before {
        content: "Author’s note:";
        display: block;
        font-style: normal;
        font-weight: 600;
        letter-spacing: 0.02em;
        margin-bottom: 6px;
        color: var(--muted-foreground);
        opacity: 0.9;
      }

      /* Footer action: Add/Edit Author's Note */
      .novel-editor-root .author-note-footer {
        position: absolute;
        left: 50%;
        bottom: 48px;
        transform: translateX(-50%);
        width: min(100%, 880px);
        display: flex;
        justify-content: center;
      }
      .novel-editor-root .author-note-action-button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        border-radius: 12px;
        border: 1.5px solid color-mix(in srgb, var(--primary) 55%, var(--border) 45%);
        background: transparent;
        color: color-mix(in srgb, var(--primary) 75%, var(--foreground) 25%);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .novel-editor-root .author-note-action-button:hover {
        background: color-mix(in srgb, var(--primary) 8%, transparent);
        border-color: color-mix(in srgb, var(--primary) 70%, var(--border) 30%);
      }
      .novel-editor-root .author-note-action-button .plus {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 1.5px solid currentColor;
        border-radius: 6px;
        position: relative;
        opacity: 0.9;
      }
      .novel-editor-root .author-note-action-button .plus::before,
      .novel-editor-root .author-note-action-button .plus::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 10px;
        height: 1.5px;
        background: currentColor;
        transform: translate(-50%, -50%);
      }
      .novel-editor-root .author-note-action-button .plus::after {
        transform: translate(-50%, -50%) rotate(90deg);
      }

      /* Simple modal for note editing */
      .novel-editor-root .note-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.45);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 70;
      }
      .novel-editor-root .note-modal {
        width: min(92vw, 680px);
        background: var(--card);
        color: var(--foreground);
        border: 1px solid var(--border);
        border-radius: 14px;
        box-shadow: 0 24px 64px rgba(2, 6, 23, 0.35);
        padding: 18px;
      }
      .novel-editor-root .note-modal h3 {
        margin: 0 0 8px 0;
        font-size: 1.05rem;
        font-weight: 600;
      }
      .novel-editor-root .note-modal textarea {
        width: 100%;
        min-height: 120px;
        resize: vertical;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--background);
        color: var(--foreground);
        padding: 10px 12px;
        outline: none;
      }
      .novel-editor-root .note-modal textarea.note-invalid {
        border-color: var(--destructive, #ef4444);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--destructive, #ef4444) 35%, transparent);
      }
      .novel-editor-root .note-modal .note-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        font-size: 0.82rem;
        color: var(--muted-foreground);
      }
      .novel-editor-root .note-modal .note-count {
        font-variant-numeric: tabular-nums;
      }
      .novel-editor-root .note-modal .note-error {
        margin-top: 6px;
        font-size: 0.82rem;
        color: var(--destructive, #ef4444);
      }
      .novel-editor-root .note-modal .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 12px;
      }
      .novel-editor-root .note-modal button {
        padding: 8px 14px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--accent);
        color: var(--accent-foreground);
        cursor: pointer;
      }
      .novel-editor-root .note-modal button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .novel-editor-root .note-modal button.secondary {
        background: transparent;
        color: var(--foreground);
      }
    `;
  }, [height]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: novelEditorStyles }} />
      <div
        className="novel-editor-root"
        style={{
          minHeight: typeof height === 'number' ? `${height}px` : String(height),
          width: typeof width === 'number' ? `${width}px` : String(width),
        }}
      >
        <div ref={editorRef} className="novel-editor-surface" />
        {!hasAuthorNote && (
          <div className="author-note-footer">
            <button
              type="button"
              className="author-note-action-button"
              onClick={openAuthorNoteDialog}
              aria-label="Add Author's Note"
            >
              <span className="plus" aria-hidden="true" />
              Add Author's Note
            </button>
          </div>
        )}

        {isNoteDialogOpen && (
          <div className="note-modal-backdrop" onClick={() => setIsNoteDialogOpen(false)}>
            <div className="note-modal" onClick={(e) => e.stopPropagation()}>
              <h3>{hasAuthorNote ? "Edit Author's Note" : "Add Author's Note"}</h3>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write your note to readers…"
                aria-describedby="author-note-word-count"
                aria-invalid={isNoteTooLong}
                className={isNoteTooLong ? 'note-invalid' : undefined}
              />
              <div className="note-meta" id="author-note-word-count">
                <span className="note-count">
                  {noteWordCount} / {AUTHOR_NOTE_MAX_WORDS} words
                </span>
              </div>
              {authorNoteError && (
                <p className="note-error" role="alert">
                  {authorNoteError}
                </p>
              )}
              <div className="actions">
                <button
                  className="secondary"
                  type="button"
                  onClick={() => setIsNoteDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isNoteTooLong) {
                      return;
                    }
                    upsertAuthorNoteAtEnd(noteDraft);
                    setIsNoteDialogOpen(false);
                    try {
                      const q: any = quillRef.current;
                      if (q) {
                        const html = q.root?.innerHTML ?? '';
                        const delta = q.getContents?.();
                        const images: string[] = []; // No images supported
                        onEditorChange?.({ html, delta, images });
                      }
                    } catch {}
                  }}
                  disabled={isNoteTooLong}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}












