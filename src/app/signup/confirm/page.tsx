'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // TODO: Implement email confirmation with the new auth system.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return alert('Please enter your email.');
    if (!code.trim()) return alert('Enter the verification code.');

    setLoading(true);
    alert('Email confirmation functionality not implemented yet.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9]">
      <div className="w-[90vw] max-w-md bg-[#231942]/80 rounded-2xl shadow-xl px-8 py-10">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Confirm Your Email
        </h2>
        <p className="text-violet-200 text-sm text-center mb-6">
          Please enter the verification code we emailed you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!email && (
            <div>
              <label className="block text-violet-200 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-violet-200 text-sm mb-1">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full px-3 py-2 bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-500 hover:to-emerald-600 transition"
          >
            {loading ? 'Confirming...' : 'Confirm Email'}
          </button>
        </form>
      </div>
    </div>
  );
}
