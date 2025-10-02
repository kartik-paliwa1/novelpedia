'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LuLock } from 'react-icons/lu';
import { api, ApiError } from '../../../../src/services/api';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string|null>(null);
  const [errorMsg, setErrorMsg] = useState<string|null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMsg('Reset token is missing from the URL.');
      return;
    }

    setLoading(true);

    try {
      await api.confirmPasswordReset({ token, password: newPassword });
      setSuccessMsg('Password has been reset successfully!');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      const message = err instanceof ApiError ? err.message : err?.message || 'Something went wrong.';
      setErrorMsg(message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9]">
      <div className="w-[90vw] max-w-md bg-[#231942]/80 rounded-2xl shadow-xl px-8 py-10">
        <h2 className="text-xl font-bold text-white text-center mb-4">Reset Your Password</h2>

        {successMsg && <p className="text-green-400 text-sm mb-4 text-center">{successMsg}</p>}
        {errorMsg && <p className="text-red-400 text-sm mb-4 text-center">{errorMsg}</p>}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm text-violet-200 mb-1">New Password</label>
            <div className="relative">
              <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
              <input
                type="password"
                required
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-fuchsia-700 to-pink-500 text-white font-semibold hover:from-fuchsia-700 hover:to-pink-600 transition"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
