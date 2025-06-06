import React, { useState, useRef, useEffect } from "react";

export default function AdminLayout({ children, adminName = "Admin Komik" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="flex min-h-screen bg-primary-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary-background shadow-lg rounded-r-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex flex-col h-full p-5">
          <h2 className="text-2xl font-extrabold mb-6 text-primary-text select-none">
            KomikAdmin
          </h2>
          <nav className="flex flex-col gap-3 text-secondary-text font-semibold text-lg">
            <a href="/admin/dashboard" className="hover:bg-primary-background rounded-lg p-2 transition-colors">Dashboard</a>

            <div>
              <button
                onClick={() => setSidebarDropdownOpen(!sidebarDropdownOpen)}
                className="w-full flex justify-between items-center hover:bg-primary-background rounded-lg p-2 transition-colors font-semibold"
              >
                Users
                <svg className={`w-5 h-5 text-secondary-text transition-transform ${sidebarDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {sidebarDropdownOpen && (
                <div className="flex flex-col ml-4 mt-1 text-secondary-text font-normal">
                  <a href="/admin/users" className="hover:bg-primary-background rounded-md px-3 py-1 transition-colors">All Users</a>
                  <a href="/admin/users/create" className="hover:bg-primary-background rounded-md px-3 py-1 transition-colors">Add User</a>
                  <a href="/admin/roles" className="hover:bg-primary-background rounded-md px-3 py-1 transition-colors">Roles</a>
                </div>
              )}
            </div>

            <a href="/admin/posts" className="hover:bg-primary-background rounded-lg p-2 transition-colors">Posts</a>
            <a href="/admin/settings" className="hover:bg-primary-background rounded-lg p-2 transition-colors">Settings</a>
          </nav>
        </div>
      </div>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 ml-0 md:ml-20">
        {/* Header */}
        <header className="flex items-center justify-between bg-secondary-background shadow px-5 py-3 rounded-b-xl">
          <button className="md:hidden p-2 rounded-md hover:bg-primary-background" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg className="w-6 h-6 text-secondary-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div ref={dropdownRef} className="relative cursor-pointer select-none" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-primary-text font-extrabold text-lg">
                {adminName.charAt(0)}
              </div>
              <span className="font-semibold text-primary-text">{adminName}</span>
              <svg className={`w-5 h-5 text-secondary-text transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-secondary-background shadow-lg rounded-lg overflow-hidden z-40">
                <a href="/admin/profile" className="block px-4 py-2 text-secondary-text hover:bg-primary-background">Profile</a>
                <a href="/admin/settings" className="block px-4 py-2 text-secondary-text hover:bg-primary-background">Settings</a>
                <div className="border-t border-purple-200"></div>
                <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100" onClick={() => alert("Logout clicked!")}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 max-w-full p-4 md:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
