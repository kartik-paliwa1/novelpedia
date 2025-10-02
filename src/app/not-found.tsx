'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9] text-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-violet-200 text-lg mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-fuchsia-700 to-pink-500 text-white font-semibold hover:from-fuchsia-800 hover:to-pink-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
