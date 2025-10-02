'use client';

import React, { useEffect, useRef, useMemo } from 'react';

// Import Quill CSS
import 'quill/dist/quill.snow.css';

interface QuillNovelWrapperProps {
  value?: string;
  initialValue?: string;
  height?: number;
  width?: string | number;
  onEditorChange?: (content: string) => void;
  onInit?: (evt: any, editor: any) => void;
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

  // Initialize Quill editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Dynamic import to avoid SSR issues
    import('quill').then(({ default: Quill }) => {
      const BlockEmbed = Quill.import('blots/block/embed') as any;
      const Inline = Quill.import('blots/inline') as any;
      const Block = Quill.import('blots/block') as any;

      // Chapter Blot - renders as <h2> with special styling
      class ChapterBlot extends Block {
        static blotName = 'chapter';
        static tagName = 'h2';
        static className = 'novel-chapter';

        static create(value: string) {
          const node = super.create();
          node.classList.add('novel-chapter');
          node.setAttribute('contenteditable', 'true');
          node.textContent = value || 'Chapter Title';
          return node;
        }

        static formats() {
          return true;
        }

        static value(node: HTMLElement) {
          return node.textContent || '';
        }
      }

      // Scene Break Blot - horizontal divider styled as * * *
      class SceneBreakBlot extends BlockEmbed {
        static blotName = 'scene-break';
        static tagName = 'div';
        static className = 'novel-scene-break';

        static create() {
          const node = super.create();
          node.classList.add('novel-scene-break');
          node.setAttribute('contenteditable', 'false');
          node.innerHTML = '<span class="scene-break-stars">* * *</span>';
          return node;
        }

        static formats() {
          return true;
        }

        static value() {
          return true;
        }
      }

      // Author Note Blot - for notes that won't export
      class AuthorNoteBlot extends Inline {
        static blotName = 'author-note';
        static tagName = 'span';
        static className = 'novel-author-note';

        static create(value: string) {
          const node = super.create();
          node.classList.add('novel-author-note');
          node.textContent = value || 'Author note';
          node.setAttribute('contenteditable', 'true');
          node.setAttribute('title', 'Author Note - Will not appear in final export');
          return node;
        }

        static formats(node: HTMLElement) {
          return node.textContent || '';
        }

        static value(node: HTMLElement) {
          return node.textContent || '';
        }
      }

      // Register all custom blots
      Quill.register('formats/chapter', ChapterBlot);
      Quill.register('formats/scene-break', SceneBreakBlot);
      Quill.register('formats/author-note', AuthorNoteBlot);

      // Custom toolbar configuration for novel writing
      const toolbarOptions = [
        // Headers for chapter titles and subheadings
        [{ header: [1, 2, 3, false] }],
        
        // Basic text formatting
        ['bold', 'italic', 'underline'],
        
        // Lists for organization
        [{ list: 'ordered' }, { list: 'bullet' }],
        
        // Text alignment
        [{ align: [] }],
        
        // Blockquotes for dialogue/prophecy
        ['blockquote'],
        
        // Links
        ['link'],
        
        // Custom novel elements
        ['chapter', 'scene-break', 'author-note'],
        
        // Clear formatting
        ['clean'],
      ];

      // Create Quill instance
      const quill = new Quill(editorRef.current!, {
        theme: 'snow',
        readOnly: disabled,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // Custom handler for chapter insertion
              chapter: function (this: any) {
                const quill = this.quill;
                const range = quill.getSelection(true);
                const chapterTitle = window.prompt('Enter chapter title:', 'Chapter Title') || 'Chapter Title';
                
                // Insert a new line and then the chapter
                quill.insertText(range.index, '\n', 'user');
                quill.insertEmbed(range.index + 1, 'chapter', chapterTitle, 'user');
                quill.insertText(range.index + 2, '\n', 'user');
                
                // Set cursor after the chapter
                quill.setSelection(range.index + 3);
              },

              // Custom handler for scene break insertion
              'scene-break': function (this: any) {
                const quill = this.quill;
                const range = quill.getSelection(true);
                
                // Insert scene break with proper spacing
                quill.insertText(range.index, '\n', 'user');
                quill.insertEmbed(range.index + 1, 'scene-break', true, 'user');
                quill.insertText(range.index + 2, '\n', 'user');
                
                // Set cursor after the scene break
                quill.setSelection(range.index + 3);
              },

              // Custom handler for author notes
              'author-note': function (this: any) {
                const quill = this.quill;
                const range = quill.getSelection();
                
                if (!range || range.length === 0) {
                  // If no selection, insert a new author note
                  const noteText = window.prompt('Enter author note:', 'Note to self...') || 'Note to self...';
                  const currentRange = quill.getSelection(true);
                  quill.insertEmbed(currentRange.index, 'author-note', noteText, 'user');
                  quill.setSelection(currentRange.index + 1);
                } else {
                  // If text is selected, convert it to an author note
                  const selectedText = quill.getText(range.index, range.length);
                  quill.deleteText(range.index, range.length);
                  quill.insertEmbed(range.index, 'author-note', selectedText, 'user');
                  quill.setSelection(range.index + 1);
                }
              },

              // Enhanced link handler
              link: function (this: any, value: any) {
                if (value) {
                  const href = window.prompt('Enter the URL:');
                  if (href) {
                    this.quill.format('link', href);
                  }
                } else {
                  this.quill.format('link', false);
                }
              },
            },
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
              // Ctrl+Shift+C for chapter
              chapter: {
                key: 'c',
                shortKey: true,
                shiftKey: true,
                handler: function(this: any) {
                  const toolbar = this.quill.getModule('toolbar');
                  toolbar.handlers.chapter.call(toolbar);
                  return false;
                },
              },
              // Ctrl+Shift+B for scene break
              sceneBreak: {
                key: 'b',
                shortKey: true,
                shiftKey: true,
                handler: function(this: any) {
                  const toolbar = this.quill.getModule('toolbar');
                  toolbar.handlers['scene-break'].call(toolbar);
                  return false;
                },
              },
              // Ctrl+Shift+N for author note
              authorNote: {
                key: 'n',
                shortKey: true,
                shiftKey: true,
                handler: function(this: any) {
                  const toolbar = this.quill.getModule('toolbar');
                  toolbar.handlers['author-note'].call(toolbar);
                  return false;
                },
              },
            },
          },
        },
        formats: [
          'header',
          'bold',
          'italic',
          'underline',
          'list',
          'align',
          'blockquote',
          'link',
          'chapter',
          'scene-break',
          'author-note',
        ],
        placeholder: init.placeholder || 'Begin your story...',
      });

      // Set initial content
      if (value !== undefined) {
        quill.root.innerHTML = value;
      } else if (initialValue) {
        quill.root.innerHTML = initialValue;
      }

      // Listen for text changes
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        onEditorChange?.(html);
      });

      // Store reference and call onInit
      quillRef.current = quill;
      onInit?.(null, {
        getContent: () => quill.root.innerHTML,
        setContent: (content: string) => {
          quill.root.innerHTML = content;
        },
      });
    });

    // Cleanup
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

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
      /* Main editor container with dark theme */
      .ql-container { 
        min-height: ${h}; 
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 8px;
        font-family: 'Georgia', 'Times New Roman', serif;
      }
      
      /* Editor content area with novel-writing optimizations */
      .ql-editor { 
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 18px;
        line-height: 1.8;
        padding: 40px;
        background: #0f172a;
        color: #e2e8f0;
        min-height: ${h};
        transition: all 0.3s ease;
      }
      
      .ql-editor:focus {
        background: #1e293b;
        box-shadow: inset 0 0 0 1px #3b82f6;
      }
      
      /* Toolbar styling for dark theme */
      .ql-toolbar {
        background: #1e293b;
        border: 1px solid #334155;
        border-bottom: none;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 12px;
      }
      
      .ql-toolbar button {
        color: #cbd5e1;
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 6px 8px;
        margin: 2px;
      }
      
      .ql-toolbar button:hover {
        background: #334155;
        color: #f1f5f9;
        border-color: #475569;
      }
      
      .ql-toolbar button.ql-active {
        background: #3b82f6;
        color: white;
        border-color: #2563eb;
      }
      
      .ql-toolbar .ql-picker {
        color: #cbd5e1;
      }
      
      .ql-toolbar .ql-picker-options {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 4px;
      }
      
      .ql-toolbar .ql-picker-item:hover {
        background: #334155;
        color: #f1f5f9;
      }
      
      /* Chapter titles styling */
      .ql-editor .novel-chapter {
        color: #60a5fa;
        font-size: 2.2em;
        font-weight: 700;
        margin: 2em 0 1em 0;
        padding: 0.5em 0;
        border-bottom: 2px solid #1e40af;
        text-align: center;
      }
      
      /* Scene breaks styling */
      .ql-editor .novel-scene-break {
        text-align: center;
        margin: 3em 0;
        padding: 1em 0;
        border: none;
        background: transparent;
      }
      
      .ql-editor .scene-break-stars {
        color: #94a3b8;
        font-size: 1.5em;
        letter-spacing: 1em;
        padding-left: 1em;
      }
      
      /* Author notes styling */
      .ql-editor .novel-author-note {
        background: #1e40af20;
        color: #93c5fd;
        border: 1px dashed #3b82f6;
        border-radius: 4px;
        padding: 2px 6px;
        margin: 0 2px;
        font-style: italic;
        font-size: 0.9em;
      }
      
      /* Headers (H1, H2, H3) for subheadings */
      .ql-editor h1 {
        font-size: 2em;
        color: #f1f5f9;
        font-weight: 600;
        margin: 1.5em 0 0.8em 0;
        border-bottom: 1px solid #475569;
        padding-bottom: 0.3em;
      }
      
      .ql-editor h2 {
        font-size: 1.6em;
        color: #e2e8f0;
        font-weight: 500;
        margin: 1.3em 0 0.6em 0;
      }
      
      .ql-editor h3 {
        font-size: 1.3em;
        color: #cbd5e1;
        font-weight: 500;
        margin: 1.1em 0 0.5em 0;
      }
      
      /* Paragraphs with proper spacing */
      .ql-editor p {
        margin: 0 0 1.2em 0;
        text-indent: 2em;
        color: #e2e8f0;
      }
      
      .ql-editor p:first-of-type,
      .ql-editor h1 + p,
      .ql-editor h2 + p,
      .ql-editor h3 + p {
        text-indent: 0;
      }
      
      /* Blockquotes for dialogue/prophecy */
      .ql-editor blockquote {
        border-left: 4px solid #3b82f6;
        background: #1e293b;
        padding: 1em 1.5em;
        margin: 1.5em 0;
        font-style: italic;
        color: #cbd5e1;
        border-radius: 0 8px 8px 0;
      }
      
      /* Lists styling */
      .ql-editor ul, .ql-editor ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      
      .ql-editor li {
        margin: 0.5em 0;
        color: #e2e8f0;
      }
      
      /* Links */
      .ql-editor a {
        color: #60a5fa;
        text-decoration: underline;
      }
      
      .ql-editor a:hover {
        color: #93c5fd;
      }
      
      /* Emphasis styling */
      .ql-editor strong {
        color: #f1f5f9;
        font-weight: 600;
      }
      
      .ql-editor em {
        color: #cbd5e1;
        font-style: italic;
      }
      
      .ql-editor u {
        text-decoration: underline;
        text-decoration-color: #64748b;
      }
      
      /* Custom toolbar button labels */
      .ql-toolbar button.ql-chapter:after {
        content: "📖";
      }
      
      .ql-toolbar button.ql-scene-break:after {
        content: "⭐";
      }
      
      .ql-toolbar button.ql-author-note:after {
        content: "📝";
      }
      
      /* Tooltips for custom buttons */
      .ql-toolbar button.ql-chapter {
        position: relative;
      }
      
      .ql-toolbar button.ql-chapter:hover:before {
        content: "Insert Chapter (Ctrl+Shift+C)";
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      .ql-toolbar button.ql-scene-break {
        position: relative;
      }
      
      .ql-toolbar button.ql-scene-break:hover:before {
        content: "Insert Scene Break (Ctrl+Shift+B)";
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      .ql-toolbar button.ql-author-note {
        position: relative;
      }
      
      .ql-toolbar button.ql-author-note:hover:before {
        content: "Insert Author Note (Ctrl+Shift+N)";
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      /* Scrollbar styling */
      .ql-editor::-webkit-scrollbar {
        width: 8px;
      }
      
      .ql-editor::-webkit-scrollbar-track {
        background: #1e293b;
      }
      
      .ql-editor::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 4px;
      }
      
      .ql-editor::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
      
      /* Selection styling */
      .ql-editor ::selection {
        background: #3b82f6;
        color: white;
      }
      
      /* Placeholder styling */
      .ql-editor.ql-blank::before {
        color: #64748b;
        font-style: italic;
      }
    `;
  }, [height]);

  return (
    <div
      style={{
        minHeight: typeof height === 'number' ? `${height}px` : String(height),
        width: typeof width === 'number' ? `${width}px` : String(width),
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: novelEditorStyles }} />
      <div ref={editorRef} />
    </div>
  );
}