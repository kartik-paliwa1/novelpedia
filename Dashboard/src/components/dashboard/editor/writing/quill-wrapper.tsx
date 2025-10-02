"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import ReactQuill with proper error handling
const ReactQuill = dynamic(() => import("react-quill-new"), {
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

// Import Quill CSS
import "quill/dist/quill.snow.css";

interface QuillWrapperProps {
  value?: string;
  initialValue?: string;
  height?: number;
  width?: string | number;
  onEditorChange?: (content: string) => void;
  onInit?: (evt: any, editor: any) => void;
  init?: Record<string, any>;
  disabled?: boolean;
}

// Naive markdown<->html conversion helpers (replace with markdown-it + turndown as needed)
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/\n$/gim, "<br/>");
}

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/gim, "# $1\n")
    .replace(/<h2>(.*?)<\/h2>/gim, "## $1\n")
    .replace(/<h3>(.*?)<\/h3>/gim, "### $1\n")
    .replace(/<strong>(.*?)<\/strong>/gim, "**$1**")
    .replace(/<b>(.*?)<\/b>/gim, "**$1**")
    .replace(/<em>(.*?)<\/em>/gim, "*$1*")
    .replace(/<i>(.*?)<\/i>/gim, "*$1*")
    .replace(/<code>(.*?)<\/code>/gim, "`$1`")
    .replace(/<br\s*\/?>/gim, "\n")
    .replace(/<\/p>/gim, "\n\n")
    .replace(/<[^>]+>/g, "");
}

