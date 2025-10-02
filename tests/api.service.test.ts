import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/auth', () => ({
  getAuthToken: vi.fn(),
  refreshAuthToken: vi.fn(),
  getStoredRefreshToken: vi.fn(),
  storeAuthTokens: vi.fn(),
  clearAuthTokens: vi.fn(),
}));

import { ApiError, ApiService, AuthorNovelDraftPayload } from '@/services/api';
import * as authUtils from '@/utils/auth';

const mockedAuth = vi.mocked(authUtils, true);

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

const emptyResponse = (status: number, init: ResponseInit = {}) =>
  new Response(null, {
    status,
    ...init,
  });

const originalFetch = global.fetch;

beforeEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
  if (originalFetch) {
    vi.stubGlobal('fetch', originalFetch);
  }
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalFetch) {
    vi.stubGlobal('fetch', originalFetch);
  }
});

describe('ApiService', () => {
  it('attaches bearer token to authenticated requests', async () => {
    const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();
    fetchMock.mockResolvedValue(
      jsonResponse([
        {
          id: 1,
          slug: 'test-novel',
          title: 'Test Novel',
          cover_image: 'https://example.com/cover.jpg',
          synopsis: 'A test synopsis',
          status: 'Draft',
          last_updated: '2025-09-26T12:00:00Z',
          tags: ['Action', 'Adventure'],
          primary_genre: { id: 2, name: 'Action' },
        },
      ])
    );
    vi.stubGlobal('fetch', fetchMock);

    mockedAuth.getAuthToken.mockResolvedValue('test-access');

    const service = new ApiService();
    const response = await service.getMyNovels();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.example.test/author/novels/');
    const headers = (init?.headers ?? null) as Headers | null;
    expect(headers?.get('Authorization')).toBe('Bearer test-access');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data[0]).toMatchObject({
      id: 1,
      slug: 'test-novel',
      title: 'Test Novel',
      cover: 'https://example.com/cover.jpg',
      description: 'A test synopsis',
      status: 'Draft',
      primaryGenre: { id: 2, name: 'Action' },
      tags: ['Action', 'Adventure'],
    });
  });

  it('creates author novels with normalized response shape', async () => {
    const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();
    fetchMock.mockResolvedValue(
      jsonResponse({
        id: 9,
        slug: 'my-novel',
        title: 'My Novel',
        synopsis: 'Summary',
        status: 'completed',
        primary_genre: { id: 4, name: 'Drama' },
        tags: [{ id: 1, name: 'Mystery' }],
        word_count: 1200,
        last_updated: '2025-09-26T12:30:00Z',
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    mockedAuth.getAuthToken.mockResolvedValue('secret');

    const service = new ApiService();
    const payload = {
      title: 'My Novel',
      synopsis: 'Summary',
      status: 'Completed',
      primary_genre_id: 4,
      tag_ids: [1],
    } satisfies AuthorNovelDraftPayload;

    const response = await service.createNovel(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.example.test/author/novels/');
    expect(init?.method).toBe('POST');
    expect(init?.headers instanceof Headers ? init.headers.get('Authorization') : new Headers(init?.headers).get('Authorization')).toBe('Bearer secret');
    const body = init?.body as string | undefined;
    expect(typeof body).toBe('string');
    expect(body && JSON.parse(body)).toMatchObject({
      title: 'My Novel',
      synopsis: 'Summary',
      primary_genre_id: 4,
      tag_ids: [1],
      status: 'Completed',
    });

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: 9,
      slug: 'my-novel',
      title: 'My Novel',
      description: 'Summary',
      status: 'Completed',
      primaryGenre: { id: 4, name: 'Drama' },
      tags: ['Mystery'],
      wordCount: 1200,
    });
  });

  it('retries requests after refreshing the token on 401 responses', async () => {
    const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();
    fetchMock
      .mockResolvedValueOnce(emptyResponse(401))
      .mockResolvedValueOnce(jsonResponse({ value: 42 }));
    vi.stubGlobal('fetch', fetchMock);

    mockedAuth.getAuthToken.mockResolvedValue('expired-token');
    mockedAuth.refreshAuthToken.mockResolvedValue('fresh-token');

    const service = new ApiService();
    const response = await service.getDashboardStats();

    expect(mockedAuth.refreshAuthToken).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retryHeaders = fetchMock.mock.calls[1][1]?.headers as Headers | undefined;
    expect(retryHeaders?.get('Authorization')).toBe('Bearer fresh-token');
    expect(response.status).toBe(200);
  });

  it('clears tokens when logout succeeds', async () => {
    const fetchMock = vi
      .fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()
      .mockResolvedValue(emptyResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    mockedAuth.getAuthToken.mockResolvedValue('token');

    const service = new ApiService();
    await service.logout();

    expect(mockedAuth.clearAuthTokens).toHaveBeenCalledTimes(1);
  });

  it('does not request auth token for public endpoints', async () => {
    const fetchMock = vi
      .fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()
      .mockResolvedValue(emptyResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const service = new ApiService();
    await service.requestPasswordReset({ email: 'user@example.com' });

    expect(mockedAuth.getAuthToken).not.toHaveBeenCalled();
  });

  it('wraps failed requests with ApiError', async () => {
    const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();
    fetchMock.mockResolvedValue(
        jsonResponse(
          { detail: 'Nope' },
          {
            status: 400,
          }
        )
    );
    vi.stubGlobal('fetch', fetchMock);

    const service = new ApiService();

    await expect(service.getMyNovels()).rejects.toBeInstanceOf(ApiError);
  });
});
