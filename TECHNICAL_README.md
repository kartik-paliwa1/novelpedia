# NovelPedia Frontend - Developer Workflow Guide

## 🚀 Quick Start

**What is this?** Author dashboard for novel writing and management.

**Current State:** ✅ FrontEnd almost completed, working with mock data → 🔄 Needs real backend APIs

**Main User Flow:**
1. `/dashboard` → View stats and recent novels
2. `/dashboard/editor` → Choose/create a novel  
3. `/dashboard/editor/[novel-slug]` → Manage chapters
4. `/dashboard/editor/[novel-slug]/[chapter-id]` → Write chapter content

## 📁 File Workflows

### **Dashboard Layout System**

#### 1. Main Layout (`src/components/dashboard/layout/`)
```
dashboard-layout.tsx    → Wraps entire dashboard
├── sidebar.tsx         → Left navigation (Overview/Workspace/etc)
├── top-nav.tsx         → Top bar with user menu
└── theme-toggle.tsx    → Dark/light mode switch
```

**What each file does:**
- **`dashboard-layout.tsx`** - Container that holds sidebar + main content
- **`sidebar.tsx`** - Navigation menu, handles active states based on URL
- **`top-nav.tsx`** - User profile, notifications, settings dropdown
- **`theme-toggle.tsx`** - Simple dark/light mode switcher

### **Editor Workflow System**

#### 2. Novel Selection (`/dashboard/editor`)
```
src/app/dashboard/editor/page.tsx
└── src/components/dashboard/editor/editor-novel-list.tsx  → Shows novel grid, "Create Novel" button
```

**What it does:** Shows all user's novels in a grid, handles novel creation

#### 3. Novel Management (`/dashboard/editor/[novel-slug]`)
```
src/app/dashboard/editor/[novelslug]/page.tsx
└── src/components/dashboard/editor/novel-workspace-route.tsx              → Route handler
    └── src/components/dashboard/editor/novel/novel-workspace.tsx          → Main workspace UI
        ├── src/components/dashboard/editor/novel/novel-display-card.tsx   → Novel info panel
        └── (chapter list + pagination)                                    → Built into workspace
```

**What each file does:**
- **`novel-workspace-route.tsx`** - Loads novel data, handles URL params
- **`novel-workspace.tsx`** - Main UI (chapter list, create/delete chapters, pagination)
- **`novel-display-card.tsx`** - Shows novel title, stats, cover image

#### 4. Chapter Writing (`/dashboard/editor/[novel-slug]/[chapter-id]`)
```
src/app/dashboard/editor/[novelslug]/[chapterid]/page.tsx
└── src/components/dashboard/editor/chapter-editor-route.tsx               → Route handler
    └── src/components/dashboard/editor/chapter/chapter-editor.tsx         → Main editor UI
        ├── src/components/dashboard/editor/writing/rich-text-editor.tsx   → TinyMCE wrapper ⚠️ PAID LICENSE
        └── src/components/dashboard/editor/chapter/chapter-reader.tsx     → Preview mode
```

**What each file does:**
- **`chapter-editor-route.tsx`** - Loads chapter data, handles navigation
- **`chapter-editor.tsx`** - Editor interface (save buttons, word count, auto-save)
- **`writing/rich-text-editor.tsx`** - 🎯 **TinyMCE integration (REPLACE THIS FOR FREE EDITOR)**
- **`chapter-reader.tsx`** - Preview mode (how readers see the chapter)

### **TinyMCE Integration (Current Editor)**

**⚠️ IMPORTANT:** TinyMCE requires paid license for production. To switch editors, modify these files.
```
src/components/dashboard/editor/writing/
├── rich-text-editor.tsx    → Main editor component (TinyMCE)
└── tinymce-wrapper.tsx     → TinyMCE configuration
```

## 🔄 User Journeys

### Journey 1: Author Creates New Novel
```
1. /dashboard/editor
   ├── Click "Create Novel" button
   ├── Fill novel-creation-dialog.tsx
   └── Redirect to /dashboard/editor/[new-novel-slug]

2. /dashboard/editor/[new-novel-slug]
   ├── See empty chapter list in novel-workspace.tsx
   ├── Click "Create Chapter" button
   └── Redirect to /dashboard/editor/[novel-slug]/[chapter-id]

3. /dashboard/editor/[novel-slug]/[chapter-id]
   ├── chapter-editor.tsx loads
   ├── writing/rich-text-editor.tsx (TinyMCE) opens
   ├── Author writes content
   ├── Auto-save every 30 seconds
   └── Manual save with button
```

