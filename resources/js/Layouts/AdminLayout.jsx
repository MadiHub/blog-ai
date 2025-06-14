import React, { useState, useRef, useEffect } from "react";
import { router, Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { auth } = usePage().props;
  const currentUrl = window.location.pathname;

  // This function now correctly checks for exact path matches
  const isActive = (path) => currentUrl === path;

  // This function checks if the current URL starts with the given path,
  // useful for parent links like "Posts" that encompass multiple sub-pages.
  const startsWithActive = (path) => currentUrl.startsWith(path);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Open the "Posts" dropdown if any of its sub-pages are active
    if (
      startsWithActive("/dashboard/post/types") || // Use startsWith for "post/types"
      startsWithActive("/dashboard/categories") ||
      startsWithActive("/dashboard/posts")
    ) {
      setSidebarDropdownOpen(true);
    } else {
      setSidebarDropdownOpen(false); // Close dropdown if not on a related page
    }
  }, [currentUrl]);

  const handleLogout = (e) => {
    e.preventDefault();
    router.post("/logout");
  };

  return (
    <>
    <div className="flex min-h-screen bg-primary-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary-background shadow-lg rounded-r-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex flex-col h-full p-5">
          <h2 className="text-2xl font-extrabold mb-6 text-primary-text select-none">
            {auth?.user?.role}
          </h2>
          <nav className="flex flex-col gap-3 text-secondary-text font-semibold text-lg">
            <Link
              href="/dashboard/"
              className={`rounded-lg p-2 transition-colors ${
                // Check if currentUrl is exactly "/dashboard/" or "/dashboard"
                isActive("/dashboard/") || isActive("/dashboard")
                  ? "bg-primary-background font-bold"
                  : "hover:bg-primary-background"
              }`}
            >
              Dashboard
            </Link>

            {auth?.user?.role === "admin" && (
              <Link
                href="/dashboard/settings"
                className={`rounded-lg p-2 transition-colors ${
                  isActive("/dashboard/settings") ? "bg-primary-background font-bold" : "hover:bg-primary-background"
                }`}
              >
                Settings
              </Link>
            )}

            {auth?.user?.role === "admin" && (
              <Link
                href="/dashboard/users"
                className={`rounded-lg p-2 transition-colors ${
                  isActive("/dashboard/users") ? "bg-primary-background font-bold" : "hover:bg-primary-background"
                }`}
              >
                Users
              </Link>
            )}

            <div>
              <button
                onClick={() => setSidebarDropdownOpen(!sidebarDropdownOpen)}
                className={`w-full flex justify-between items-center rounded-lg p-2 transition-colors font-semibold ${
                  // Use startsWithActive to check if any of the post-related pages are active
                  startsWithActive("/dashboard/post") ||
                  startsWithActive("/dashboard/categories") ||
                  startsWithActive("/dashboard/posts")
                    ? "bg-primary-background"
                    : "hover:bg-primary-background"
                }`}
              >
                Posts
                <svg
                  className={`w-5 h-5 text-secondary-text transition-transform ${
                    sidebarDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {sidebarDropdownOpen && (
                <div className="flex flex-col ml-4 mt-1 text-secondary-text font-normal">
                  <Link
                    href="/dashboard/post/types/"
                    className={`rounded-lg p-2 transition-colors ${
                      isActive("/dashboard/post/types") || isActive("/dashboard/post/types/")
                        ? "bg-primary-background font-bold"
                        : "hover:bg-primary-background"
                    }`}
                  >
                    Post Type
                  </Link>
                  <Link
                    href="/dashboard/categories"
                    className={`rounded-lg p-2 transition-colors ${
                      isActive("/dashboard/categories") ? "bg-primary-background font-bold" : "hover:bg-primary-background"
                    }`}
                  >
                    Post Category
                  </Link>
                  <Link
                    href="/dashboard/posts"
                    className={`rounded-lg p-2 transition-colors ${
                      isActive("/dashboard/posts") ? "bg-primary-background font-bold" : "hover:bg-primary-background"
                    }`}
                  >
                    Post
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 ml-0 md:ml-20">
        {/* Header */}
        <header className="flex items-center justify-between bg-secondary-background shadow px-5 py-3 rounded-b-xl">
          <button
            className="md:hidden p-2 rounded-md hover:bg-primary-background"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="w-6 h-6 text-secondary-text"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div
            ref={dropdownRef}
            className="relative cursor-pointer select-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
          <div className="flex items-center space-x-3">
            {auth?.user?.avatar ? (
              <img
                src={auth.user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-btn rounded-full flex items-center justify-center text-primary-text font-extrabold text-lg">
                {auth?.user?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="font-semibold text-primary-text">
              {auth?.user?.username}
            </span>

            <svg
              className={`w-5 h-5 text-secondary-text transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-secondary-background shadow-lg rounded-lg overflow-hidden z-40">
                <Link
                  href="#"
                  className="block px-4 py-2 text-secondary-text hover:bg-primary-background"
                >
                  Profile
                </Link>
                <div className="border-t border-purple-200"></div>
                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 max-w-full p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
    </>
  );
}