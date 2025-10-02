'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuMail, LuLock, LuEye, LuEyeOff } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { DiApple } from 'react-icons/di';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';
import Link from 'next/link';
import { api, ApiError } from '../../../../src/services/api';


export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllSocial, setShowAllSocial] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifier.trim() || !form.password.trim()) {
      alert('Please enter both username/email and password.');
      return;
    }
    setLoading(true);
    try {
      await api.login({
        identifier: form.identifier.trim(),
        password: form.password,
      });

      alert('Login successful!');
      router.push('/');

    } catch (err: any) {
      const message = err instanceof ApiError ? err.message : err?.message || err;
      alert('Login failed: ' + message);
    }
    setLoading(false);
  };

  const socialButtons = [
    {
      key: 'google',
      icon: <FcGoogle className="text-lg" />,
      text: 'Continue with Google',
    },
    {
      key: 'apple',
      icon: <DiApple className="text-lg" />,
      text: 'Continue with Apple',
    },
    {
      key: 'twitter',
      icon: <FaXTwitter className="text-lg" />,
      text: 'Continue with X',
    },
    {
      key: 'facebook',
      icon: <FaFacebook className="text-lg" />,
      text: 'Continue with Facebook',
    },
  ];

  const visibleSocialButtons = showAllSocial
    ? socialButtons
    : socialButtons.slice(0, 2);

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
          {visibleSocialButtons.map((btn) => (
            <button
              key={btn.key}
              className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition"
            >
              {btn.icon}
              {btn.text}
            </button>
          ))}
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
          <Link href="/auth/signup" className="text-white underline hover:text-violet-200">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}