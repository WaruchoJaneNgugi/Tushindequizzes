// components/ThemeToggle.tsx
import React from 'react';
import { useStore } from '../store/useStore';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useStore();

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
        >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};
