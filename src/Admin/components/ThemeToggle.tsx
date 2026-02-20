// components/ThemeToggle.tsx
import React from 'react';
import { useStore } from "../store/useStore";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import '../assets/themetoggle.css';

export const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useStore();

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            aria-label="Toggle theme"
        >
            <div className="theme-toggle-icons">
                <SunIcon
                    className={`theme-icon sun-icon ${isDarkMode ? 'hidden' : 'visible'}`}
                />
                <MoonIcon
                    className={`theme-icon moon-icon ${isDarkMode ? 'visible' : 'hidden'}`}
                />
            </div>
            <span className="theme-toggle-tooltip">
                {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </span>
        </button>
    );
};