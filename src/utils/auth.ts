import { API_BASE_URL } from '@/config/api';

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

const isBrowser = () => typeof window !== 'undefined';

const decodeBase64 = (value: string) => {
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(value);
  }

  const buffer = (globalThis as any).Buffer as { from(input: string, encoding: string): { toString(encoding: string): string } } | undefined;
  if (buffer) {
    return buffer.from(value, 'base64').toString('utf-8');
  }

  throw new Error('Unable to decode base64 token payload');
};

const decodeToken = (token: string) => {
  try {
    const [, payload] = token.split('.');
    const decodedPayload = decodeBase64(payload);

    return JSON.parse(decodedPayload) as {
      exp?: number;
      [key: string]: unknown;
    };
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 <= Date.now();
};

export const storeAuthTokens = (tokens: { accessToken?: string | null; refreshToken?: string | null }) => {
  if (!isBrowser()) return;
  const { accessToken, refreshToken } = tokens;
  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    // Mirror in cookie for middleware usage
    document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getStoredAccessToken = (): string | null => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getStoredRefreshToken = (): string | null => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearAuthTokens = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Clear cookie mirror
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    // Django SimpleJWT expects POST with JSON body { refresh }
    const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
      credentials: 'include',
    });

    if (!response.ok) {
      clearAuthTokens();
      return null;
    }

    const data = await response.json().catch(() => ({}));
    const accessToken = (data?.access || data?.token || data?.accessToken) as string | undefined;
    const nextRefreshToken = (data?.refresh || data?.refreshToken) as string | undefined;

    if (accessToken) {
      storeAuthTokens({ accessToken, refreshToken: nextRefreshToken ?? refreshToken });
      return accessToken;
    }

    return null;
  } catch (error) {
    console.error('Failed to refresh auth token', error);
    return null;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  const storedToken = getStoredAccessToken();

  if (storedToken && !isTokenExpired(storedToken)) {
    return storedToken;
  }

  return refreshAuthToken();
};

export const isLoggedIn = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return Boolean(token);
};

// Additional utility functions for the authentication context
export const getToken = (): string | null => {
  return getStoredAccessToken();
};

export const setToken = (token: string): void => {
  storeAuthTokens({ accessToken: token });
  
  // Also set as cookie for middleware access
  if (isBrowser()) {
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 days
  }
};

export const removeToken = (): void => {
  clearAuthTokens();
  
  // Also remove cookie
  if (isBrowser()) {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = decodeToken(token);
    return payload?.exp ? payload.exp * 1000 > Date.now() : false;
  } catch {
    return false;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return decodeToken(token);
  } catch {
    return null;
  }
};

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};
