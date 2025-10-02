'use client';

import React, { useState } from 'react';
import { LuMail } from 'react-icons/lu';
import { api, ApiError } from '../../../../src/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.requestPasswordReset({ email });
      setSubmitted(true);
    } catch (err: any) {
      const message = err instanceof ApiError ? err.message : err?.message || 'Unknown error';
      alert(`Error: ${message}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9]">
      <div className="w-[90vw] max-w-md bg-[#231942]/80 rounded-2xl shadow-xl px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#a259ec] p-3 rounded-full mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" />
              <path
                d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
                fill="#a259ec"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Forgot Password</h2>
          <p className="text-sm text-violet-200 text-center mt-2">
            Enter your email to request a password reset
          </p>
        </div>

        {submitted ? (
          <p className="text-sm text-green-400 text-center">
            ✅ A reset link has been sent to your email.
            <br />
            Please check your inbox and click the link to reset your password.
          </p>
        ) : (
          <form className="space-y-5" onSubmit={handleRequestReset}>
            <div className="relative">
              <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
              <input
                type="email"
                placeholder="Your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-fuchsia-700 to-pink-500 text-white font-semibold rounded-lg hover:from-fuchsia-700 hover:to-pink-600 transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
