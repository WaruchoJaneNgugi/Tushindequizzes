// import { ChevronDownIcon } from '@heroicons/react/24/outline';

import type {Tab} from "../../types/adminTypes.ts";

interface SidebarProps {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    userInitial: string;
    userName: string;
    userPhone: string;
}

export const Sidebar = ({
                            tabs,
                            activeTab,
                            setActiveTab,
                            sidebarCollapsed,
                            userInitial,
                            userName,
                            userPhone
                        }: SidebarProps) => {
    return (
        <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <nav className="sidebar-nav">
                {tabs.map((tab: Tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                            data-color={tab.color}
                        >
                            <Icon className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`}/>
                            {!sidebarCollapsed && <span className="nav-label">{tab.label}</span>}
                            {isActive && !sidebarCollapsed && <div className="active-indicator"></div>}
                        </button>
                    );
                })}
            </nav>
            {!sidebarCollapsed && (
                <div className="user-profile">
                    <div className="user-avatar">{userInitial}</div>
                    <div className="user-info">
                        <p className="user-name">{userName}</p>
                        <p className="user-email">{userPhone}</p>
                    </div>
                </div>
            )}
        </aside>
    );
};