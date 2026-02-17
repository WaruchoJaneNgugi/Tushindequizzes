// components/Dashboard.tsx
import { useStore } from '../store/useStore';
import {
  TrophyIcon,
  CubeIcon,
  CpuChipIcon,
  ChartBarIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  UsersIcon,
  PresentationChartLineIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from "../components/ThemeToggle.tsx";
import "../assets/adminstyles.css";
import { useState } from 'react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: PresentationChartLineIcon, color: 'from-blue-500 to-blue-600' },
  { id: 'achievements', label: 'Achievements', icon: TrophyIcon, color: 'from-yellow-500 to-yellow-600' },
  { id: 'categories', label: 'Categories', icon: CubeIcon, color: 'from-green-500 to-green-600' },
  { id: 'games', label: 'Games', icon: CpuChipIcon, color: 'from-purple-500 to-purple-600' },
  { id: 'leaderboards', label: 'Leaderboards', icon: ChartBarIcon, color: 'from-red-500 to-red-600' },
  { id: 'sessions', label: 'Sessions', icon: CircleStackIcon, color: 'from-indigo-500 to-indigo-600' },
  { id: 'transactions', label: 'Transactions', icon: CurrencyDollarIcon, color: 'from-emerald-500 to-emerald-600' },
  { id: 'users', label: 'Users', icon: UsersIcon, color: 'from-orange-500 to-orange-600' },
];

