'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LuMail, LuLock, LuEye, LuEyeOff } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { DiApple } from 'react-icons/di';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { api, ApiError, type SocialProvider } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';
import { storeAuthTokens } from '@/utils/auth';

function LoginContent() {
  const [form, setForm] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllSocial, setShowAllSocial] = useState(false);
  const [providers, setProviders] = useState<SocialProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [activeSocialProvider, setActiveSocialProvider] = useState<string | null>(null);
  const [callbackMessage, setCallbackMessage] = useState<string | null>(null);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [isCompletingSocial, setIsCompletingSocial] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      try {
        setIsLoadingProviders(true);
        const response = await api.getSocialProviders();
        if (!isMounted) return;
        const incoming = Array.isArray(response.data) ? response.data : [];
        setProviders(incoming);
      } catch (error) {
        console.warn('Unable to fetch social providers', error);
      } finally {
        if (isMounted) {
          setIsLoadingProviders(false);
        }
      }
    };

    loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Handle backend-driven OAuth redirect with tokens in URL
    const oauthSuccess = searchParams.get('oauth_success');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (oauthSuccess === 'true' && accessToken) {
      const completeOAuthLogin = async () => {
        try {
          storeAuthTokens({ accessToken, refreshToken: refreshToken ?? null });
          setCallbackMessage('Login successful! Redirecting to dashboard...');

          const redirectTo = searchParams.get('redirect') || '/dashboard';

          // Proactively load user before navigation to avoid empty state
          await checkAuth();

          // Clean sensitive params from the URL without adding history entries
          const url = new URL(window.location.href);
          url.searchParams.delete('oauth_success');
          url.searchParams.delete('access_token');
          url.searchParams.delete('refresh_token');
          url.searchParams.delete('redirect');
          window.history.replaceState({}, document.title, url.toString());

          // Redirect to destination
          router.replace(redirectTo);
        } catch (e) {
          setCallbackError('Failed to finalize login. Please try again.');
        }
      };

      void completeOAuthLogin();
      return; // Avoid also running social completion below
    }

    const provider = searchParams.get('provider');
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!provider || !code || isCompletingSocial) {
      return;
    }

    const redirectUri = `${window.location.origin}/login`;
    const storageKey = `novelpedia-social-${provider}`;
    const storedRaw = window.sessionStorage.getItem(storageKey);
    let codeVerifier: string | undefined;
    try {
      codeVerifier = storedRaw ? (JSON.parse(storedRaw)?.code_verifier as string | undefined) : undefined;
    } catch (error) {
      console.warn('Failed to parse stored social login session', error);
    }

    setIsCompletingSocial(true);
    setCallbackError(null);
    setCallbackMessage('Finalising social login…');

    const payload: Record<string, unknown> = {
      code,
      redirect_uri: redirectUri,
    };

    if (state) {
      payload.state = state;
    }
    if (codeVerifier) {
      payload.code_verifier = codeVerifier;
    }

    api
      .completeSocialLogin(provider, payload)
      .then(() => {
        window.sessionStorage.removeItem(storageKey);
        setCallbackMessage('Social login successful! Redirecting…');
        setTimeout(() => {
          router.replace('/login');
          router.push('/');
        }, 800);
      })
      .catch((err: unknown) => {
        const message = err instanceof ApiError ? err.message : (err as Error)?.message || 'Unable to complete social login';
        setCallbackError(message);
        setCallbackMessage(null);
      })
      .finally(() => {
        setIsCompletingSocial(false);
      });
  }, [isCompletingSocial, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifier.trim() || !form.password.trim()) {
      setCallbackError('Please enter both username/email and password.');
      return;
    }
    setCallbackError(null);
    setCallbackMessage(null);
    setLoading(true);
    try {
      // Use the authentication context for login
      await login({
        identifier: form.identifier.trim(),
        password: form.password,
      });

      setCallbackMessage('Login successful! Redirecting to dashboard...');
      
      // The auth context will handle the redirect automatically

    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : (err as Error)?.message || String(err);
      setCallbackError('Login failed: ' + message);
    }
    setLoading(false);
  };

  const fallbackProviders: SocialProvider[] = useMemo(
    () => [
      { id: 'google', name: 'Continue with Google' },
      { id: 'github', name: 'Continue with GitHub' },
      { id: 'facebook', name: 'Continue with Facebook' },
      { id: 'twitter', name: 'Continue with X' },
    ],
    []
  );

  const providerIcons = useMemo(
    () => ({
      google: <FcGoogle className="text-lg" />,
      github: <FaGithub className="text-lg" />,
      facebook: <FaFacebook className="text-lg" />,
      twitter: <FaXTwitter className="text-lg" />,
      apple: <DiApple className="text-lg" />,
      default: <LuMail className="text-lg" />,
    }),
    []
  );

  const resolvedProviders = providers.length > 0 ? providers : fallbackProviders;

  const visibleSocialButtons = showAllSocial
    ? resolvedProviders
    : resolvedProviders.slice(0, 2);

  const handleSocialLogin = async (providerId: string) => {
    if (typeof window === 'undefined') return;

    setActiveSocialProvider(providerId);
    setCallbackError(null);
    setCallbackMessage(null);

    try {
      const redirectUri = `${window.location.origin}/login`;
      const response = await api.startSocialLogin(providerId, { redirect_uri: redirectUri });
      const { authorization_url: authorizationUrl, state, code_verifier: codeVerifier } = response.data ?? {};

      if (codeVerifier || state) {
        const storagePayload = JSON.stringify({ code_verifier: codeVerifier, state });
        window.sessionStorage.setItem(`novelpedia-social-${providerId}`, storagePayload);
      }

      if (authorizationUrl) {
        window.location.href = authorizationUrl;
        return;
      }

      setCallbackError('Unable to start social login flow. Please try again later.');
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : (err as Error)?.message || 'Unable to start social login';
      setCallbackError(message);
    } finally {
      setActiveSocialProvider(null);
    }
  };

  // Show loading if checking authentication or already authenticated
  if (isLoading || isAuthenticated) {
    return <LoginLoading />;
  }

  return (
    <div className="min-h-screen flex flex-col py-10 items-center justify-center bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9]">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-[#a259ec] p-3 rounded-full mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" />
            <path
              d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
              fill="#a259ec"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">NovelPedia</h1>
        <p className="text-sm text-violet-200 mt-1">
          Welcome back! Log in to continue your reading journey
        </p>
      </div>
      <div className="w-[90vw] max-w-md bg-[#231942]/80 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {callbackMessage && (
            <p className="text-xs text-center text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
              {callbackMessage}
            </p>
          )}
          {callbackError && (
            <p className="text-xs text-center text-red-300 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {callbackError}
            </p>
          )}

          {/* Identifier */}
          <div>
            <label className="block text-violet-200 text-xs md:text-sm mb-1">
              Username or Email
            </label>
            <div className="relative">
              <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className="w-full pl-10 pr-3 py-1 md:py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label className="block text-violet-200 text-xs md:text-sm mb-1">
              Password
            </label>
            <div className="relative">
              <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-1 md:py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </div>
          {/* Forgot password */}
          <div className="flex justify-end">
          <Link href="/auth/forgotPassword" className="text-violet-300 text-xs hover:underline">
    Forgot password?
  </Link>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-fuchsia-700 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-fuchsia-700 hover:to-pink-600 transition"
          >
            {loading ? 'Logging in...' : 'Log In'}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-violet-700" />
          <span className="mx-3 text-violet-300 text-sm">OR LOG IN WITH</span>
          <div className="flex-1 h-px bg-violet-700" />
        </div>
        {/* Social Buttons */}
        <div
          className="w-full flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: showAllSocial ? 400 : 110,
            opacity: showAllSocial ? 1 : 0.95,
          }}
        >
          {isLoadingProviders && providers.length === 0 ? (
            <div className="w-full rounded-lg border border-dashed border-violet-700/60 bg-violet-900/30 px-3 py-2 text-center text-xs text-violet-200">
              Loading social providers…
            </div>
          ) : (
            visibleSocialButtons.map((provider) => {
              const icon = (providerIcons as Record<string, React.ReactNode>)[provider.id] ?? providerIcons.default;
              const label = provider.name ?? `Continue with ${provider.id}`;
              const isActive = activeSocialProvider === provider.id;

              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleSocialLogin(provider.id)}
                  disabled={Boolean(isActive) || isCompletingSocial}
                  className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
                  <span className="text-sm">{label}</span>
                </button>
              );
            })
          )}
        </div>
        {/* Show more / Show less */}
        <button
          className="mt-4 text-violet-300 text-sm hover:underline cursor-pointer"
          onClick={() => setShowAllSocial((s) => !s)}
          type="button"
        >
          {showAllSocial ? 'Show less' : 'Show more'}
        </button>
        {/* Don't have an account */}
        <div className="mt-6 text-violet-300 text-sm text-center">
          Don&apos;t have an account?
          <Link href="/signup" className="text-white underline hover:text-violet-200">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen flex flex-col py-10 items-center justify-center bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9]">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-[#a259ec] p-3 rounded-full mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" />
            <path
              d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
              fill="#a259ec"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">NovelPedia</h1>
        <p className="text-sm text-violet-200 mt-1">Loading...</p>
      </div>
      <div className="w-[90vw] max-w-md bg-[#231942]/80 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    </div>
  );
}

// Main page component wrapped with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