### Journey 2: Author Manages Existing Novel
```
1. /dashboard/editor
   ├── See novel grid in editor-novel-list.tsx
   └── Click novel → redirect to /dashboard/editor/[novel-slug]

2. /dashboard/editor/[novel-slug]
   ├── novel-workspace.tsx shows chapter list
   ├── Pagination (5 chapters per page)
   ├── Drag-and-drop reorder chapters
   ├── Delete chapters with confirmation
   └── Click chapter → redirect to /dashboard/editor/[novel-slug]/[chapter-id]
```

### Journey 3: Author Writes Chapter
```
1. /dashboard/editor/[novel-slug]/[chapter-id]
   ├── chapter-editor-route.tsx loads data
   ├── chapter-editor.tsx renders interface
   ├── writing/rich-text-editor.tsx (TinyMCE) for content
   ├── Toggle preview → chapter-reader.tsx
   ├── Auto-save works in background
   └── Click back → return to novel-workspace.tsx
```

## 🔌 Backend Integration

### **Author Novel API**

The dashboard now consumes the author-scoped Django API exposed under `/api/author/novels/`. The client normalizes every response into the shared `Project` shape (`src/types/editor.ts`) so UI components can consume metadata consistently.

```
GET    /api/author/novels/               → List the authenticated author's novels (Project[])
POST   /api/author/novels/               → Create a new draft novel
PATCH  /api/author/novels/{slug}/        → Update novel metadata/status
GET    /api/novels/                      → Public catalogue (read-only)

GET    /api/novels/{slug}/chapters/      → List chapters for a novel
POST   /api/novels/{slug}/chapters/      → Create a chapter draft
PUT    /api/chapters/{id}/               → Update chapter
DELETE /api/chapters/{id}/               → Delete chapter
POST   /api/chapters/{id}/autosave/      → Auto-save chapter edits
```

**Author novel payload (frontend ↔ backend):**

```jsonc
{
   "title": "My Novel",
   "synopsis": "Long description",
   "short_synopsis": "Teaser (optional)",
   "status": "Draft" | "Completed",
   "target_audience": "Young Adult",
   "language": "English",
   "update_schedule": "Weekly",
   "planned_length": "120 chapters",
   "maturity_rating": "Teen",
   "primary_genre_id": 4,
   "genre_ids": [4, 7],
   "tag_ids": [1, 9, 22]
}
```

`ApiService` (`src/services/api.ts`) maps API responses to include derived fields such as `primaryGenre`, `progress`, `wordCount`, and cover fallbacks so downstream components never touch raw serializer keys.

## ✏️ Editor Replacement Guide

### **Current: TinyMCE (Paid License Required)**
```
src/components/dashboard/editor/writing/
├── rich-text-editor.tsx    → Main TinyMCE component
└── tinymce-wrapper.tsx     → TinyMCE configuration
```

### **How to Replace with Free Editor**

#### Option 1: React-Quill (Most Popular)
```bash
npm uninstall @tinymce/tinymce-react
npm install react-quill quill
```

**Files to Update:**
1. **`writing/rich-text-editor.tsx`** - Replace TinyMCE with ReactQuill
2. **`writing/tinymce-wrapper.tsx`** - Delete this file
3. **`chapter-editor.tsx`** - Update editor props if needed

#### Option 2: Tiptap (Modern Alternative)
```bash
npm uninstall @tinymce/tinymce-react
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

#### Option 3: Novel Writer (Specialized)
```bash
npm uninstall @tinymce/tinymce-react
npm install @lexical/react @lexical/core
```

### **Editor Requirements Checklist**
- ✅ Rich text formatting (bold, italic, headers)
- ✅ Auto-save every 30 seconds
- ✅ Word count display
- ✅ Full-screen mode
- ✅ Copy/paste from Word documents
- 🔄 Markdown support (nice to have)
- 🔄 Distraction-free mode (nice to have)

