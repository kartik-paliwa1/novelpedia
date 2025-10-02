export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col py-10 items-center justify-center bg-background">
      <div className="w-[90vw] max-w-md rounded-2xl border shadow px-8 py-10 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2"></div>
        <p className="text-sm text-muted-foreground mt-4">Loading dashboard…</p>
      </div>
    </div>
  );
}

