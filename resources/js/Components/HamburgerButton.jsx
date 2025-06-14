import React from 'react';

export default function HamburgerButton({ open, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-8 h-8 flex flex-col items-center justify-center space-y-1 focus:outline-none"
            aria-label="Toggle menu"
        >
            <span
                className={`w-6 h-0.5 bg-primary-text transition-transform duration-300 ease-in-out transform ${open ? 'rotate-45 translate-y-1.5' : ''}`}
            />
            <span
                className={`w-6 h-0.5 bg-primary-text transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
                className={`w-6 h-0.5 bg-primary-text transition-transform duration-300 ease-in-out transform ${open ? '-rotate-45 -translate-y-1.5' : ''}`}
            />
        </button>
    );
}
