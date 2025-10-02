// Simplified API service for Novel's Page OAuth functionality
// This is a subset of the main API service focused on authentication

// Auth token management functions
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const storeAuthTokens = (tokens: { accessToken: string; refreshToken: string | null }) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};

// Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface AuthTokens {
  access: string;
  refresh?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const extractTokens = (data: Record<string, unknown>): { access?: string; refresh?: string } | null => {
  if (!data || typeof data !== 'object') return null;
  
  const access = typeof data.access === 'string' ? data.access : undefined;
  const refresh = typeof data.refresh === 'string' ? data.refresh : undefined;
  
  return access ? { access, refresh } : null;
};

class ApiService {
  private baseURL = 'http://127.0.0.1:8000/api';

  private async request<T>(endpoint: string, options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
  } = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      requiresAuth = true,
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      let data: unknown;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const errorMessage = (data as any)?.detail || (data as any)?.error || `HTTP ${response.status}`;
        throw new ApiError(errorMessage, response.status, data);
      }

      return { data: data as T, status: response.status };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error or request failed', 0, error);
    }
  }

  // OAuth methods for Google authentication
  async googleOAuthConfig(): Promise<ApiResponse<{
    client_id: string;
    redirect_uri: string;
    scope: string;
    response_type: string;
    state?: string;
  }>> {
    return this.request(`/accounts/oauth/config/`, {
      requiresAuth: false,
    });
  }

  async googleOAuth(code: string, state?: string): Promise<ApiResponse<AuthTokens & { user?: unknown }>> {
    const response = await this.request<AuthTokens & { user?: unknown }>(`/accounts/oauth/google/`, {
      method: 'POST',
      body: { code, state },
      requiresAuth: false,
    });

    const tokens = extractTokens((response.data ?? {}) as Record<string, unknown>);
    if (tokens?.access) {
      storeAuthTokens({ accessToken: tokens.access, refreshToken: tokens.refresh ?? null });
    }

    return response;
  }

  // Login method for regular authentication
  async login(credentials: { identifier: string; password: string }): Promise<ApiResponse<AuthTokens & { user?: unknown }>> {
    const response = await this.request<AuthTokens & { user?: unknown }>(`/accounts/login/`, {
      method: 'POST',
      body: credentials,
      requiresAuth: false,
    });

    const tokens = extractTokens((response.data ?? {}) as Record<string, unknown>);
    if (tokens?.access) {
      storeAuthTokens({ accessToken: tokens.access, refreshToken: tokens.refresh ?? null });
    }

    return response;
  }
}

export const api = new ApiService();