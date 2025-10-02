'use client';

import { Editor } from '@tinymce/tinymce-react';
import React, { useRef, useMemo } from 'react';

interface TinyMCEWrapperProps {
  value?: string;
  initialValue?: string;
  height?: number;
  width?: string | number;
  onEditorChange?: (content: string) => void;
  onInit?: (evt: any, editor: any) => void;
  init?: Record<string, any>;
  disabled?: boolean;
}

export default function TinyMCEWrapper({
  value,
  initialValue = '',
  height = 400,
  width = '100%',
  onEditorChange,
  onInit,
  init = {},
  disabled = false,
}: TinyMCEWrapperProps) {
  const editorInstanceRef = useRef<any>(null);

  // Merge config, add Markdown features and glow effect styles
  const mergedInit = useMemo(() => {
    const basePlugins = [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount',
      'emoticons', 'codesample', 'quickbars',
      'checklist', 'casechange', 'formatpainter', 'a11ychecker', 'tinymcespellchecker', 
      'permanentpen', 'powerpaste', 'advtable', 'advcode', 'autocorrect', 'typography',
      'markdown', // Add markdown plugin
    ];
    const baseToolbar =
      'importmd exportmd | undo redo | blocks fontfamily fontsize | styleselect | ' +
      'bold italic underline strikethrough | forecolor | casechange formatpainter | ' +
      'alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent | ' +
      'emoticons charmap image media | table advtable codesample | glowmode | spellcheckdialog a11ycheck | removeformat fullscreen | help';
    const baseContentStyle = `
      body {font-family: Georgia, serif;font-size:16px;line-height:1.7;direction:ltr;text-align:left;padding:20px;max-width:none;margin:0;background:hsl(var(--background,0 0% 100%));color:hsl(var(--foreground,222 47% 11%));transition: background 0.25s, color 0.25s; min-height:${height}px;}
      body.glow-mode {
        background:radial-gradient(circle at 50% 30%, hsl(var(--primary,221 83% 53%) / 0.08), transparent 70%) hsl(var(--background,0 0% 100%));
      }
      body.theme-dark.glow-mode {
        background:radial-gradient(circle at 50% 30%,hsl(var(--primary,217 91% 60%) / 0.15),transparent 70%) hsl(var(--background,222 30% 12%));
      }
      .glow-blue {color:#3b82f6;text-shadow:0 0 10px #3b82f6,0 0 20px #3b82f6,0 0 30px #3b82f6;font-weight:500;}
      .glow-purple {color:#8b5cf6;text-shadow:0 0 10px #8b5cf6,0 0 20px #8b5cf6,0 0 30px #8b5cf6;font-weight:500;}
      .glow-green {color:#10b981;text-shadow:0 0 10px #10b981,0 0 20px #10b981,0 0 30px #10b981;font-weight:500;}
      .glow-red {color:#ef4444;text-shadow:0 0 10px #ef4444,0 0 20px #ef4444,0 0 30px #ef4444;font-weight:500;}
      .glow-gold {color:#f59e0b;text-shadow:0 0 10px #f59e0b,0 0 20px #f59e0b,0 0 30px #f59e0b;font-weight:500;}
    `;

    return {
      ...init,
      height,
      width,
      menubar: 'file edit view insert format tools table help',
      plugins: Array.from(new Set([...(init.plugins || []), ...basePlugins])),
      toolbar: typeof init.toolbar === 'string' ? `${init.toolbar} | ${baseToolbar}` : baseToolbar,
      style_formats: [
        {
          title: 'Text Glow Effects',
          items: [
            { title: 'Blue Glow', inline: 'span', classes: 'glow-blue' },
            { title: 'Purple Glow', inline: 'span', classes: 'glow-purple' },
            { title: 'Green Glow', inline: 'span', classes: 'glow-green' },
            { title: 'Red Glow', inline: 'span', classes: 'glow-red' },
            { title: 'Gold Glow', inline: 'span', classes: 'glow-gold' },
          ],
        },
      ],
      content_style: (init.content_style ? `${init.content_style}\n${baseContentStyle}` : baseContentStyle),
      setup: (editor: any) => {
        // Markdown Import Button
        editor.ui.registry.addButton('importmd', {
          text: 'Import Markdown',
          tooltip: 'Import a Markdown (.md) file as rich text',
          onAction: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.md';
            input.onchange = (event: any) => {
              const file = event.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const content = e.target?.result;
                  editor.execCommand('MarkdownInsert', false, content);
                };
                reader.readAsText(file);
              }
            };
            input.click();
          },
        });

        // Markdown Export Button
        editor.ui.registry.addButton('exportmd', {
          text: 'Export Markdown',
          tooltip: 'Export this content as a Markdown file',
          onAction: async () => {
            if (editor.plugins.markdown) {
              const markdownContent = await editor.plugins.markdown.getContent();
              const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'content.md';
              a.click();
              URL.revokeObjectURL(url);
            }
          },
        });

        // Glow mode toggle
        editor.on('init', () => {
          if (editor.ui && editor.ui.registry) {
            editor.ui.registry.addToggleButton('glowmode', {
              text: 'Glow',
              tooltip: 'Toggle Glow Mode',
              onAction: () => {
                const body = editor.getBody();
                if (body) {
                  body.classList.toggle('glow-mode');
                  editor.fire('GlowModeToggle');
                }
              },
              onSetup: (api) => {
                const handler = () => {
                  const body = editor.getBody();
                  api.setActive(body && body.classList.contains('glow-mode'));
                };
                editor.on('GlowModeToggle', handler);
                return () => editor.off('GlowModeToggle', handler);
              },
            });
          }
          // Register glow formatters
          if (editor.formatter) {
            editor.formatter.register('glowblue', { inline: 'span', classes: 'glow-blue' });
            editor.formatter.register('glowpurple', { inline: 'span', classes: 'glow-purple' });
            editor.formatter.register('glowgreen', { inline: 'span', classes: 'glow-green' });
            editor.formatter.register('glowred', { inline: 'span', classes: 'glow-red' });
            editor.formatter.register('glowgold', { inline: 'span', classes: 'glow-gold' });
          }
        });

        // Call user setup function
        if (typeof init.setup === 'function') {
          init.setup(editor);
        }
      },
      directionality: 'ltr' as const,
      branding: false,
      elementpath: false,
      resize: false,
    };
  }, [init, height, width]);

  return (
    <div style={{ minHeight: `${height}px`, width: typeof width === 'number' ? `${width}px` : width }}>
      <Editor
        apiKey='s1iz9dikdfsyaqexszi667acdryvyd1k8hlg0yjq2ti5zsxo'
        value={value}
        initialValue={!value ? initialValue : undefined}
        init={mergedInit}
        disabled={disabled}
        onInit={(evt, ed) => {
          editorInstanceRef.current = ed;
          if (ed && typeof ed.getBody === 'function') {
            onInit?.(evt, ed);
          }
        }}
        onEditorChange={onEditorChange}
      />
    </div>
  );
}
