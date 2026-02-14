import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard';
import { QuizStatus } from '../types';
import type { Quiz, Player } from '../types';

interface DashboardProps {
  quizzes: Quiz[];
  players: Player[];
}

const data = [
  { name: 'Mon', attempts: 40 },
  { name: 'Tue', attempts: 30 },
  { name: 'Wed', attempts: 65 },
  { name: 'Thu', attempts: 45 },
  { name: 'Fri', attempts: 90 },
  { name: 'Sat', attempts: 55 },
  { name: 'Sun', attempts: 70 },
];

const Dashboard: React.FC<DashboardProps> = ({ quizzes, players }) => {
  const navigate = useNavigate();

  const activeQuizzesCount = quizzes.filter(q => q.status === QuizStatus.PUBLISHED).length;
  const activePlayersCount = players.filter(p => p.status === 'active').length;

  return (
      <div className="responsive-flex-header" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Live platform analytics and user engagement stats.</p>
        </div>

        <div className="stat-grid">
          <div className="user-profile-container">
            <StatCard
                label="Total Players"
                value={players.length}
                trend="+12%"
                color="blue"
                icon={<svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <div className="stat-footer-text">
              {activePlayersCount} currently active
            </div>
          </div>

          <StatCard
              label="Published Quizzes"
              value={activeQuizzesCount}
              color="indigo"
              icon={<svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
          />
          <StatCard label="Attempts Today" value={142} trend="+5%" color="green" icon={<svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          <StatCard label="Avg. Score" value="78.5%" color="amber" icon={<svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>} />
        </div>

        <div className="card">
          <div className="card-header-flex">
            <h3 className="m-0">Quiz Attempts (Last 7 Days)</h3>
            <button className="btn btn-outline" onClick={() => navigate('/results')}>View All Results</button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#64748b', fontSize: 12}}
                    padding={{ left: 10, right: 10 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--card-shadow)' }}
                />
                <Area
                    type="monotone"
                    dataKey="attempts"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAttempts)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;