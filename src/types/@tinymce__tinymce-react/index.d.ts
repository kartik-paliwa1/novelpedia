declare module '@tinymce/tinymce-react' {
  import type React from 'react';

  export interface EditorProps {
    value?: string;
    onEditorChange?: (content: string, editor: unknown) => void;
    init?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export const Editor: React.ComponentType<EditorProps>;
}