export default function QuillWrapper({
  value,
  initialValue = "",
  height = 400,
  width = "100%",
  onEditorChange,
  onInit,
  init = {},
  disabled = false,
}: QuillWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Register custom glow formats with Quill only on client side
  useEffect(() => {
    if (!isClient) return;

    import('quill').then(({ default: Quill }) => {
      const Inline = Quill.import('blots/inline') as any;
      const Scope = Quill.import('parchment').Scope;

      class GlowFormat extends Inline {
        static blotName = 'glow';
        static tagName = 'span';
        static className = 'glow-text';
        static scope = Scope.INLINE;

        static create(color: string) {
          const node = super.create();
          if (color && color !== 'false') {
            node.classList.add(`glow-${color}`);
            node.setAttribute('data-glow', color);
          }
          return node;
        }

        static formats(node: HTMLElement) {
          // Check for data attribute first
          const dataGlow = node.getAttribute('data-glow');
          if (dataGlow) return dataGlow;
          
          // Check for class-based glow
          const classList = Array.from(node.classList);
          for (const className of classList) {
            if (className.startsWith('glow-')) {
              return className.replace('glow-', '');
            }
          }
          return false;
        }

        optimize(context: any) {
          // Prevent optimization that might remove the glow format
          return this;
        }
      }

      Quill.register('formats/glow', GlowFormat);
    });
  }, [isClient]);

  // Call onInit when component mounts (simplified for react-quill-new)
  useEffect(() => {
    if (isReady) {
      // For react-quill-new, we pass a mock editor object
      onInit?.(null, {
        getContent: () => value || initialValue,
        setContent: (content: string) => onEditorChange?.(content),
      });
    }
  }, [isReady, onInit, value, initialValue, onEditorChange]);

  const toolbar = [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    [{ glow: ["blue", "purple", "green", "gold", "red", false] }], // glow dropdown only
    ["importmd", "exportmd"],
    ["clean"],
  ];

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: toolbar,
        handlers: {
          // Fixed link handler as per Quill 2.x documentation
          link: function (value) {
            if (value) {
              const href = window.prompt("Enter the URL:");
              if (href) {
                this.quill.format("link", href);
              }
            } else {
              this.quill.format("link", false);
            }
          },
          // Enhanced image handler with file upload support
          image: function () {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.style.display = "none";

            input.onchange = async (e: any) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // Check file size (limit to 5MB)
              if (file.size > 5 * 1024 * 1024) {
                alert("Image size must be less than 5MB");
                return;
              }

              // Convert to base64 for embedding (for local files)
              const reader = new FileReader();
              reader.onload = (event) => {
                const quill = this.quill;
                const range = quill.getSelection(true);
                const base64 = event.target?.result as string;
                quill.insertEmbed(range.index, "image", base64, "user");
              };
              reader.readAsDataURL(file);
            };

            // Show file picker dialog
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          },
          // Glow dropdown handler - applies different colors based on selection
          glow: function (value: string | false) {
            const quill = this.quill;
            const range = quill.getSelection();

            if (!range || range.length === 0) {
              alert("Please select text first to apply glow effect");
              return;
            }

            console.log('Applying glow:', value, 'to range:', range);
            
            // Apply the glow format to the selected text
            if (value === false || value === 'false') {
              quill.removeFormat(range.index, range.length);
            } else {
              quill.formatText(range.index, range.length, 'glow', value);
            }
            
            // Force a re-render to ensure the format sticks
            setTimeout(() => {
              const delta = quill.getContents();
              console.log('Current delta after glow:', delta);
            }, 100);
          },
          importmd: function () {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".md";
            input.style.display = "none";
            input.onchange = async (e: any) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              const html = markdownToHtml(text);

              const quill = this.quill;
              quill.clipboard.dangerouslyPasteHTML(html);
              onEditorChange?.(quill.root.innerHTML);
            };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          },
          exportmd: function () {
            const quill = this.quill;
            const html = quill.root.innerHTML;
            const md = htmlToMarkdown(html);
            const blob = new Blob([md], {
              type: "text/markdown;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "chapter.md";
            a.click();
            URL.revokeObjectURL(url);
          },
        },
      },
      keyboard: {
        bindings: {
          save: {
            key: "s",
            shortKey: true,
            handler: () => {
              window.dispatchEvent(new CustomEvent("editorSaveRequest"));
              return false;
            },
          },
        },
      },
      ...init.modules,
    };
  }, [toolbar, init.modules, onEditorChange]);

  const formats = useMemo(
    () => [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "script",
      "align",
      "list",
      "indent",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
      "glow",
    ],
    []
  );

  const baseContentStyle = useMemo(() => {
    const h = typeof height === "number" ? `${height}px` : String(height);
    return `
      .ql-container { min-height: ${h}; }
      .ql-editor { 
        font-family: Georgia, serif;
        font-size: 16px;
        line-height: 1.7;
        direction: ltr;
        text-align: left;
        padding: 20px;
        background: hsl(var(--background,0 0% 100%));
        color: hsl(var(--foreground,222 47% 11%));
        transition: background 0.25s, color 0.25s;
      }
      .ql-editor.glow-mode {
        background: radial-gradient(circle at 50% 30%, hsl(var(--primary,221 83% 53%) / 0.08), transparent 70%) hsl(var(--background,0 0% 100%));
      }
      .theme-dark .ql-editor.glow-mode {
        background: radial-gradient(circle at 50% 30%, hsl(var(--primary,217 91% 60%) / 0.15), transparent 70%) hsl(var(--background,222 30% 12%));
      }
      
      /* Glow text classes - these apply to selected text */
      .ql-editor .glow-blue { 
        color: #3b82f6 !important; 
        text-shadow: 0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6 !important; 
        font-weight: 500; 
      }
      .ql-editor .glow-purple { 
        color: #8b5cf6 !important; 
        text-shadow: 0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6 !important; 
        font-weight: 500; 
      }
      .ql-editor .glow-green { 
        color: #10b981 !important; 
        text-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981 !important; 
        font-weight: 500; 
      }
      .ql-editor .glow-red { 
        color: #ef4444 !important; 
        text-shadow: 0 0 10px #ef4444, 0 0 20px #ef4444, 0 0 30px #ef4444 !important; 
        font-weight: 500; 
      }
      .ql-editor .glow-gold { 
        color: #f59e0b !important; 
        text-shadow: 0 0 10px #f59e0b, 0 0 20px #f59e0b, 0 0 30px #f59e0b !important; 
        font-weight: 500; 
      }
      
      /* Custom toolbar button styles */
      .ql-toolbar .ql-importmd:after { content: "📥"; }
      .ql-toolbar .ql-exportmd:after { content: "📤"; }
      
      /* Style the glow dropdown options */
      .ql-toolbar .ql-picker.ql-glow .ql-picker-label::before {
        content: "✨";
      }
      
      /* Move the dropdown arrow slightly to the left */
      .ql-toolbar .ql-picker.ql-glow .ql-picker-label::after {
        transform: translateX(-6px) !important;
        position: relative !important;
      }
      
      .ql-toolbar .ql-picker.ql-glow .ql-picker-options {
        width: 120px;
      }
      
      .ql-toolbar .ql-picker.ql-glow .ql-picker-item[data-value="blue"]::before {
        content: "Blue Glow";
        color: #3b82f6;
      }
      
      .ql-toolbar .ql-picker.ql-glow .ql-picker-item[data-value="purple"]::before {
        content: "Purple Glow";
        color: #8b5cf6;
      }
      
      .ql-toolbar .ql-picker.ql-glow .ql-picker-item[data-value="green"]::before {
        content: "Green Glow";
        color: #10b981;
      }
      
      .ql-toolbar .ql-picker.ql-glow .ql-picker-item[data-value="gold"]::before {
        content: "Gold Glow";
        color: #f59e0b;
      }
      
      .ql-toolbar .ql-picker.ql-glow .ql-picker-item[data-value="red"]::before {
        content: "Red Glow";
        color: #ef4444;
      }
      
      .ql-toolbar .ql-picker.ql-glow .ql-picker-item[data-value="false"]::before {
        content: "Remove Glow";
      }
      
      /* Tooltips for custom buttons */
      .ql-toolbar .ql-importmd { position: relative; }
      .ql-toolbar .ql-importmd:hover:before {
        content: "Import Markdown file";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      .ql-toolbar .ql-exportmd { position: relative; }
      .ql-toolbar .ql-exportmd:hover:before {
        content: "Export as Markdown";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      /* Glow button tooltip */
      .ql-toolbar .ql-glow { position: relative; }
      .ql-toolbar .ql-glow:hover:before {
        content: "Text Glow Effects";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      /* Additional tooltips for common tools */
      .ql-toolbar .ql-clean:hover:before {
        content: "Remove formatting";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      .ql-toolbar .ql-link:hover:before {
        content: "Insert link";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      .ql-toolbar .ql-image:hover:before {
        content: "Upload Image";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      .ql-toolbar .ql-video:hover:before {
        content: "Insert video";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
      
      /* Ensure all toolbar buttons have proper position for tooltips */
      .ql-toolbar button { position: relative; }
      .ql-toolbar button:before { z-index: 1000; }
    `;
  }, [height]);

  const handleChange = (html: string) => {
    // Set ready state on first change if not already set
    if (!isReady) {
      setIsReady(true);
    }
    onEditorChange?.(html);
  };

  // Don't render until we're on the client side to prevent hydration errors
  if (!isClient) {
    return (
      <div
        style={{
          minHeight:
            typeof height === "number" ? `${height}px` : String(height),
          width: typeof width === "number" ? `${width}px` : String(width),
        }}
        className="flex items-center justify-center bg-muted rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: typeof height === "number" ? `${height}px` : String(height),
        width: typeof width === "number" ? `${width}px` : String(width),
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: baseContentStyle }} />
      <ReactQuill
        theme="snow"
        readOnly={disabled}
        value={value !== undefined ? value : initialValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={init.placeholder}
      />
    </div>
  );
}
