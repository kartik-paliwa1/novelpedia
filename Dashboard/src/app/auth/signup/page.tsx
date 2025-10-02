'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LuUser,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
} from 'react-icons/lu';

import { FcGoogle } from 'react-icons/fc';
import { DiApple } from 'react-icons/di';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '../../../../src/services/api';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      alert('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.register({
        username: form.name,
        email: form.email,
        password: form.password,
      });
      alert('Signup successful!');
      router.push('/');
      // Optionally reset form or redirect here
      setForm({
        name: '',
        email: '',
        dob: '',
        gender: '',
        password: '',
        confirmPassword: '',
        agree: false,
      });
    } catch (err: any) {
      const message = err instanceof ApiError ? err.message : err?.message || 'Unknown error';
      alert('Signup failed: ' + message);
    }
    setLoading(false);
  };

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
        <h1 className="text-2xl font-bold text-white">Novel Point</h1>
        <p className="text-sm text-violet-200 mt-1">
          Start your reading journey today
        </p>
      </div>
      <div className="w-[90vw] max-w-md bg-[#231942]/80 rounded-2xl shadow-xl px-4 md:px-8 py-10 flex flex-col items-center">
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-violet-200 text-xs md:text-sm mb-1">
                Name
              </label>
              <div className="relative">
                <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full pl-10 pr-3 py-1 md:py-2  bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  required
                />
              </div>
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-violet-200 text-xs md:text-sm mb-1">
              Email Address
            </label>
            <div className="relative">
              <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-1 md:py-2  bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
              />
            </div>
          </div>
          {/* DOB */}
          <div>
            <label className="block text-violet-200 text-xs md:text-sm mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full px-3 py-1 md:py-1 bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-violet-200 text-xs md:text-sm mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-1 md:py-2  bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
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
                placeholder="Create password"
                className="w-full pl-10 pr-10 py-1 md:py-2  bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
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
          {/* Confirm Password */}
          <div>
            <label className="block text-violet-200 text-xs md:text-sm mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full pl-10 pr-10 py-1 md:py-2  bg-[#313052] text-white rounded-lg border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400"
                tabIndex={-1}
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </div>
          {/* Terms and Updates */}
          <div className="flex gap-2 pt-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="accent-violet-500"
              required
            />
            <div>
              I agree to{' '}
              <span className="text-purple-200">
                <a href="#">Terms of Service </a>
              </span>{' '}
              and
              <span className="text-purple-200">
                {' '}
                <a href="">Privacy Policy</a>
              </span>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-fuchsia-700 to-pink-500 text-white font-semibold mt-2 flex items-center justify-center gap-2 hover:from-fuchsia-700 hover:to-pink-600 transition"
          >
            {loading ? 'Creating...' : 'Create Account'}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-violet-700" />
          <span className="mx-3 text-violet-300 text-sm">OR SIGN UP WITH</span>
          <div className="flex-1 h-px bg-violet-700" />
        </div>
        {/* Social Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
            <FcGoogle className="text-lg" />
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
            <DiApple className="text-lg" />
            Continue with Apple
          </button>
          <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
            <FaXTwitter className="text-lg" />
            Continue with X
          </button>
          <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
            <FaFacebook className="text-lg" />
            Continue with Facebook
          </button>
        </div>

        {/* More signup options */}
        <button className="mt-4 text-violet-300 text-sm hover:underline">
          More signup options
        </button>

        {/* Already have account */}
        <div className="mt-6 text-violet-300 text-sm text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-white underline hover:text-violet-200">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}