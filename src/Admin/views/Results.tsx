import React from 'react';
import type { QuizAttempt } from '../types';

interface ResultsProps {
  attempts: QuizAttempt[];
}

const Results: React.FC<ResultsProps> = ({ attempts }) => {
  return (
      <div className="responsive-flex-header" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div>
          <h1>Quiz Results</h1>
          <p className="subtitle">Detailed performance analytics and logs.</p>
        </div>

        <div className="stat-grid">
          <div className="card">
            <p className="subtitle fw-600 m-0" style={{ marginTop: 0 }}>Global Pass Rate</p>
            <div className="player-info-cell" style={{ alignItems: 'baseline', marginTop: '0.5rem' }}>
              <h3 className="fw-700" style={{ fontSize: '1.5rem' }}>82.4%</h3>
              <span className="badge badge-success">+2%</span>
            </div>
          </div>
          <div className="card">
            <p className="subtitle fw-600 m-0">Avg. Time</p>
            <div style={{ marginTop: '0.5rem' }}>
              <h3 className="fw-700" style={{ fontSize: '1.5rem' }}>14m 22s</h3>
            </div>
          </div>
          <div className="card">
            <p className="subtitle fw-600 m-0">Top Scores</p>
            <div style={{ marginTop: '0.5rem' }}>
              <h3 className="fw-700" style={{ fontSize: '1.5rem' }}>12 Players</h3>
              <p className="subtitle fs-xs">Achieved 100%</p>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
            <tr>
              <th>Player</th>
              <th>Quiz</th>
              <th>Score</th>
              <th className="text-right">Date</th>
            </tr>
            </thead>
            <tbody>
            {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>
                    <div className="player-info-cell" style={{ gap: '0.5rem' }}>
                      <div className="player-avatar-circle player-avatar-xs">
                        {attempt.playerUsername.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-600">{attempt.playerUsername}</span>
                    </div>
                  </td>
                  <td>
                    <div className="fw-600 text-primary fs-sm" style={{ color: 'var(--primary)' }}>{attempt.quizTitle}</div>
                    <div className="subtitle fs-xs">Time: {attempt.timeSpent}</div>
                  </td>
                  <td>
                    <div className="player-info-cell">
                      <div className="progress-container" style={{ maxWidth: '100px', flex: 1, height: '6px' }}>
                        <div
                            className="progress-bar"
                            style={{
                              width: `${attempt.score}%`,
                              background: attempt.score >= 70 ? 'var(--success)' : (attempt.score >= 50 ? 'var(--warning)' : 'var(--danger)')
                            }}
                        />
                      </div>
                      <span className="fw-700" style={{ minWidth: '40px' }}>{attempt.score}%</span>
                    </div>
                  </td>
                  <td className="text-right fs-xs text-muted">
                    {attempt.date.split(' ')[0]}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Results;