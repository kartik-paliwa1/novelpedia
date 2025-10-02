# NovelPedia Frontend -

**For detailed author dashboard workflows, file structure, and editor integration:**
**[TECHNICAL_README.md](./TECHNICAL_README.md)** - Complete workflow guide
---

## Table of Contents
- [Quick Start](#quick-start)
- [Running with Docker](#running-with-docker)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Core Modules](#core-modules)
- [Component Structure](#component-structure)
- [Type System](#type-system)
- [Data Management](#data-management)
- [Component Patterns](#component-patterns)
- [Development Workflow](#development-workflow)
- [File Organization](#file-organization)

## Quick Start

Follow these steps for a standard local development setup:

1. Install dependencies: `npm install`
2. Generate the Prisma client: `npx prisma generate`
3. Launch the development server: `npm run dev`
4. Open the application at [http://localhost:3000](http://localhost:3000)

> ℹ️  Looking for containerised workflows? See [Running with Docker](#running-with-docker) or the detailed [Docker guide](./DOCKER.md).

## Running with Docker

The repository ships with a multi-service Docker Compose configuration that starts both the Next.js frontend and the Django backend. If you already have Docker and Docker Compose installed, the fastest way to spin up the full stack is:

```bash
docker compose up --build
```

This will:

- Build and run the frontend on [http://localhost:3000](http://localhost:3000)
- Build and run the backend on [http://localhost:8000](http://localhost:8000)
- Automatically run database migrations and share the SQLite database through a bind-mounted volume

For environment variables, troubleshooting tips, and additional commands (such as stopping services or running one-off commands in a container), consult the dedicated [Docker guide](./DOCKER.md).

## Project Overview

NovelPedia is a Next.js 14 application for novel writing and management. The frontend uses:
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom neumorphic design system
- **UI Library**: shadcn/ui components
- **State Management**: React useState/hooks (local state)
- **Icons**: Lucide React

## Architecture

### Module Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── editor/            # Novel writing & management
│   ├── novel/             # Novel display components
│   ├── ideas/             # Writing resources & inspiration
│   ├── community/         # Forum & community features
│   ├── ui/                # Base UI components
│   └── layout/            # Layout components
├── types/                 # TypeScript type definitions
├── data/                  # Mock data and constants
└── lib/                   # Utility functions
```

## Core Modules

### 1. Editor Module (`src/components/editor/`)

The editor module handles novel creation, editing, and management. It's the heart of the writing workflow.

**Key Components:**
- `EditorContent` - Main dashboard for novel management
- `NovelManagement` - Individual novel management interface (this is under the sub module novel)
- `WritingEditor` - Chapter writing interface

**Sub-modules:**
- `chapter/` - Chapter-specific components
- `dialogs/` - Modal dialogs for CRUD operations
- `novel/` - Novel-specific management
- `stats/` - Writing statistics and analytics (`StatsOverview`, `WritingStats`)

### 2. Novel Module (`src/components/novel/`)

Handles novel display and reader-facing components.

**Key Components:**
- `UnifiedNovelCard` - Consolidated card component for all novel displays
- `StatsCard` - Novel statistics display

**Utility Components:**
- `StatusBadge` - Status indication (Draft/Completed/Publishing) (located in `src/components/ui/`)
- `IconText` - Icon + text display utility (located in `src/components/ui/`)

### 3. Ideas Module (`src/components/ideas/`)

Provides writing resources, inspiration, and tools for authors.

**Key Components:**
- `IdeasContent` - Main ideas page with tabbed interface
- `IdeasStats` - Statistics cards for resources count
- `ResourceCard` - Individual resource display (videos, articles, podcasts)
- `WritingPrompts` - Writing prompt generator (Coming Soon for MVP)
- `WritingTools` - Writing utility tools (Coming Soon for MVP)

**Sub-modules:**
- `resource/` - Resource-related components (cards, filters, grid)
- `prompts/` - Writing prompts functionality (MVP: Coming Soon)
- `tools/` - Writing tools and utilities (MVP: Coming Soon)

### 4. Community Module (`src/components/community/`)

Handles forum functionality and community interactions.

**Key Components:**
- `CommunityContent` - Main community page with forum posts
- `CommunityStatsComponent` - Community statistics display
- `PostCard` - Individual forum post component
- `NewPostDialog` - Create new forum post modal

**Sub-modules:**
- `forum/` - Forum-specific components (filters, categories, contributors)
- `post/` - Post-related components
- `dialogs/` - Modal dialogs for community actions

## Component Structure

### Editor Components

#### `EditorContent` (Main Dashboard)
- **Purpose**: Central hub for managing all novels
- **Features**: Novel listing, creation, filtering, search
- **State Management**: Manages selected novel, preview mode, chapters
- **Navigation**: Routes to `NovelManagement` when novel is selected

```typescript
interface EditorContentState {
  selectedProject: number | null
  selectedChapter: number | null
  previewMode: "editor" | "reader"
  viewMode: "grid" | "list"
  chapters: Chapter[]
  projects: Project[]
}
```

#### `NovelManagement` (Novel Detail)
- **Purpose**: Manage individual novel and its chapters
- **Features**: Chapter management, novel editing, completion workflow
- **Views**: Details tab, chapters tab with drag-and-drop reordering
- **Actions**: Edit novel, add/delete chapters, mark as completed

#### Chapter Components

1. **`ChapterReader`**
   - **Purpose**: Display chapter content in editor/reader mode
   - **Modes**: Editor view (standard) vs Reader view (reading-optimized)
   - **Features**: Chapter navigation, editing controls

2. **`EditorChapterManager`**
   - **Purpose**: Advanced chapter management with reordering
   - **Features**: Drag-and-drop, pagination, bulk operations
   - **Integration**: Used within `NovelManagement`

3. **`ChapterManager`** (Legacy)
   - **Status**: Uses hardcoded data, maintained for compatibility
   - **Usage**: Basic chapter listing display (not interactive)
   - **Note**: For actual chapter management, use `EditorChapterManager`

### Novel Display Components

#### `UnifiedNovelCard`
- **Purpose**: Single component for all novel card variants
- **Variants**: `simple`, `detailed`, `grid`, `list`
- **Props**: Flexible data interface supporting different novel types
- **Features**: Status badges, statistics, action menus

```typescript
interface UnifiedNovelCardProps {
  variant: "simple" | "detailed" | "grid" | "list"
  data: SimpleNovelData | DetailedNovelData | ProjectNovelData
  onClick?: () => void
  onAction?: (action: string) => void
  className?: string
}
```

### Ideas Components

#### `IdeasContent` (Main Ideas Page)
- **Purpose**: Central hub for writing resources and inspiration
- **Features**: Tabbed interface (Resources, Prompts, Tools), search/filtering
- **State Management**: Manages filters, resource selection, prompt generation
- **MVP Status**: Resources active, Prompts/Tools show "Coming Soon"

#### Resource Components

1. **`ResourceCard`**
   - **Purpose**: Display individual learning resources (videos, articles, podcasts)
   - **Features**: Rating display, platform icons, action buttons
   - **Actions**: Play/read, bookmark, share

2. **`ResourceFiltersComponent`**
   - **Purpose**: Search and filter resources by category and difficulty
   - **Features**: Search input, category dropdown, difficulty filter

3. **`ResourceGrid`**
   - **Purpose**: Grid layout for displaying filtered resources
   - **Features**: Responsive design, empty state handling

### Community Components

#### `CommunityContent` (Main Community Page)
- **Purpose**: Central hub for forum discussions and community interaction
- **Features**: Post listing, category filtering, search, user interactions
- **State Management**: Manages posts, filters, user actions
- **Layout**: Sidebar with categories and contributors, main content area

#### Forum Components

1. **`PostCard`**
   - **Purpose**: Individual forum post display
   - **Features**: Author info, post content, voting, replies, actions
   - **Interactive Elements**: Upvote/downvote, reply, save, share, report

2. **`ForumFiltersComponent`**
   - **Purpose**: Search and sort forum posts
   - **Features**: Search input, sort by hot/new/top

3. **`CategoriesSidebar`**
   - **Purpose**: Category navigation with post counts
   - **Features**: Category filtering, post count badges

4. **`TopContributors`**
   - **Purpose**: Display leaderboard of most active community members
   - **Features**: User avatars, post counts, reputation scores

5. **`NewPostDialog`**
   - **Purpose**: Modal for creating new forum posts
   - **Features**: Title, category selection, content editor, draft saving

## Type System

### Core Types (`src/types/editor.ts`)

```typescript
export interface Project {
  id: number
  title: string
  status: "Draft" | "Completed"
  genre: string
  description: string
  tags: string[]
  cover: string
  chapters: number
  words: number
  views: number
  collections: number
  rating: number
  progress: number
  lastUpdated: string
  lastChapter: string
  lastEdited: string
  wordCount: number
}

export interface Chapter {
  id: number
  title: string
  wordCount: number
  publishedAt: string
  status: "completed" | "draft"
  order: number
}

export interface NovelFormData {
  title: string
  genre: string
  description: string
  tags: string[]
  cover: string
  targetAudience?: string
  language?: string
  plannedLength?: string
  updateSchedule?: string
}

export interface Novel {
  id: number
  title: string
  genre: string
  description: string
  tags: string[]
  cover: string
}
```

### Ideas Types (`src/types/ideas.ts`)

```typescript
export interface WritingResource {
  id: number
  type: "video" | "article" | "podcast"
  platform: string
  title: string
  author: string
  duration?: string
  readTime?: string
  views: string
  rating: number
  thumbnail: string
  description: string
  tags: string[]
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

export interface ResourceFilters {
  searchQuery: string
  selectedCategory: string
  selectedDifficulty: string
}

export interface WritingPrompt {
  id: number
  text: string
  category?: string
  difficulty?: "Easy" | "Medium" | "Hard"
  tags?: string[]
}
```

### Community Types (`src/types/community.ts`)

```typescript
export interface Author {
  name: string
  avatar: string
  reputation: number
  badge: string
}

export interface ForumPost {
  id: number
  title: string
  author: Author
  content: string
  category: string
  tags: string[]
  timestamp: string
  replies: number
  upvotes: number
  views: number
  isPinned: boolean
  isHot: boolean
}

export interface ForumFilters {
  searchQuery: string
  selectedCategory: string
  sortBy: "hot" | "new" | "top"
}

export interface CommunityStats {
  activeMembers: number
  totalPosts: number
  postsToday: number
  solvedQuestions: number
}
```

## Data Management

### Mock Data (`src/data/editor-mock-data.ts`)

- **`recentProjects`**: Sample novel projects for development
- **`chaptersData`**: Sample chapters with various statuses
- **`CHAPTERS_PER_PAGE`**: Pagination constant (set to 5, but `EditorChapterManager` uses 8)

### State Flow

1. **Editor Dashboard**: Manages global state (projects, selected novel)
2. **Novel Management**: Manages novel-specific state (chapters, preview mode)
3. **Chapter Components**: Receive props, emit events for state updates
4. **Ideas Page**: Manages resource filters, search queries, and feature toggles
5. **Community Page**: Manages forum posts, category filters, and user interactions

### New Module Data Patterns

#### Ideas Module
- **Resources**: Uses mock data array with filtering and search capabilities
- **Prompts/Tools**: MVP placeholders with "Coming Soon" states
- **Filters**: Local state management for search and category filtering

#### Community Module
- **Forum Posts**: Mock data with sorting (hot, new, top) and category filtering
- **User Interactions**: Event-driven architecture for upvotes, replies, etc.
- **Statistics**: Aggregated data display for community metrics

## Component Patterns

### 1. Unified Component Pattern
- **Problem**: Multiple similar components with slight variations
- **Solution**: Single component with variant props
- **Example**: `UnifiedNovelCard` replaces 4 separate card components

### 2. Utility Component Pattern
- **Purpose**: Reusable micro-components for common patterns
- **Examples**: 
  - `StatusBadge`: Consistent status display
  - `IconText`: Icon + text combinations

### 3. Compound Component Pattern
- **Usage**: Complex components with multiple related parts
- **Example**: `NovelManagement` with tabs and sub-components

### 4. Props Interface Pattern
```typescript
// Base interface
interface BaseProps {
  className?: string
}

// Extend for specific components
interface ComponentProps extends BaseProps {
  data: DataType
  onAction: (id: number) => void
}
```

### 5. Barrel Export Pattern
- **Purpose**: Centralize module exports for cleaner imports
- **Structure**: Each module has an `index.ts` that re-exports all components
- **Benefits**: Simplified imports, better encapsulation, easier refactoring
- **Example**: 
```typescript
// Instead of multiple imports
import { ResourceCard } from "@/components/ideas/resource/resource-card"
import { ResourceGrid } from "@/components/ideas/resource/resource-grid"

// Single barrel import
import { ResourceCard, ResourceGrid } from "@/components/ideas"
```

## Development Workflow

### Styling Guidelines

1. **Tailwind Classes**: Primary styling method
2. **Custom Classes**: Use for complex patterns (`.neumorphic`)
3. **Responsive Design**: Mobile-first approach with `md:` and `lg:` prefixes
4. **Dark Mode**: Built-in support via Tailwind dark mode

## File Organization

### Component Files
```
component-name/
├── component-name.tsx      # Main component
├── component-name.types.ts # Type definitions (if complex)
└── index.ts               # Re-export
```

### Module Organization
```
module/
├── index.ts               # Public API exports (barrel export)
├── main-component.tsx     # Primary component
├── sub-modules/           # Feature-specific sub-folders
│   ├── component.tsx      # Sub-module components
│   └── index.ts          # Sub-module exports (if needed)
├── types.ts              # Module-specific types (in /types folder)
└── utils.ts              # Module utilities (if needed)
```

**Examples:**
- `ideas/` module: resources, prompts, tools sub-modules
- `community/` module: forum, post, dialogs sub-modules  
- `editor/` module: chapter, dialogs, novel, stats sub-modules

### Import Patterns
```typescript
// External libraries
import React from "react"
import { Button } from "@/components/ui/button"

// Internal utilities
import { cn } from "@/lib/utils"

// Types
import type { ComponentProps } from "@/types/component"

// Local components (relative imports for same module)
import { SubComponent } from "./sub-component"
```

## Known Issues & Technical Debt

### Inconsistencies to Address
1. **Pagination Constants**: `CHAPTERS_PER_PAGE` has different values across components (5 vs 8)
2. **Legacy Components**: `ChapterManager` uses hardcoded data and should be deprecated
3. **Mixed Data Sources**: Some components use mock data directly, others receive props

### Recommended Cleanup Tasks
1. Consolidate pagination constants into a single configuration file
2. Phase out `ChapterManager` in favor of `EditorChapterManager`
3. Establish consistent data flow patterns across all components

---

This guide should help new contributors understand the codebase structure and development patterns. For specific implementation questions, refer to existing components as examples or consult the team.
