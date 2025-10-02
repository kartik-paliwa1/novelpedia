"use client";

import React from "react";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // Log to console for easier debugging in production builds
    // eslint-disable-next-line no-console
    console.error("Dashboard render error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mt-2">
          We couldn’t render the author dashboard. Please try again or return to the homepage.
        </p>
        {error?.message && (
          <p className="mt-3 text-xs text-destructive/80 break-all">{String(error.message)}</p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => reset()} className="px-3 py-2 rounded-md bg-primary text-primary-foreground">
            Try again
          </button>
          <a href="/" className="px-3 py-2 rounded-md border">Go home</a>
        </div>
      </div>
    </div>
  );
}

