export default function ExplorePage() {
    return (
      <div className="min-h-screen pb-24 bg-gradient-to-br from-[#2d004d] via-[#4b166c] to-[#6d28d9] text-white">
        <header className="px-5 py-4 sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/10">
          <h1 className="text-xl font-semibold">Explore</h1>
          <p className="text-violet-200 text-sm">Trending stories, new authors, fresh worlds.</p>
        </header>
  
        <main className="px-5 py-6 space-y-6">
          {/* Replace with your explore content/cards */}
          <div className="rounded-xl bg-white/10 border border-white/10 p-4">
            <h2 className="font-medium">Discover</h2>
            <p className="text-sm text-violet-200">Tags, genres, editor picks, and weekly spotlights.</p>
          </div>
        </main>
      </div>
    );
  }
  