
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import type { AdminUser } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: AdminUser;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className="app-wrapper">
        {isSidebarOpen && (
            <div
                className="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />
        )}

        <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => {
              if (window.innerWidth <= 1024) setSidebarOpen(false);
            }}
            user={user}
        />

        <div className="main-container">
          <header className="header">
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="btn btn-outline btn-icon-only"
                aria-label="Toggle Sidebar"
            >
              <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="user-profile-container" ref={dropdownRef}>
              <button
                  className="user-profile-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="user-info">
                  <p className="user-name-text">{user.name}</p>
                  <p className="user-role-text">Administrator</p>
                </div>
                <div className="user-avatar">
                  {user.name.charAt(0)}
                </div>
              </button>

              {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                        className="dropdown-item text-danger"
                        onClick={onLogout}
                    >
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
              )}
            </div>
          </header>

          <main className="content-area">
            {children}
          </main>
        </div>
      </div>
  );
};

export default Layout;
