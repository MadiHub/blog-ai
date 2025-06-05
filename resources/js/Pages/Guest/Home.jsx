import React, { useState, useRef, useEffect } from "react";

const adminName = "Admin Komik";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg rounded-r-xl
          transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex flex-col h-full p-5">
          <h2 className="text-2xl font-extrabold mb-6 text-purple-700 select-none">
            KomikAdmin
          </h2>
          <nav className="flex flex-col gap-3 text-purple-800 font-semibold text-lg">
            <a
              href="#dashboard"
              className="hover:bg-purple-200 rounded-lg p-2 transition-colors"
            >
              Dashboard
            </a>

            {/* Sidebar dropdown menu */}
            <div>
              <button
                onClick={() => setSidebarDropdownOpen(!sidebarDropdownOpen)}
                className="w-full flex justify-between items-center hover:bg-purple-200 rounded-lg p-2 transition-colors font-semibold"
                aria-expanded={sidebarDropdownOpen}
              >
                Users
                <svg
                  className={`w-5 h-5 text-purple-700 transition-transform ${
                    sidebarDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {sidebarDropdownOpen && (
                <div className="flex flex-col ml-4 mt-1 text-purple-700 font-normal">
                  <a
                    href="#all-users"
                    className="hover:bg-purple-100 rounded-md px-3 py-1 transition-colors"
                  >
                    All Users
                  </a>
                  <a
                    href="#add-user"
                    className="hover:bg-purple-100 rounded-md px-3 py-1 transition-colors"
                  >
                    Add User
                  </a>
                  <a
                    href="#roles"
                    className="hover:bg-purple-100 rounded-md px-3 py-1 transition-colors"
                  >
                    Roles
                  </a>
                </div>
              )}
            </div>

            <a
              href="#posts"
              className="hover:bg-purple-200 rounded-lg p-2 transition-colors"
            >
              Posts
            </a>
            <a
              href="#settings"
              className="hover:bg-purple-200 rounded-lg p-2 transition-colors"
            >
              Settings
            </a>
          </nav>
        </div>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-0 md:ml-20">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-5 py-3 rounded-b-xl">
          <button
            className="md:hidden p-2 rounded-md hover:bg-purple-200 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {/* Hamburger icon */}
            <svg
              className="w-6 h-6 text-purple-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div
            ref={dropdownRef}
            className="relative cursor-pointer select-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-extrabold text-lg">
                {adminName.charAt(0)}
              </div>
              <span className="font-semibold text-purple-800">{adminName}</span>
              <svg
                className={`w-5 h-5 text-purple-700 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-40">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-purple-700 hover:bg-purple-100"
                >
                  Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-purple-700 hover:bg-purple-100"
                >
                  Settings
                </a>
                <div className="border-t border-purple-200"></div>
                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                  onClick={() => alert("Logout clicked!")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-purple-900 mb-4">
            Selamat datang, {adminName}!
          </h1>
          <p className="text-purple-800 max-w-xl">
            Ini adalah template admin panel dengan sidebar responsif dan profil dropdown. Kamu bisa kembangkan sesuai kebutuhan.
          </p>
          <p className="text-purple-800 max-w-xl">
            Ini adalah template admin panel dengan sidebar responsif dan profil dropdown. Kamu bisa kembangkan sesuai kebutuhan.
          </p>
        </main>
      </div>
    </div>
  );
}
