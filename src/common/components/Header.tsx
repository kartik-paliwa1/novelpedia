// components/Header.tsx
import { FaSearch, FaBell, FaUser } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-[#181a1b] h-12 flex items-center px-36 justify-between">
      {/* Left: Logo and nav */}

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          {/* Replace with your logo */}
          {/* <img src="/logo.svg" alt="Genesis Logo" className="h-6" /> */}
          <span className="text-lg font-bold text-white">GENESIS</span>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="/novels" className="text-gray-300 hover:text-white text-sm">
            Novels
          </a>
          <a href="/library" className="text-gray-300 hover:text-white text-sm">
            Library
          </a>
          <div className="relative flex items-center">
            <a href="/store" className="text-gray-300 hover:text-white text-sm">
              Store
            </a>
            <span className="absolute -top-2 -right-4 text-xs text-red-500 font-bold">
              New
            </span>
          </div>
          <a href="/events" className="text-gray-300 hover:text-white text-sm">
            Events
          </a>
        </nav>
      </div>

      {/* Right: Search, notifications, profile */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-[#232526] text-sm text-white px-2 py-1 rounded focus:outline-none"
            style={{ width: 100 }}
          />
          <button className="absolute right-1 top-1 text-gray-400 hover:text-white">
            <FaSearch size={14} />
          </button>
        </div>
        <button className="text-gray-400 hover:text-white">
          <FaBell size={18} />
        </button>
        <button className="text-gray-400 hover:text-white">
          <FaUser size={18} />
        </button>
      </div>
    </header>
  );
}
