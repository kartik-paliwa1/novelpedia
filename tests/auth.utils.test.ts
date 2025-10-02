import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as auth from '@/utils/auth';

const createToken = (expiresInSeconds: number) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    })
  ).toString('base64');
  return `${header}.${payload}.signature`;
};

interface StorageShape {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

const createLocalStorage = (): StorageShape => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  } satisfies StorageShape;
};

const originalFetch = global.fetch;

beforeEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
  if (originalFetch) {
    vi.stubGlobal('fetch', originalFetch);
  }
  const localStorageMock = createLocalStorage();
  (globalThis as any).window = {
    localStorage: localStorageMock,
  };
  const cookieStore = { value: '' };
  Object.defineProperty(global, 'document', {
    configurable: true,
    value: {
      get cookie() {
        return cookieStore.value;
      },
      set cookie(value: string) {
        cookieStore.value = value;
      },
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalFetch) {
    vi.stubGlobal('fetch', originalFetch);
  }
  delete (globalThis as any).window;
  delete (globalThis as any).document;
});

describe('auth utilities', () => {
  it('detects expired and valid tokens correctly', () => {
    const validToken = createToken(60);
    const expiredToken = createToken(-60);

    expect(auth.isTokenExpired(validToken)).toBe(false);
    expect(auth.isTokenExpired(expiredToken)).toBe(true);
  });

  it('stores and clears tokens from localStorage', () => {
    auth.storeAuthTokens({ accessToken: 'access', refreshToken: 'refresh' });

    expect(auth.getStoredAccessToken()).toBe('access');
    expect(auth.getStoredRefreshToken()).toBe('refresh');

    auth.clearAuthTokens();
    expect(auth.getStoredAccessToken()).toBeNull();
    expect(auth.getStoredRefreshToken()).toBeNull();
  });

  it('refreshes auth token when stored token is expired', async () => {
    const expiredToken = createToken(-10);
    const refreshToken = 'refresh-token';
    window.localStorage.setItem('token', expiredToken);
    window.localStorage.setItem('refreshToken', refreshToken);

    const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ access: 'fresh-token', refresh: 'next-refresh' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const token = await auth.getAuthToken();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(token).toBe('fresh-token');
    expect(window.localStorage.getItem('token')).toBe('fresh-token');
  });

  it('reports login status based on available token', async () => {
    window.localStorage.setItem('token', createToken(60));

    expect(await auth.isLoggedIn()).toBe(true);

    window.localStorage.setItem('token', createToken(-60));
    vi.spyOn(auth, 'refreshAuthToken').mockResolvedValue(null);

    expect(await auth.isLoggedIn()).toBe(false);
  });
});
