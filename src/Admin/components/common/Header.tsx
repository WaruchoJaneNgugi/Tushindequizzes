import { MagnifyingGlassIcon, ChevronDownIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../../components/ThemeToggle.tsx';

interface HeaderProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const Header = ({ sidebarCollapsed, setSidebarCollapsed, searchQuery, setSearchQuery }: HeaderProps) => {
    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="header-left">
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="mobile-menu-btn">
                        <ChevronDownIcon className="icon-small"/>
                    </button>
                    <div className="logo-section">
                        <div className="logo-icon">
                            <PresentationChartLineIcon className="icon-medium text-white"/>
                        </div>
                        <div>
                            <h1 className="logo-title">Admin Dashboard</h1>
                            <p className="logo-subtitle">Manage your platform with ease</p>
                        </div>
                    </div>
                </div>
                <div className="header-right">
                    <div className="search-wrapper">
                        <MagnifyingGlassIcon className="search-icon"/>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <ThemeToggle/>
                </div>
            </div>
        </header>
    );
};