import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";

function Topbar({ onMenuClick }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="shadow px-4 sm:px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-gray-700 dark:text-gray-200">
          <FiMenu size={22} />
        </button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm hidden sm:block">Welcome, <span className="font-medium">Admin</span> 👋</span>
        <button
          onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
          className={`p-2 rounded-full transition-all duration-200 ${theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

export default Topbar;
