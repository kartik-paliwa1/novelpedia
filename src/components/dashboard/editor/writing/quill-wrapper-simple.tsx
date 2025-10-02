'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

type QuillConstructor = typeof import('quill')['default'];
type QuillInstance = InstanceType<QuillConstructor>;

interface QuillWrapperProps {
  value?: string;
  initialValue?: string;
  height?: number;
  width?: string | number;
  onEditorChange?: (content: string) => void;
  onInit?: (editor: QuillInstance) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface QuillWrapperRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
  getEditor: () => QuillInstance | null;
}

let cachedQuill: QuillConstructor | null = null;

const loadQuill = async (): Promise<QuillConstructor> => {
  if (cachedQuill) {
    return cachedQuill;
  }

  const mod = await import('quill');
  const QuillCtor: QuillConstructor = (mod as any).default ?? (mod as any);

  cachedQuill = QuillCtor;
  return QuillCtor;
};

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['blockquote', 'code-block'],
  ['image'],
  ['clean'],
];

const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'indent',
  'image',
  'color',
  'background',
  'script',
];

const QuillWrapper = forwardRef<QuillWrapperRef, QuillWrapperProps>((props, ref) => {
  const {
    value,
    initialValue = '',
    height = 400,
    width = '100%',
    onEditorChange,
    onInit,
    placeholder = 'Start writing...',
    disabled = false,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const suppressChangeRef = useRef(false);
  const onEditorChangeRef = useRef<typeof onEditorChange>(onEditorChange);
  const [content, setContent] = useState(() => value ?? initialValue ?? '');
  const pendingContentRef = useRef<string>(value ?? initialValue ?? '');

  useEffect(() => {
    onEditorChangeRef.current = onEditorChange;
  }, [onEditorChange]);

  useEffect(() => {
    if (value === undefined) {
      return;
    }
    pendingContentRef.current = value;
    setContent(value);
  }, [value]);

  useEffect(() => {
    if (value !== undefined) {
      return;
    }
    const next = initialValue ?? '';
    pendingContentRef.current = next;
    setContent(next);
  }, [initialValue, value]);

  const modules = useMemo(
    () => ({
      toolbar: toolbarOptions,
      keyboard: {
        bindings: {
          'ctrl-s': {
            key: 'S',
            ctrlKey: true,
            handler: () => {
              const html = quillRef.current?.root.innerHTML ?? pendingContentRef.current;
              onEditorChangeRef.current?.(html);
              return false;
            },
          },
          'ctrl-b': {
            key: 'B',
            ctrlKey: true,
            handler: (range: any, context: any) => {
              const quill = (context?.quill as QuillInstance | undefined) ?? quillRef.current;
              if (!quill) return false;
              const format = quill.getFormat(range);
              quill.format('bold', !format.bold);
              return false;
            },
          },
          'ctrl-i': {
            key: 'I',
            ctrlKey: true,
            handler: (range: any, context: any) => {
              const quill = (context?.quill as QuillInstance | undefined) ?? quillRef.current;
              if (!quill) return false;
              const format = quill.getFormat(range);
              quill.format('italic', !format.italic);
              return false;
            },
          },
          'ctrl-u': {
            key: 'U',
            ctrlKey: true,
            handler: (range: any, context: any) => {
              const quill = (context?.quill as QuillInstance | undefined) ?? quillRef.current;
              if (!quill) return false;
              const format = quill.getFormat(range);
              quill.format('underline', !format.underline);
              return false;
            },
          },
          'ctrl-shift-c': {
            key: 'C',
            ctrlKey: true,
            shiftKey: true,
            handler: (_range: any, context: any) => {
              const quill = (context?.quill as QuillInstance | undefined) ?? quillRef.current;
              quill?.format('code-block', true);
              return false;
            },
          },
          'ctrl-shift-9': {
            key: '9',
            ctrlKey: true,
            shiftKey: true,
            handler: (_range: any, context: any) => {
              const quill = (context?.quill as QuillInstance | undefined) ?? quillRef.current;
              quill?.format('blockquote', true);
              return false;
            },
          },
        },
      },
      history: {
        delay: 1000,
        maxStack: 500,
        userOnly: true,
      },
    }),
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let disposed = false;
    let textChangeHandler: ((...args: unknown[]) => void) | null = null;

    const init = async () => {
      if (quillRef.current || !containerRef.current) {
        return;
      }

      const QuillCtor = await loadQuill();
      if (disposed || !containerRef.current || quillRef.current) {
        return;
      }

      const container = containerRef.current;
      container.innerHTML = pendingContentRef.current || '';

      const instance = new QuillCtor(container, {
        theme: 'snow',
        modules,
        formats,
        placeholder,
        readOnly: disabled,
      }) as QuillInstance;

      const initialHtml = instance.root.innerHTML;
      pendingContentRef.current = initialHtml;
      setContent(initialHtml);

      textChangeHandler = () => {
        const html = instance.root.innerHTML;
        pendingContentRef.current = html;
        setContent(html);

        if (suppressChangeRef.current) {
          suppressChangeRef.current = false;
          return;
        }

        onEditorChangeRef.current?.(html);
      };

      instance.on('text-change', textChangeHandler);
      quillRef.current = instance;

      onInit?.(instance);

      if (!disabled) {
        setTimeout(() => {
          if (!disposed) {
            quillRef.current?.focus?.();
          }
        }, 50);
      }
    };

    init();

    return () => {
      disposed = true;
      if (quillRef.current && textChangeHandler) {
        quillRef.current.off('text-change', textChangeHandler);
      }
      quillRef.current = null;
    };
  }, []); // deliberate: initialise Quill exactly once

  useEffect(() => {
    if (!quillRef.current) {
      return;
    }

    quillRef.current.root.dataset.placeholder = placeholder ?? '';
  }, [placeholder]);

  useEffect(() => {
    if (!quillRef.current) {
      return;
    }

    quillRef.current.enable(!disabled);
  }, [disabled]);

  useEffect(() => {
    if (value === undefined || !quillRef.current) {
      return;
    }

    const quill = quillRef.current;
    const currentHtml = quill.root.innerHTML;
    if (currentHtml === value) {
      return;
    }

    const selection = quill.getSelection();
    suppressChangeRef.current = true;
    quill.clipboard.dangerouslyPasteHTML(value);
    if (selection) {
      const length = quill.getLength();
      quill.setSelection(Math.min(selection.index, length - 1), selection.length);
    }
  }, [value]);

  useEffect(() => {
    if (value !== undefined || !quillRef.current) {
      return;
    }

    const next = initialValue ?? '';
    const quill = quillRef.current;
    const currentHtml = quill.root.innerHTML;
    if (currentHtml === next) {
      return;
    }

    const selection = quill.getSelection();
    suppressChangeRef.current = true;
    quill.clipboard.dangerouslyPasteHTML(next);
    if (selection) {
      const length = quill.getLength();
      quill.setSelection(Math.min(selection.index, length - 1), selection.length);
    }
  }, [initialValue, value]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const styleId = 'notion-quill-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const editorMinHeight = Math.max(height - 60, 0);

    styleEl.textContent = `
        .notion-quill-container {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
          background: hsl(var(--background));
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          transition: box-shadow 0.15s ease;
        }

        .notion-quill-container:focus-within {
          box-shadow: 0 0 0 2px hsl(var(--ring));
        }

        .notion-quill-container.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .notion-quill-container .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          padding: 10px 14px;
          background: hsl(var(--background));
          font-family: inherit;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px 14px;
        }

        .notion-quill-container .ql-toolbar .ql-formats {
          margin: 0 !important;
          padding: 0 16px 0 0 !important;
          display: flex;
          align-items: center;
          gap: 12px;
          border-right: 1px solid hsl(var(--border));
        }

        .notion-quill-container .ql-toolbar .ql-formats:last-of-type {
          padding-right: 0 !important;
          border-right: none !important;
        }

        .notion-quill-container .ql-toolbar button {
          border-radius: 4px;
          padding: 6px 8px;
          margin: 0 2px;
          transition: all 0.15s ease;
          border: none !important;
          background: transparent;
          width: auto;
          height: auto;
        }

        .notion-quill-container .ql-toolbar button:hover {
          background: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground));
        }

        .notion-quill-container .ql-toolbar button.ql-active {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground));
        }

        .notion-quill-container .ql-toolbar .ql-picker {
          color: hsl(var(--foreground));
        }

        .notion-quill-container .ql-container {
          border: none !important;
          font-size: 16px;
          line-height: 1.6;
          background: hsl(var(--background));
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .notion-quill-container .ql-editor {
          padding: 20px 24px;
          color: hsl(var(--foreground));
          min-height: ${editorMinHeight}px;
          border: none !important;
          outline: none !important;
        }

        .notion-quill-container .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
        }

        .notion-quill-container .ql-editor h1 {
          font-size: 2.5em;
          font-weight: 700;
          line-height: 1.2;
          margin: 1em 0 0.5em 0;
          color: hsl(var(--foreground));
        }

        .notion-quill-container .ql-editor h2 {
          font-size: 2em;
          font-weight: 600;
          line-height: 1.3;
          margin: 0.8em 0 0.4em 0;
          color: hsl(var(--foreground));
        }

        .notion-quill-container .ql-editor h3 {
          font-size: 1.5em;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.6em 0 0.3em 0;
          color: hsl(var(--foreground));
        }

        .notion-quill-container .ql-editor p {
          margin: 0.5em 0;
          line-height: 1.6;
        }

        .notion-quill-container .ql-editor blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
          background: hsl(var(--muted) / 0.5);
          border-radius: 0 4px 4px 0;
        }

        .notion-quill-container .ql-editor ul,
        .notion-quill-container .ql-editor ol {
          padding-left: 24px;
          margin: 8px 0;
        }

        .notion-quill-container .ql-editor li {
          margin: 4px 0;
          line-height: 1.6;
        }

        .notion-quill-container .ql-editor pre.ql-syntax {
          background: hsl(var(--muted)) !important;
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 16px;
          margin: 16px 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          overflow-x: auto;
          color: hsl(var(--foreground));
        }

        .notion-quill-container .ql-editor code {
          background: hsl(var(--muted));
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
          color: hsl(var(--foreground));
        }

        .notion-quill-container .ql-editor a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .notion-quill-container .ql-editor a:hover {
          text-decoration: none;
        }

        .notion-quill-container .ql-editor ::selection {
          background: hsl(var(--primary) / 0.2);
        }

        @media (max-width: 768px) {
          .notion-quill-container .ql-toolbar {
            padding: 8px 12px;
            flex-wrap: wrap;
          }

          .notion-quill-container .ql-editor {
            padding: 16px;
            font-size: 15px;
          }
        }
      `;
  }, [height]);

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => quillRef.current?.root.innerHTML ?? content,
      setContent: (newContent: string) => {
        pendingContentRef.current = newContent;
        setContent(newContent);

        if (quillRef.current) {
          const quill = quillRef.current;
          const currentHtml = quill.root.innerHTML;
          if (currentHtml !== newContent) {
            const selection = quill.getSelection();
            suppressChangeRef.current = true;
            quill.clipboard.dangerouslyPasteHTML(newContent);
            if (selection) {
              const length = quill.getLength();
              quill.setSelection(Math.min(selection.index, length - 1), selection.length);
            }
          }
        }
      },
      focus: () => {
        quillRef.current?.focus?.();
      },
      blur: () => {
        quillRef.current?.root?.blur?.();
      },
      getEditor: () => quillRef.current,
    }),
    [content],
  );

  const containerStyle = useMemo(
    () => ({
      width: typeof width === 'number' ? `${width}px` : width,
      minHeight: `${Math.max(height, 0)}px`,
    }),
    [width, height],
  );

  return (
    <div style={containerStyle} className={`notion-quill-container ${disabled ? 'disabled' : ''}`}>
      <div ref={containerRef} />
    </div>
  );
});

QuillWrapper.displayName = 'QuillWrapper';

export default QuillWrapper;


