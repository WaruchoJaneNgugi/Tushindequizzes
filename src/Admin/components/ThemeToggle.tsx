// components/ThemeToggle.tsx
import React from 'react';
import { useStore } from "../store/useStore";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useStore();

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <SunIcon
                    className={`w-5 h-5 text-[var(--text-primary)] transition-all duration-300 absolute top-0 left-0
                        ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
                />
                <MoonIcon
                    className={`w-5 h-5 text-[var(--text-primary)] transition-all duration-300 absolute top-0 left-0
                        ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
                />
            </div>
            <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--bg-card)] text-xs rounded-lg border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </span>
        </button>
    );
};