import { API_BASE_URL } from '@/config/api';
import {
  clearAuthTokens,
  getAuthToken,
  getStoredRefreshToken,
  refreshAuthToken,
  storeAuthTokens,
} from '@/utils/auth';
import { DashboardStats } from '@/types/dashboard';
import { Chapter, Project } from '@/types/editor';

type ChapterAutosavePayload = {
  title?: string;
  paragraphs?: string[];
  is_published?: boolean;
  content_html?: string;
  content_delta?: unknown;
  hero_image_data?: string | null;
};

type ChapterAutosaveResponse = {
  status?: string;
  content_html?: string;
  content_delta?: unknown;
  hero_image_url?: string | null;
};

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  dob?: string | null;
  gender?: string | null;
  role?: string | null;
  time_read?: number;
  user_status?: string;
  books_read?: number;
  followers_count?: number;
  profile_likes?: number;
  bio?: string | null;
  imageURI?: string | null;
  bannerImageURI?: string | null;
  timezone?: string | null;
  patreonUrl?: string | null;
}

export type UpdateProfilePayload = Partial<Omit<UserProfile, 'id' | 'email'>> & {
  name?: string;
  email?: never;
};

const DEFAULT_NOVEL_COVER_PLACEHOLDER = 'https://placehold.co/600x800/6b7280/ffffff?text=No+Cover';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh?: string;
  [key: string]: unknown;
}

export interface AuthorNovelDraftPayload {
  title: string;
  synopsis: string;
  short_synopsis?: string;
  status?: string;
  content_type?: string;
  language?: string;
  planned_length?: string;
  maturity_rating?: string;
  primary_genre_id?: number | null;
  genre_ids?: number[];
  tag_ids?: number[];
  // New fields for auto-creation of missing tags/genres
  primary_genre_name?: string;
  genre_names?: string[];
  tag_names?: string[];
}

export type AuthorNovelUpdatePayload = Partial<AuthorNovelDraftPayload>;

export interface Post {
  id: number;
  title: string;
  body: string;
  [key: string]: unknown;
}

export interface PostCreate {
  title: string;
  body: string;
  category?: string;
  tags?: (string | number)[];
  [key: string]: unknown;
}

export interface FeaturedItem {
  id: number | string;
  title: string;
  description?: string;
  cover_image?: string;
  [key: string]: unknown;
}

export interface Bookmark {
  id: number | string;
  novel?: Project | number | string | null;
  chapter?: Chapter | number | string | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface Tag {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  [key: string]: unknown;
}

export interface Genre {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  [key: string]: unknown;
}

export interface Review {
  id: number;
  rating: number;
  title?: string;
  body?: string;
  reviewer?: Record<string, unknown> | number | string;
  novel?: number | Project | string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ChapterStats {
  id: number | string;
  views?: number;
  likes?: number;
  comments?: number;
  bookmarks?: number;
  [key: string]: unknown;
}

export interface Comment {
  id: number;
  body: string;
  author?: Record<string, unknown> | number | string;
  created_at?: string;
  updated_at?: string;
  parent?: number | null;
  post?: number | Record<string, unknown> | null;
  chapter?: number | Record<string, unknown> | null;
  replies?: Comment[];
  [key: string]: unknown;
}

export interface CommentCreate {
  body: string;
  parent?: number | null;
  post?: number | string;
  chapter?: number | string;
  [key: string]: unknown;
}

export interface SocialProvider {
  id: string;
  name: string;
  authorization_url?: string;
  icon?: string;
  [key: string]: unknown;
}

export interface SocialLoginSession {
  authorization_url: string;
  state?: string;
  code_verifier?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: number | string;
  title: string;
  body?: string;
  type?: string;
  created_at?: string;
  read?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CommentThreadNode extends Comment {
  replies?: CommentThreadNode[];
  context?: Record<string, unknown>;
}

export class ApiError<T = unknown> extends Error {
  status: number;
  details?: T;

