// components/SearchBar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div
      className="flex items-center my-0.5 mx-3 border rounded-2xl px-9 py-2 w-full max-w-md"
      style={{
        borderColor: "#2A3245",
        backgroundColor: "#1E253B",
      }}
    >
      <Image
        src="/navbarLogos/search.png"
        alt="Search Icon"
        width={17}
        height={17}
        className="mr-2 opacity-80"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by novel title, author ..."
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
      />
    </div>
  );
}
