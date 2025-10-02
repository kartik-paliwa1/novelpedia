'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../../../services/api';

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Send the authorization code directly to our backend for processing
        const state = searchParams.get('state');
        
        // Use the API service to authenticate with the authorization code
        const authResponse = await api.googleOAuth(code, state || undefined);
        
        if (!authResponse.data) {
          throw new Error('Authentication failed - no data received');
        }
        
        // The API service automatically stores the tokens via storeAuthTokens()
        // No need to manually store tokens here

        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect to dashboard or intended page
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed. Please try again.');
        
        // Redirect back to login after delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9]">
      <div className="bg-[#231942]/80 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Logo */}
          <div className="bg-[#a259ec] p-3 rounded-full mb-4 inline-block">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" />
              <path
                d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
                fill="#a259ec"
              />
            </svg>
          </div>
          
          <h1 className="text-xl font-bold text-white mb-4">NovelPedia</h1>
          
          {/* Status indicator */}
          <div className="mb-4">
            {status === 'loading' && (
              <div className="animate-spin w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full mx-auto"></div>
            )}
            {status === 'success' && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            )}
          </div>
          
          <p className="text-violet-200 text-sm">{message}</p>
          
          {status === 'error' && (
            <div className="mt-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="text-violet-300 text-sm hover:underline"
              >
                Return to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}