  constructor(message: string, status: number, details?: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: HeadersInit;
  requiresAuth?: boolean;
  retryOnUnauthorized?: boolean;
}

interface HandleRequestMeta {
  requiresAuth: boolean;
  retryOnUnauthorized: boolean;
  retry?: (accessToken: string) => Promise<Response>;
}

const buildHeaders = (headers?: HeadersInit) => new Headers(headers ?? {});

const buildQueryString = (params?: Record<string, string | number | boolean | undefined | null>) => {
  if (!params) {
    return '';
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const parseResponseBody = async (response: Response) => {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

const extractTokens = (payload: Record<string, unknown>): AuthTokens | null => {
  const access = (payload.access || payload.accessToken || payload.token) as string | undefined;
  const refresh = (payload.refresh || payload.refreshToken) as string | undefined;

  if (!access && !refresh) {
    return null;
  }

  return {
    access: access ?? '',
    refresh,
  };
};

export class ApiService {
  private transformAuthorNovel = (rawNovel: any): Project => {
    const novel = rawNovel ?? {};

    const primaryGenreRaw = novel.primary_genre ?? novel.primaryGenre ?? null;
    const resolvedPrimaryGenre = (() => {
      if (!primaryGenreRaw) {
        return null;
      }

      if (typeof primaryGenreRaw === 'object') {
        return {
          id: Number(primaryGenreRaw.id ?? primaryGenreRaw.pk ?? 0),
          name: String(
            primaryGenreRaw.name ??
              primaryGenreRaw.title ??
              primaryGenreRaw.label ??
              primaryGenreRaw.slug ??
              ''
          ),
        };
      }

      const fallbackName =
        novel.primary_genre_name ??
        novel.primaryGenreName ??
        novel.primary_genre_label ??
        primaryGenreRaw;

      return {
        id: Number(primaryGenreRaw),
        name: String(fallbackName ?? primaryGenreRaw ?? ''),
      };
    })();

    const tags = Array.isArray(novel.tags)
      ? novel.tags
          .map((tag: any) => {
            if (!tag) {
              return null;
            }
            if (typeof tag === 'string') {
              return tag;
            }
            if (typeof tag.name === 'string') {
              return tag.name;
            }
            if (typeof tag.label === 'string') {
              return tag.label;
            }
            return String(tag);
          })
          .filter((tag: string | null): tag is string => Boolean(tag))
      : [];

    const lastChapter = (() => {
      if (typeof novel.last_chapter === 'string') {
        return novel.last_chapter;
      }
      if (novel.last_chapter && typeof novel.last_chapter.title === 'string') {
        return novel.last_chapter.title;
      }
      if (novel.latest_chapter && typeof novel.latest_chapter.title === 'string') {
        return novel.latest_chapter.title;
      }
      return 'No chapters yet';
    })();

    const resolveTimestamp = (value: unknown): string | null =>
      typeof value === 'string' && value.length > 0 ? value : null;

    const lastUpdated =
      resolveTimestamp(novel.last_updated) ??
      resolveTimestamp(novel.updated_at) ??
      resolveTimestamp(novel.modified_at) ??
      resolveTimestamp(novel.created_at) ??
      new Date().toISOString();

    const cover = (() => {
      if (typeof novel.cover_image === 'string' && novel.cover_image.length > 0) {
        return novel.cover_image;
      }
      if (typeof novel.cover === 'string' && novel.cover.length > 0) {
        return novel.cover;
      }
      if (typeof novel.cover_image_url === 'string' && novel.cover_image_url.length > 0) {
        return novel.cover_image_url;
      }
      return DEFAULT_NOVEL_COVER_PLACEHOLDER;
    })();

    const statusRaw = typeof novel.status === 'string' ? novel.status.toLowerCase() : '';
    const status: 'Ongoing' | 'Completed' = statusRaw === 'completed' ? 'Completed' : 'Ongoing';

    const numeric = (value: unknown, fallback = 0) => {
      const numberValue = Number(value);
      return Number.isFinite(numberValue) ? numberValue : fallback;
    };

    return {
      id: numeric(novel.id),
      slug: String(novel.slug ?? ''),
      title: String(novel.title ?? 'Untitled'),
      lastChapter,
      lastEdited: lastUpdated,
      wordCount: numeric(novel.word_count ?? novel.words),
      status,
      genre: resolvedPrimaryGenre?.name ?? '',
      chapters: numeric(novel.chapters ?? novel.chapter_count ?? novel.chapterCount ?? novel.chapters_count ?? novel.total_chapters),
      words: numeric(novel.words ?? novel.word_count),
      views: numeric(novel.views ?? novel.view_count),
      collections: numeric(novel.collections ?? novel.bookmarks),
      rating: numeric(novel.rating ?? novel.average_rating ?? novel.avg_rating),
      lastUpdated,
      cover,
      description: String(novel.synopsis ?? novel.description ?? ''),
      tags,
      progress: numeric(novel.progress ?? novel.completion_progress),
      primaryGenre: resolvedPrimaryGenre,
      contentType: novel.content_type ?? undefined,
      language: novel.language ?? undefined,
      plannedLength: novel.planned_length ?? undefined,
      maturityRating: novel.maturity_rating ?? undefined,
    };
  };

  private mapAuthorNovels = (data: unknown): Project[] => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(this.transformAuthorNovel);
  };

  private async createRequest(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<{ request: Promise<Response>; meta: HandleRequestMeta }> {
    const {
      method = 'GET',
      body,
      headers,
      requiresAuth = true,
      retryOnUnauthorized = true,
      credentials = 'include',
      ...rest
    } = options;

    const requestHeaders = buildHeaders(headers);
    let requestBody: BodyInit | undefined;

    if (body instanceof FormData) {
      requestBody = body;
    } else if (body !== undefined && body !== null && typeof body !== 'string') {
      requestHeaders.set('Content-Type', 'application/json');
      requestBody = JSON.stringify(body as any);
    } else if (typeof body === 'string') {
      requestHeaders.set('Content-Type', requestHeaders.get('Content-Type') ?? 'application/json');
      requestBody = body;
    }

    let accessToken: string | null = null;
    if (requiresAuth) {
      accessToken = await getAuthToken();
      if (accessToken) {
        requestHeaders.set('Authorization', `Bearer ${accessToken}`);
      }
    }

    const requestInit: RequestInit = {
      method,
      body: requestBody,
      headers: requestHeaders,
      credentials,
      ...rest,
    };

    const execute = () => fetch(`${API_BASE_URL}${endpoint}`, requestInit);

    return {
      request: execute(),
      meta: {
        requiresAuth,
        retryOnUnauthorized,
        retry:
          requiresAuth
            ? async (token: string) => {
                requestHeaders.set('Authorization', `Bearer ${token}`);
                return execute();
              }
            : undefined,
      },
    };
  }

  private async handleRequest<T>(request: Promise<Response>, meta: HandleRequestMeta): Promise<ApiResponse<T>> {
    let response: Response;

    try {
      response = await request;
    } catch (error: any) {
      throw new ApiError(error?.message || 'Network error', 0);
    }

    if (response.status === 401 && meta.requiresAuth && meta.retryOnUnauthorized && meta.retry) {
      const refreshedToken = await refreshAuthToken();
      if (refreshedToken) {
        response = await meta.retry(refreshedToken);
      } else {
        clearAuthTokens();
      }
    }

    const data = await parseResponseBody(response);

    if (!response.ok) {
      // Log the full error response for debugging
      console.error('🔧 API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        dataType: typeof data,
        url: response.url
      });
      
      // Also log the data separately for easier viewing
      if (data && typeof data === 'object') {
        console.error('🔧 API Error Data Details:', JSON.stringify(data, null, 2));
      }
      
      const detailMessage =
        (typeof data === 'object' && data !== null && 'detail' in data && typeof (data as any).detail === 'string'
          ? (data as any).detail
          : undefined) ||
        (typeof data === 'string' && data ? data : undefined) ||
        response.statusText ||
        'Request failed';

      // Better error messages for authentication issues
      let userFriendlyMessage = detailMessage;
      if (response.status === 401) {
        userFriendlyMessage = 'Please log in to access this content';
      } else if (response.status === 403) {
        userFriendlyMessage = 'You don\'t have permission to access this content';
      }

      throw new ApiError(userFriendlyMessage, response.status, data ?? undefined);
    }

    // Normalize paginated list responses from DRF: { count, next, previous, results: [...] }
    const normalizedData =
      (data && typeof data === 'object' && Array.isArray((data as any).results)
        ? (data as any).results
        : data);

    return {
      data: normalizedData as T,
      status: response.status,
      message:
        (typeof data === 'object' && data !== null && 'message' in data && typeof (data as any).message === 'string'
          ? (data as any).message
          : undefined) || undefined,
    };
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { request, meta } = await this.createRequest(endpoint, options);
    return this.handleRequest<T>(request, meta);
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens & { user?: unknown }>> {
    const response = await this.request<AuthTokens & { user?: unknown }>(`/accounts/login/`, {
      method: 'POST',
      body: credentials,
      requiresAuth: false,
      retryOnUnauthorized: false,
    });

    const tokens = extractTokens((response.data ?? {}) as Record<string, unknown>);
    if (tokens?.access) {
      storeAuthTokens({ accessToken: tokens.access, refreshToken: tokens.refresh ?? null });
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>(`/accounts/logout/`, {
      method: 'POST',
      body: {},
    });

    clearAuthTokens();
    return response;
  }

  async refreshToken(): Promise<ApiResponse<AuthTokens | null>> {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 400);
    }

    const response = await this.request<AuthTokens>(`/accounts/token/refresh/`, {
      method: 'POST',
      body: { refresh: refreshToken },
      requiresAuth: false,
      retryOnUnauthorized: false,
    });

    const tokens = extractTokens((response.data ?? {}) as Record<string, unknown>);
    if (tokens?.access) {
      storeAuthTokens({ accessToken: tokens.access, refreshToken: tokens.refresh ?? refreshToken });
    }

    return {
      ...response,
      data: tokens,
    };
  }

  async getMyNovels(): Promise<ApiResponse<Project[]>> {
    const response = await this.request<unknown>(`/author/novels/`);
    const novels = this.mapAuthorNovels(response.data);

    return {
      ...response,
      data: novels,
    } as ApiResponse<Project[]>;
  }

  async getAuthorNovels(): Promise<ApiResponse<Project[]>> {
    return this.getMyNovels();
  }

  async getAuthorNovelDetail(slug: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/author/novels/${slug}/`);
  }

  async createNovel(novelData: AuthorNovelDraftPayload): Promise<ApiResponse<Project>> {
    const response = await this.request<unknown>(`/author/novels/`, {
      method: 'POST',
      body: novelData,
    });

    const project = this.transformAuthorNovel(response.data);

    return {
      ...response,
      data: project,
    } as ApiResponse<Project>;
  }

  async updateNovel(slug: string, novelData: AuthorNovelUpdatePayload): Promise<ApiResponse<Project>> {
    console.log('🔧 updateNovel called with:', { slug, novelData });
    
    try {
      const response = await this.request<unknown>(`/author/novels/${slug}/`, {
        method: 'PATCH',
        body: novelData,
      });

      const project = this.transformAuthorNovel(response.data);

      return {
        ...response,
        data: project,
      } as ApiResponse<Project>;
    } catch (error: any) {
      console.error('🔧 updateNovel ERROR:', {
        error,
        status: error?.status,
        message: error?.message,
        data: error?.data
      });
      throw error; // Re-throw the error
    }
  }

  async uploadNovelImages(
    novelId: number,
    images: { cover: File | null }
  ): Promise<ApiResponse<unknown>> {
    if (!images.cover) {
      throw new Error('A cover image file is required to upload.');
    }

    const formData = new FormData();
    formData.append('novel_id', novelId.toString());
    formData.append('cover_image', images.cover);

    return this.request(`/novel/novel-image-upload/`, {
      method: 'POST',
      body: formData,
    });
  }

  async getNovels(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>(`/novels/`);
  }

  async getChapters(
    novelSlug: string,
    options?: { page?: number; pageSize?: number; status?: 'draft' | 'published' }
  ): Promise<ApiResponse<Chapter[]>> {
    let url = `/novels/${novelSlug}/chapters/`;
    const params = new URLSearchParams();
    
    if (options?.page) {
      params.append('page', String(options.page));
    }
    if (options?.pageSize) {
      params.append('page_size', String(options.pageSize));
    }
    if (options?.status) {
      params.append('status', options.status);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await this.request<any[]>(url);
    
    // Map backend response to frontend Chapter interface
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map(chapter => this.mapBackendChapterToFrontend(chapter));
    }
    
    return response;
  }

  async createChapter(novelSlug: string, chapterData: Partial<Chapter>): Promise<ApiResponse<Chapter>> {
    // Map frontend Chapter to backend format
    const backendData: any = {};
    if (chapterData.title) backendData.title = chapterData.title;
    if (chapterData.status === "published") backendData.is_published = true;
    if (chapterData.status === "draft") backendData.is_published = false;
    if (chapterData.order !== undefined) backendData.number = chapterData.order;
    if (chapterData.content) backendData.content_html = chapterData.content;
    if (chapterData.contentDelta) backendData.content_delta = chapterData.contentDelta;
    
    const response = await this.request<any>(`/novels/${novelSlug}/chapters/`, {
      method: 'POST',
      body: backendData,
    });
    
    // Map backend response to frontend Chapter interface
    if (response.data) {
      response.data = this.mapBackendChapterToFrontend(response.data);
    }
    
    return response;
  }

  private mapBackendChapterToFrontend(backendChapter: any): Chapter {
    const paragraphs = backendChapter.paragraphs ? backendChapter.paragraphs.map((p: any) => p.text) : [];
    const contentHtml = backendChapter.content_html ?? (paragraphs.length ? paragraphs.join('\n\n') : '');
    const heroImageUrl = backendChapter.hero_image_url ?? backendChapter.hero_image ?? null;
    const createdAt = backendChapter.created_at ?? backendChapter.createdAt ?? null;
    const publishedAtRaw =
      backendChapter.published_at ??
      backendChapter.publishedAt ??
      (backendChapter.is_published ? createdAt : null);
    const slug =
      typeof backendChapter.slug === 'string' && backendChapter.slug.length > 0
        ? backendChapter.slug
        : typeof backendChapter.chapter_slug === 'string' && backendChapter.chapter_slug.length > 0
          ? backendChapter.chapter_slug
          : typeof backendChapter.slugified_title === 'string' && backendChapter.slugified_title.length > 0
            ? backendChapter.slugified_title
            : backendChapter.id != null
              ? String(backendChapter.id)
              : null;

    return {
      id: backendChapter.id,
      slug,
      title: backendChapter.title,
      wordCount: backendChapter.word_count || 0,
      publishedAt: publishedAtRaw ?? null,
      status: backendChapter.is_published ? "published" : "draft",
      order: backendChapter.number || 1,
      content: contentHtml,
      contentDelta: backendChapter.content_delta ?? null,
      images: heroImageUrl ? [heroImageUrl] : [],
      heroImageUrl,
    };
  }

  async updateChapter(chapterId: number, chapterData: Partial<Chapter>): Promise<ApiResponse<Chapter>> {
    // Map frontend Chapter to backend format
    const backendData: any = {};
    if (chapterData.title) backendData.title = chapterData.title;
    if (chapterData.status === "published") backendData.is_published = true;
    if (chapterData.status === "draft") backendData.is_published = false;
    if (chapterData.order !== undefined) backendData.number = chapterData.order;
    
    // Use PATCH for partial updates to avoid backend 400s for missing required fields in PUT
    const response = await this.request<any>(`/chapters/${chapterId}/`, {
      method: 'PATCH',
      body: backendData,
    });
    
    // Map backend response to frontend Chapter interface
    if (response.data) {
      response.data = this.mapBackendChapterToFrontend(response.data);
    }
    
    return response;
  }

  async autosaveChapter(
    chapterId: number,
    chapterData: ChapterAutosavePayload
  ): Promise<ApiResponse<ChapterAutosaveResponse>> {
    return this.request<ChapterAutosaveResponse>(`/chapters/${chapterId}/autosave/`, {
      method: 'POST',
      body: chapterData,
    });
  }

  async deleteChapter(chapterId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/chapters/${chapterId}/`, {
      method: 'DELETE',
    });
  }

  async getPopularNovels(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/trending/`);
  }

  async getLatestReleases(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/novels/latest/`);
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>(`/dashboard/stats/`);
  }

  async getPosts(): Promise<ApiResponse<Post[]>> {
    return this.request<Post[]>(`/posts/`);
  }

  async createPost(postData: PostCreate): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/`, {
      method: 'POST',
      body: postData,
    });
  }

  async getFeaturedContent(params?: Record<string, string | number | boolean>): Promise<ApiResponse<FeaturedItem[]>> {
    const query = buildQueryString(params);
    return this.request<FeaturedItem[]>(`/featured/${query}`);
  }

  async getBookmarks(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Bookmark[]>> {
    const query = buildQueryString(params);
    return this.request<Bookmark[]>(`/bookmarks/${query}`);
  }

  async getTags(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Tag[]>> {
    console.log('🔧 FIXED getTags called with params:', params);
    // Handle pagination - fetch all pages
    let allTags: Tag[] = [];
    let url = `/tags/`;
    
    // Add any additional params to the first request
    if (params) {
      const query = buildQueryString(params);
      url += query;
    }
    console.log('🔧 FIXED getTags initial URL:', url);
    
    try {
      while (url) {
        console.log('🔧 FIXED getTags requesting:', url);
        
        // Request the full paginated response
        const response = await this.request<{
            count: number;
            next: string | null;
            previous: string | null;
            results: Tag[];
          }>(url);
        
        console.log('🔧 FIXED getTags response:', { status: response.status, dataExists: !!response.data, resultsCount: Array.isArray(response.data) ? response.data.length : 'paginated object' });
        console.log('🔧 FIXED getTags response.data structure:', response.data);
        
        if (response.data && response.status >= 200 && response.status < 300) {
          // The handleRequest method extracts results array, so response.data is the results array
          if (Array.isArray(response.data)) {
            allTags = [...allTags, ...response.data];
            console.log('🔧 FIXED getTags collected:', response.data.length, 'tags, total now:', allTags.length);
            
            // Check if we should try to get more pages
            // If we got less than 10 items, this is definitely the last page
            if (response.data.length < 10) {
              console.log('🔧 FIXED getTags stopping - got less than 10 items:', response.data.length);
              url = null;
            } else {
              // Got exactly 10 items - be conservative about requesting more
              const currentUrl = new URL(url.startsWith('http') ? url : `http://localhost:8000/api${url}`);
              const currentPage = parseInt(currentUrl.searchParams.get('page') || '1');
              const nextPage = currentPage + 1;
              
              // Be more conservative - if we've already collected a lot of tags, stop to avoid 404s
              if (allTags.length >= 500) {
                console.log('🔧 FIXED getTags stopping - collected enough tags:', allTags.length);
                url = null;
              } else {
                currentUrl.searchParams.set('page', nextPage.toString());
                
                // Extract path for next request
                let nextPath = currentUrl.pathname + currentUrl.search;
                if (nextPath.startsWith('/api/')) {
                  nextPath = nextPath.substring(4);
                }
                url = nextPath;
                console.log('🔧 FIXED getTags next page URL:', nextPath, 'Total so far:', allTags.length);
              }
            }
          } else {
            console.log('🔧 FIXED getTags response.data is not an array:', typeof response.data);
            url = null;
          }
        } else {
          // If any request fails, return the error response
          return {
            data: [] as Tag[],
            status: response.status,
            message: response.message || 'Failed to fetch tags'
          };
        }
      }
      
