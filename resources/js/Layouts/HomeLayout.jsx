import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import HamburgerButton from '@/Components/HamburgerButton';

export default function HomeLayout({ children, post_types, seo }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);
    const kontenDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const mobileMenuButtonRef = useRef(null);
    const mobileKontenTriggerRef = useRef(null);
    const mobileUserTriggerRef = useRef(null);
    const { auth } = usePage().props;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                kontenDropdownRef.current && !kontenDropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(null);
            }
            if (
                menuOpen &&
                mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target) &&
                mobileKontenTriggerRef.current && !mobileKontenTriggerRef.current.contains(event.target) &&
                mobileUserTriggerRef.current && !mobileUserTriggerRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
                setDropdownOpen(null);
            }
        };
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    const toggleMobileDropdown = (type) => {
        setDropdownOpen(prev => (prev === type ? null : type));
    };

    return (
        <div className="bg-primary-background">
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-secondary-background shadow-md' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <Link href="/">
                            <span className="text-lg font-bold text-primary-text mt-2">{seo.brand_name}</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-primary-text hover:text-secondary-text">Beranda</Link>
                            <div className="relative" ref={kontenDropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(dropdownOpen === 'konten' ? null : 'konten')}
                                    className="flex items-center space-x-1 text-primary-text hover:text-secondary-text focus:outline-none"
                                >
                                    <span>Konten</span>
                                    <svg className={`w-4 h-4 transform transition-transform duration-200 ${dropdownOpen === 'konten' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className={`absolute left-0 mt-2 w-44 p-2 border border-gray-300 bg-primary-background rounded-md shadow-lg z-50 transform transition-all origin-top duration-300 ease-in-out ${dropdownOpen === 'konten' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    {post_types && post_types.length > 0 ? (
                                        post_types.map((type) => (
                                            <Link
                                                key={type.slug}
                                                href={`/post/type/${type.slug}`}
                                                className="block px-4 py-2 text-sm text-primary-text hover:bg-primary-btn rounded-md"
                                                onClick={() => setDropdownOpen(null)}
                                            >
                                                {type.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-400">Belum ada daftar Konten</div>
                                    )}
                                </div>
                            </div>
                            {auth?.user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(dropdownOpen === 'desktop-user' ? null : 'desktop-user')}
                                        className="flex items-center space-x-2 focus:outline-none px-2 py-1 rounded transition"
                                    >
                                        <div className="w-10 h-10 bg-secondary-btn rounded-full flex items-center justify-center text-primary-text font-extrabold text-lg">
                                            {auth?.user?.username.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-primary-text">{auth.user.username}</span>
                                    </button>
                                    <div className={`absolute right-0 mt-2 w-44 bg-primary-background rounded-md shadow-lg z-50 transform transition-all duration-300 ease-in-out origin-top ${dropdownOpen === 'desktop-user' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-secondary-background cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Login</Link>
                            )}
                        </div>
                        <div className="md:hidden">
                            <HamburgerButton
                                open={menuOpen}
                                onClick={() => {
                                    setMenuOpen(!menuOpen);
                                    setDropdownOpen(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div
                    ref={mobileMenuRef}
                    className={`md:hidden px-4 pb-4 bg-primary-background space-y-2 transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <Link href="/" className="block py-2 text-primary-text" onClick={() => { setMenuOpen(false); setDropdownOpen(null); }}>Beranda</Link>
                    <div className="space-y-1">
                        <button
                            ref={mobileKontenTriggerRef}
                            onClick={() => toggleMobileDropdown('konten')}
                            className="w-full flex items-center justify-between py-2 px-4 text-primary-text rounded-md border border-gray-300 hover:bg-secondary-background transition"
                        >
                            <span className="text-sm font-medium">Konten</span>
                            <svg className={`w-5 h-5 transform transition-transform duration-200 ${dropdownOpen === 'konten' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${dropdownOpen === 'konten' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-4 border-l border-gray-300">
                                {post_types && post_types.length > 0 ? (
                                    post_types.map((type) => (
                                        <Link
                                            key={type.slug}
                                            href={`/post/type/${type.slug}`}
                                            className="block px-4 py-2 text-sm text-primary-text hover:bg-primary-btn rounded-md"
                                            onClick={() => { setMenuOpen(false); setDropdownOpen(null); }}
                                        >
                                            {type.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-400">Belum ada daftar Konten</div>
                                )}
                            </div>
                        </div>
                    </div>
                    {auth?.user ? (
                        <div className="space-y-1">
                            <button
                                ref={mobileUserTriggerRef}
                                onClick={() => toggleMobileDropdown('user')}
                                className="w-full flex items-center justify-between py-2 px-4 text-primary-text rounded-md border border-gray-300 hover:bg-secondary-background cursor-pointer transition"
                            >
                                <span className="text-sm font-medium">{auth.user.name}</span>
                                <svg className={`w-5 h-5 transform transition-transform duration-200 ${dropdownOpen === 'user' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${dropdownOpen === 'user' ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-primary-background border rounded-md shadow-sm">
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm text-secondary-text hover:bg-primary-background"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setDropdownOpen(null);
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDropdownOpen(null);
                                            setMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-primary-background"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="block py-2 text-center text-white rounded"
                            onClick={() => { setMenuOpen(false); setDropdownOpen(null); }}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
            <main>{children}</main>
            <footer className="bg-secondary-background border-t">
                <div className="max-w-7xl mx-auto py-4 px-4 text-center text-sm text-primary-text">
                    &copy; {new Date().getFullYear()} {seo.brand_name}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