// Stats card data with icons and colors
const statsData = [
  {
    label: 'TOTAL PLAYERS',
    value: '2,847',
    change: '+12%',
    changeType: 'increase',
    active: '342 currently active',
    icon: UsersIcon,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    label: 'PUBLISHED QUIZZES',
    value: '156',
    change: '+8%',
    changeType: 'increase',
    icon: CubeIcon,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    label: 'ATTEMPTS TODAY',
    value: '1,842',
    change: '+5%',
    changeType: 'increase',
    icon: ChartBarIcon,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    label: 'AVG. SCORE',
    value: '78.5%',
    change: '-2%',
    changeType: 'decrease',
    icon: TrophyIcon,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
];

export const Dashboard = () => {
  const { activeTab, setActiveTab } = useStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {/* Header with gradient */}
        <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-lg">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)]"
              >
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-hover)] flex items-center justify-center">
                  <PresentationChartLineIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)]">Manage your platform with ease</p>
                </div>
              </div>
            </div>

            {/* Search and theme toggle */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 w-64"
                />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div className="flex">
          {/* Sidebar */}
          <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 border-r border-[var(--border-color)] bg-[var(--bg-card)] min-h-[calc(100vh-73px)] sticky left-0 top-[73px]`}>
            <nav className="p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all group relative
                    ${isActive
                            ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color.split(' ')[1]}/25`
                            : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                      {!sidebarCollapsed && <span className="font-medium">{tab.label}</span>}
                      {isActive && !sidebarCollapsed && (
                          <div className="absolute right-2 w-1.5 h-8 bg-white rounded-full"></div>
                      )}
                    </button>
                );
              })}
            </nav>

            {/* User profile section in sidebar */}
            {!sidebarCollapsed && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-medium">Admin User</p>
                      <p className="text-xs text-[var(--text-secondary)]">admin@example.com</p>
                    </div>
                  </div>
                </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 bg-[var(--bg-secondary)]">
            {/* Page header with actions */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold capitalize">{activeTab} Management</h2>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-colors">
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-colors">
                  <DocumentArrowDownIcon className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  <span>Create New</span>
                </button>
              </div>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Stats Grid with icons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat) => {
                      const Icon = stat.icon;
                      return (
                          <div
                              key={stat.label}
                              className="group bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className={`p-3 rounded-xl ${stat.bgColor} bg-opacity-50`}>
                                <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                              </div>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                  stat.changeType === 'increase'
                                      ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                                      : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                              }`}>
                          {stat.change}
                        </span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold mb-2">{stat.value}</p>
                            {stat.active && (
                                <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                  {stat.active}
                                </p>
                            )}
                          </div>
                      );
                    })}
                  </div>

                  {/* Charts and Activity Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quiz Attempts Chart - Takes 2 columns */}
                    <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold">Quiz Attempts (Last 7 Days)</h3>
                          <p className="text-sm text-[var(--text-secondary)]">Daily active users and quiz completions</p>
                        </div>
                        <button className="text-sm text-[var(--accent-color)] hover:underline flex items-center gap-1">
                          View All Results
                          <ChevronDownIcon className="w-4 h-4 rotate-270" />
                        </button>
                      </div>

                      {/* Chart bars with labels */}
                      <div className="h-72 flex items-end justify-between gap-3">
                        {[65, 85, 45, 72, 98, 82, 75].map((value, index) => {
                          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                          return (
                              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full">
                                  <div
                                      className="w-full bg-gradient-to-t from-[var(--accent-color)] to-[var(--accent-hover)] rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                                      style={{ height: `${value}%`, minHeight: '40px' }}
                                  >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[var(--bg-card)] px-2 py-1 rounded text-xs border border-[var(--border-color)] shadow-lg">
                                      {value} attempts
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm text-[var(--text-secondary)]">{days[index]}</span>
                              </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Activity - Takes 1 column */}
                    <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-start gap-3 pb-4 border-b border-[var(--border-color)] last:border-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
                                JD
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">John Doe completed a quiz</p>
                                <p className="text-xs text-[var(--text-secondary)]">2 minutes ago</p>
                              </div>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          +50 pts
                        </span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
                <div className="space-y-6">
                  {/* Quick actions */}
                  <div className="flex gap-3 mb-6">
                    <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                      <PlusIcon className="w-4 h-4" />
                      Create Achievement
                    </button>
                    <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-card)] transition-colors flex items-center gap-2">
                      <FunnelIcon className="w-4 h-4" />
                      Filter
                    </button>
                  </div>

                  {/* Achievements grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] hover:shadow-xl transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                              <TrophyIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                                <PencilIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                              </button>
                              <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                                <TrashIcon className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-semibold mb-1">Master Explorer</h4>
                          <p className="text-sm text-[var(--text-secondary)] mb-3">Complete 100 quizzes to earn this badge</p>
                          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 mb-2">
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">Progress: 75/100</span>
                            <span className="text-yellow-600 dark:text-yellow-400">75%</span>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="space-y-6">
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Revenue', value: '$45,678', change: '+12.3%', icon: CurrencyDollarIcon },
                      { label: 'Transactions', value: '2,345', change: '+8.1%', icon: CircleStackIcon },
                      { label: 'Avg. Transaction', value: '$19.50', change: '+2.4%', icon: ChartBarIcon },
                      { label: 'Pending', value: '23', change: '-5.2%', icon: ArrowPathIcon },
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                          <div key={index} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
                            </div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                          </div>
                      );
                    })}
                  </div>

                  {/* Transactions table */}
                  <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                      <h3 className="font-semibold">Recent Transactions</h3>
                      <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm"
                        />
                        <button className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg text-sm">
                          Export
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[var(--bg-secondary)]">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Transaction ID</th>
                          <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">User</th>
                          <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Amount</th>
                          <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Date</th>
                          <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <tr key={item} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                              <td className="p-4 text-sm">#TRX-{12340 + item}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">
                                    JD
                                  </div>
                                  <span>John Doe</span>
                                </div>
                              </td>
                              <td className="p-4 text-sm font-medium">${(25 + item * 5).toFixed(2)}</td>
                              <td className="p-4 text-sm text-[var(--text-secondary)]">2024-01-{15 + item}</td>
                              <td className="p-4">
                            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                              Completed
                            </span>
                              </td>
                              <td className="p-4">
                                <button className="text-sm text-[var(--accent-color)] hover:underline">View Details</button>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between">
                      <p className="text-sm text-[var(--text-secondary)]">Showing 1-5 of 50 transactions</p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 border border-[var(--border-color)] rounded-lg text-sm">Previous</button>
                        <button className="px-3 py-1 bg-[var(--accent-color)] text-white rounded-lg text-sm">Next</button>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)] flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-3 flex-wrap">
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm w-64"
                        />
                      </div>
                      <select className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>User</option>
                        <option>Moderator</option>
                      </select>
                      <select className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Suspended</option>
                      </select>
                    </div>
                    <button className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg text-sm flex items-center gap-2">
                      <PlusIcon className="w-4 h-4" />
                      Add User
                    </button>
                  </div>

                  {/* Users table */}
                  <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[var(--bg-secondary)]">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">User</th>
                        <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Joined</th>
                        <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {[1, 2, 3, 4, 5].map((item) => (
                          <tr key={item} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                  JD
                                </div>
                                <div>
                                  <p className="font-medium">John Doe {item}</p>
                                  <p className="text-xs text-[var(--text-secondary)]">@johndoe</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm">john.doe{item}@example.com</td>
                            <td className="p-4 text-sm">
                          <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            User
                          </span>
                            </td>
                            <td className="p-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </span>
                            </td>
                            <td className="p-4 text-sm text-[var(--text-secondary)]">Jan 15, 2024</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                                  <PencilIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                                </button>
                                <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                                  <TrashIcon className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

            {/* Placeholders for other tabs with enhanced styling */}
            {['categories', 'games', 'leaderboards', 'sessions'].includes(activeTab) && (
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)]/20 flex items-center justify-center">
                    {activeTab === 'categories' && <CubeIcon className="w-10 h-10 text-[var(--accent-color)]" />}
                    {activeTab === 'games' && <CpuChipIcon className="w-10 h-10 text-[var(--accent-color)]" />}
                    {activeTab === 'leaderboards' && <ChartBarIcon className="w-10 h-10 text-[var(--accent-color)]" />}
                    {activeTab === 'sessions' && <CircleStackIcon className="w-10 h-10 text-[var(--accent-color)]" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2 capitalize">{activeTab} Management</h3>
                  <p className="text-[var(--text-secondary)] mb-6">Content for {activeTab} management will go here with all CRUD operations.</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] text-white rounded-xl hover:opacity-90 transition-opacity">
                    Get Started
                  </button>
                </div>
            )}
          </main>
        </div>
      </div>
  );
};