      console.log('🔧 FIXED getTags final result:', allTags.length, 'tags');
      return {
        data: allTags,
        status: 200,
        message: `Fetched ${allTags.length} tags successfully`
      };
    } catch (error: any) {
      console.log('🔧 FIXED getTags caught error:', { 
        error, 
        status: error?.status, 
        message: error?.message,
        type: typeof error,
        isApiError: error?.constructor?.name
      });
      
      // Handle 404 errors gracefully (end of pagination)
      // Check multiple ways a 404 might be represented
      const is404Error = error?.status === 404 || 
                        error?.message?.includes('Invalid page') ||
                        error?.message?.includes('404') ||
                        error?.message?.includes('Not Found');
      
      if (is404Error) {
        console.log('🔧 FIXED getTags reached end of pages (404), returning collected results:', allTags.length, 'tags');
        return {
          data: allTags,
          status: 200,
          message: `Fetched ${allTags.length} tags successfully (stopped at end of pagination)`
        };
      }
      
      console.error('🔧 FIXED getTags ERROR (not 404):', error);
      return {
        data: allTags.length > 0 ? allTags : [] as Tag[], // Return what we have if we collected some data
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async createTag(payload: Partial<Tag>): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/`, {
      method: 'POST',
      body: payload,
    });
  }

  async updateTag(tagId: number, payload: Partial<Tag>): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${tagId}/`, {
      method: 'PUT',
      body: payload,
    });
  }

  async deleteTag(tagId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/tags/${tagId}/`, {
      method: 'DELETE',
    });
  }

  async getGenres(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Genre[]>> {
    console.log('🔧 FIXED getGenres called with params:', params);
    // Handle pagination - fetch all pages
    let allGenres: Genre[] = [];
    let url = `/genres/`;
    
    // Add any additional params to the first request
    if (params) {
      const query = buildQueryString(params);
      url += query;
    }
    console.log('🔧 FIXED getGenres initial URL:', url);
    
    try {
      while (url) {
        console.log('🔧 FIXED getGenres requesting:', url);
        // Request the full paginated response
        const response = await this.request<{
          count: number;
          next: string | null;
          previous: string | null;
          results: Genre[];
        }>(url);
        
        console.log('🔧 FIXED getGenres response:', { status: response.status, dataExists: !!response.data, resultsCount: Array.isArray(response.data) ? response.data.length : 'paginated object' });
        console.log('🔧 FIXED getGenres response.data structure:', response.data);
        
        if (response.data && response.status >= 200 && response.status < 300) {
          // The handleRequest method extracts results array, so response.data is the results array
          if (Array.isArray(response.data)) {
            allGenres = [...allGenres, ...response.data];
            console.log('🔧 FIXED getGenres collected:', response.data.length, 'genres, total now:', allGenres.length);
            
            // Check if we should try to get more pages
            // If we got less than 10 items, this is definitely the last page
            if (response.data.length < 10) {
              console.log('🔧 FIXED getGenres stopping - got less than 10 items:', response.data.length);
              url = null;
            } else {
              // Got exactly 10 items - be conservative about requesting more
              const currentUrl = new URL(url.startsWith('http') ? url : `http://localhost:8000/api${url}`);
              const currentPage = parseInt(currentUrl.searchParams.get('page') || '1');
              const nextPage = currentPage + 1;
              
              // Be more conservative - if we've already collected enough genres, stop to avoid 404s
              if (allGenres.length >= 50) {
                console.log('🔧 FIXED getGenres stopping - collected enough genres:', allGenres.length);
                url = null;
              } else {
                currentUrl.searchParams.set('page', nextPage.toString());
                
                // Extract path for next request
                let nextPath = currentUrl.pathname + currentUrl.search;
                if (nextPath.startsWith('/api/')) {
                  nextPath = nextPath.substring(4);
                }
                url = nextPath;
                console.log('🔧 FIXED getGenres next page URL:', nextPath, 'Total so far:', allGenres.length);
              }
            }
          } else {
            console.log('🔧 FIXED getGenres response.data is not an array:', typeof response.data);
            url = null;
          }
        } else {
          // If any request fails, return the error response
          return {
            data: [] as Genre[],
            status: response.status,
            message: response.message || 'Failed to fetch genres'
          };
        }
      }
      
      console.log('🔧 FIXED getGenres final result:', allGenres.length, 'genres');
      return {
        data: allGenres,
        status: 200,
        message: `Fetched ${allGenres.length} genres successfully`
      };
    } catch (error: any) {
      console.log('🔧 FIXED getGenres caught error:', { 
        error, 
        status: error?.status, 
        message: error?.message,
        type: typeof error,
        isApiError: error?.constructor?.name
      });
      
      // Handle 404 errors gracefully (end of pagination)
      // Check multiple ways a 404 might be represented
      const is404Error = error?.status === 404 || 
                        error?.message?.includes('Invalid page') ||
                        error?.message?.includes('404') ||
                        error?.message?.includes('Not Found');
      
      if (is404Error) {
        console.log('🔧 FIXED getGenres reached end of pages (404), returning collected results:', allGenres.length, 'genres');
        return {
          data: allGenres,
          status: 200,
          message: `Fetched ${allGenres.length} genres successfully (stopped at end of pagination)`
        };
      }
      
      console.error('🔧 FIXED getGenres ERROR (not 404):', error);
      return {
        data: allGenres.length > 0 ? allGenres : [] as Genre[], // Return what we have if we collected some data
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async createGenre(payload: Partial<Genre>): Promise<ApiResponse<Genre>> {
    return this.request<Genre>(`/genres/`, {
      method: 'POST',
      body: payload,
    });
  }

  async updateGenre(genreId: number, payload: Partial<Genre>): Promise<ApiResponse<Genre>> {
    return this.request<Genre>(`/genres/${genreId}/`, {
      method: 'PUT',
      body: payload,
    });
  }

  async deleteGenre(genreId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/genres/${genreId}/`, {
      method: 'DELETE',
    });
  }

  async getReviews(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Review[]>> {
    const query = buildQueryString(params);
    return this.request<Review[]>(`/reviews/${query}`);
  }

  async createReview(payload: Partial<Review>): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/`, {
      method: 'POST',
      body: payload,
    });
  }

  async updateReview(reviewId: number, payload: Partial<Review>): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${reviewId}/`, {
      method: 'PUT',
      body: payload,
    });
  }

  async deleteReview(reviewId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/reviews/${reviewId}/`, {
      method: 'DELETE',
    });
  }

  async getChapterStats(chapterId: number | string): Promise<ApiResponse<ChapterStats>> {
    return this.request<ChapterStats>(`/chapters/${chapterId}/stats/`);
  }

  async getComments(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Comment[]>> {
    const query = buildQueryString(params);
    return this.request<Comment[]>(`/comments/${query}`);
  }

  async createComment(payload: CommentCreate): Promise<ApiResponse<Comment>> {
    return this.request<Comment>(`/comments/`, {
      method: 'POST',
      body: payload,
    });
  }

  async updateComment(commentId: number, payload: Partial<CommentCreate>): Promise<ApiResponse<Comment>> {
    return this.request<Comment>(`/comments/${commentId}/`, {
      method: 'PUT',
      body: payload,
    });
  }

  async deleteComment(commentId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/comments/${commentId}/`, {
      method: 'DELETE',
    });
  }

  async getCommentThread(commentId: number | string): Promise<ApiResponse<CommentThreadNode>> {
    return this.request<CommentThreadNode>(`/comments/${commentId}/thread/`);
  }

  async getCommentsForPost(postId: number | string): Promise<ApiResponse<Comment[]>> {
    const query = buildQueryString({ post: postId });
    return this.request<Comment[]>(`/comments/${query}`);
  }

  async requestPasswordReset(payload: { email: string }): Promise<ApiResponse<unknown>> {
    return this.request(`/accounts/password-reset/`, {
      method: 'POST',
      body: payload,
      requiresAuth: false,
    });
  }

  async confirmPasswordReset(payload: Record<string, unknown>): Promise<ApiResponse<unknown>> {
    return this.request(`/accounts/password-reset/confirm/`, {
      method: 'POST',
      body: payload,
      requiresAuth: false,
    });
  }

  async register(payload: { name: string; email: string; dob: string; gender: string; password: string }): Promise<ApiResponse<unknown>> {
    return this.request(`/accounts/register/`, {
      method: 'POST',
      body: payload,
      requiresAuth: false,
    });
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(`/accounts/profile/`);
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(`/accounts/profile/`, {
      method: 'PATCH',
      body: payload,
    });
  }

  async getChapterById(chapterId: number | string): Promise<ApiResponse<Chapter>> {
    const response = await this.request<any>(`/chapters/${chapterId}/`);

    if (response.data) {
      response.data = this.mapBackendChapterToFrontend(response.data);
    }

    return response as ApiResponse<Chapter>;
  }

  async getChapterBySlug(novelSlug: string, chapterSlug: string): Promise<ApiResponse<Chapter>> {
    const response = await this.request<any>(`/novels/${novelSlug}/chapters/${chapterSlug}/`);

    if (response.data) {
      response.data = this.mapBackendChapterToFrontend(response.data);
    }

    return response as ApiResponse<Chapter>;
  }

  async getSocialProviders(): Promise<ApiResponse<SocialProvider[]>> {
    return this.request<SocialProvider[]>(`/accounts/social/providers/`, {
      requiresAuth: false,
      retryOnUnauthorized: false,
    });
  }

  async startSocialLogin(
    provider: string,
    payload: { redirect_uri: string; state?: string }
  ): Promise<ApiResponse<SocialLoginSession>> {
    return this.request<SocialLoginSession>(`/accounts/social/${provider}/login/`, {
      method: 'POST',
      body: payload,
      requiresAuth: false,
      retryOnUnauthorized: false,
    });
  }

  async completeSocialLogin(
    provider: string,
    payload: Record<string, unknown>
  ): Promise<ApiResponse<AuthTokens & { user?: unknown }>> {
    const response = await this.request<AuthTokens & { user?: unknown }>(
      `/accounts/social/${provider}/callback/`,
      {
        method: 'POST',
        body: payload,
        requiresAuth: false,
        retryOnUnauthorized: false,
      }
    );

    const tokens = extractTokens((response.data ?? {}) as Record<string, unknown>);
    if (tokens?.access) {
      storeAuthTokens({ accessToken: tokens.access, refreshToken: tokens.refresh ?? null });
    }

    return response;
  }

  async getNotifications(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Notification[]>> {
    const query = buildQueryString(params);
    return this.request<Notification[]>(`/notifications/${query}`);
  }

  async markNotificationRead(notificationId: number | string): Promise<ApiResponse<Notification>> {
    return this.request<Notification>(`/notifications/${notificationId}/read/`, {
      method: 'POST',
      body: {},
    });
  }

  async markAllNotificationsRead(): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/mark-all-read/`, {
      method: 'POST',
      body: {},
    });
  }
}

export const api = new ApiService();
export type ApiServiceType = ApiService;


