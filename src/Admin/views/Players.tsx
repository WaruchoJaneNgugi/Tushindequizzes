// import React, { useState } from 'react';
// import type { Player, QuizAttempt, Quiz } from '../types';
// import { apiService, convertUserResponseToPlayer } from '../services/api';
//
// interface PlayersProps {
//   players: Player[];
//   setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
//   attempts: QuizAttempt[];
//   quizzes: Quiz[];
// }
//
// const Players: React.FC<PlayersProps> = ({ players, setPlayers, attempts, quizzes }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//
//   const toggleStatus = async (id: string) => {
//     try {
//       const player = players.find(p => p.id === id);
//       if (!player) return;
//
//       const newStatus = player.status === 'active' ? 'disabled' : 'active';
//       const response = await apiService.updateUserStatus(id, newStatus);
//
//       if (!response.success || response.error) {
//         alert(`Failed to update status: ${response.error || 'Unknown error'}`);
//         return;
//       }
//
//       setPlayers(players.map(p =>
//           p.id === id ? { ...p, status: newStatus } : p
//       ));
//     } catch (err) {
//       alert(`Error updating status: ${err || 'Unknown error'}`);
//     }
//   };
//
//   const handleDelete = async (id: string) => {
//     if (confirm('Permanently remove this player?')) {
//       try {
//         setLoading(true);
//         const response = await apiService.deleteUser(id);
//
//         if (!response.success || response.error) {
//           alert(`Failed to delete: ${response.error || 'Unknown error'}`);
//           return;
//         }
//
//         setPlayers(players.filter(p => p.id !== id));
//       } catch (err) {
//         alert(`Error deleting player: ${err || 'Unknown error'}`);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
//
//   const loadPlayerDetails = async (player: Player) => {
//     try {
//       setLoading(true);
//       const response = await apiService.getUserById(player.id);
//
//       if (response.success && response.data?.user) {
//         // Convert API response to Player type
//         const updatedPlayer = convertUserResponseToPlayer(response.data.user);
//         setSelectedPlayer(updatedPlayer);
//       } else {
//         setSelectedPlayer(player);
//       }
//     } catch (err) {
//       setError(`Failed to load player details: ${err || 'Unknown error'}`);
//       setSelectedPlayer(player);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const filteredPlayers = players.filter(p =>
//       p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//
//   const playerHistory = selectedPlayer
//       ? attempts.filter(a => a.playerId === selectedPlayer.id)
//       : [];
//
//   const avgScore = playerHistory.length > 0
//       ? Math.round(playerHistory.reduce((acc, curr) => acc + curr.score, 0) / playerHistory.length)
//       : 0;
//
//   return (
//       <div className="responsive-flex-header" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
//         <div className="responsive-flex-header">
//           <div>
//             <h1>Players</h1>
//             <p className="subtitle">Manage user accounts and status.</p>
//           </div>
//           <div className="search-container">
//             <input
//                 type="text"
//                 placeholder="Search by username or phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="form-input search-input"
//                 disabled={loading}
//             />
//             <svg className="icon-sm search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
//         </div>
//
//         {error && (
//             <div className="error-message" style={{ marginBottom: '1rem' }}>
//               {error}
//             </div>
//         )}
//
//         <div className="table-wrapper">
//           <table className="admin-table">
//             <thead>
//             <tr>
//               <th>Player</th>
//               <th>Joined</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th className="text-right">Actions</th>
//             </tr>
//             </thead>
//             <tbody>
//             {filteredPlayers.length > 0 ? (
//                 filteredPlayers.map((player) => (
//                     <tr key={player.id}>
//                       <td>
//                         <div className="player-info-cell">
//                           <div className="player-avatar-circle" style={{
//                             background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
//                             color: 'black',
//                             fontWeight: 'bold'
//                           }}>
//                             {player.username.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <div
//                                 className="player-link"
//                                 onClick={() => loadPlayerDetails(player)}
//                                 title="View history"
//                                 style={{ cursor: 'pointer' }}
//                             >
//                               {player.username}
//                             </div>
//                             <div className="subtitle fs-xs m-0">{player.phoneNumber}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="fs-sm">{player.registrationDate}</td>
//                       <td>
//                         <span className={`badge ${player.role === 'admin' ? 'badge-warning' : 'badge-neutral'}`}>
//                           {player.role.toUpperCase()}
//                         </span>
//                       </td>
//                       <td>
//                         <span className={`badge ${player.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
//                           {player.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="text-right">
//                         <div className="table-actions-group">
//                           <button
//                               onClick={() => toggleStatus(player.id)}
//                               className="btn btn-ghost"
//                               title="Toggle Status"
//                               disabled={loading}
//                           >
//                             {player.status === 'active' ? (
//                                 <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
//                                 </svg>
//                             ) : (
//                                 <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             )}
//                           </button>
//                           {player.role !== 'admin' && (
//                               <button
//                                   className="btn btn-ghost text-danger"
//                                   onClick={() => handleDelete(player.id)}
//                                   disabled={loading}
//                               >
//                                 <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                 </svg>
//                               </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                 ))
//             ) : (
//                 <tr>
//                   <td colSpan={5} className="text-center" style={{ padding: '3rem' }}>
//                     {searchTerm ? 'No players found matching your search.' : 'No players yet.'}
//                   </td>
//                 </tr>
//             )}
//             </tbody>
//           </table>
//         </div>
//
//         {selectedPlayer && (
//             <div className="modal-overlay" onClick={() => !loading && setSelectedPlayer(null)}>
//               <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
//                 <div className="modal-header">
//                   <div>
//                     <h2 className="m-0">Player Details: {selectedPlayer.username}</h2>
//                     <p className="subtitle m-0">View player information and activity history.</p>
//                   </div>
//                   <button
//                       className="btn btn-ghost"
//                       onClick={() => setSelectedPlayer(null)}
//                       disabled={loading}
//                   >
//                     <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//                 <div className="modal-body">
//                   {loading ? (
//                       <div className="text-center" style={{ padding: '3rem' }}>
//                         <div className="spinner" style={{
//                           width: '40px',
//                           height: '40px',
//                           border: '3px solid rgba(255, 255, 255, 0.1)',
//                           borderTop: '3px solid var(--primary)',
//                           borderRadius: '50%',
//                           animation: 'spin 1s linear infinite',
//                           margin: '0 auto 1rem'
//                         }} />
//                         <p>Loading player details...</p>
//                       </div>
//                   ) : (
//                       <>
//                         <div className="player-profile-header" style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '1rem',
//                           marginBottom: '2rem',
//                           paddingBottom: '1rem',
//                           borderBottom: '1px solid var(--border-color)'
//                         }}>
//                           <div className="player-avatar-circle" style={{
//                             width: '60px',
//                             height: '60px',
//                             background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
//                             color: 'black',
//                             fontWeight: 'bold',
//                             fontSize: '1.5rem'
//                           }}>
//                             {selectedPlayer.username.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <h3 className="m-0">{selectedPlayer.username}</h3>
//                             <p className="subtitle m-0">{selectedPlayer.phoneNumber}</p>
//                             <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
//                               <span className={`badge ${selectedPlayer.role === 'admin' ? 'badge-warning' : 'badge-neutral'}`}>
//                                 {selectedPlayer.role.toUpperCase()}
//                               </span>
//                               <span className={`badge ${selectedPlayer.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
//                                 {selectedPlayer.status.toUpperCase()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//
//                         <div className="player-history-stats">
//                           <div className="card history-stat-card">
//                             <p className="subtitle fw-600 m-0">Joined Date</p>
//                             <h3 className="m-0" style={{ fontSize: '1.5rem' }}>{selectedPlayer.registrationDate}</h3>
//                           </div>
//                           <div className="card history-stat-card">
//                             <p className="subtitle fw-600 m-0">Total Games</p>
//                             <h3 className="m-0" style={{ fontSize: '1.5rem' }}>{playerHistory.length}</h3>
//                           </div>
//                           <div className="card history-stat-card">
//                             <p className="subtitle fw-600 m-0">Avg. Score</p>
//                             <h3 className="m-0" style={{ fontSize: '1.5rem' }}>{avgScore}%</h3>
//                           </div>
//                         </div>
//
//                         {playerHistory.length > 0 ? (
//                             <div className="table-wrapper" style={{ marginTop: 0 }}>
//                               <div className="card-header-flex">
//                                 <h3 className="m-0">Quiz History</h3>
//                                 <p className="subtitle m-0">Recent quiz attempts</p>
//                               </div>
//                               <table className="admin-table">
//                                 <thead>
//                                 <tr>
//                                   <th>Quiz & Category</th>
//                                   <th>Score</th>
//                                   <th className="text-right">Date</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {playerHistory.map(attempt => {
//                                   const quizInfo = quizzes.find(q => q.id === attempt.quizId);
//                                   return (
//                                       <tr key={attempt.id}>
//                                         <td>
//                                           <div className="fw-600">{attempt.quizTitle}</div>
//                                           {quizInfo && (
//                                               <span className="badge badge-neutral fs-xxs mt-1">
//                                                 {quizInfo.category}
//                                               </span>
//                                           )}
//                                         </td>
//                                         <td>
//                                           <div className="player-info-cell" style={{ gap: '0.5rem' }}>
//                                             <div className="progress-container" style={{ width: '60px', height: '4px' }}>
//                                               <div className="progress-bar" style={{
//                                                 width: `${attempt.score}%`,
//                                                 background: attempt.score >= 70 ? 'var(--success)' :
//                                                     attempt.score >= 50 ? 'var(--warning)' : 'var(--danger)'
//                                               }} />
//                                             </div>
//                                             <span className="fw-700 fs-sm">{attempt.score}%</span>
//                                           </div>
//                                         </td>
//                                         <td className="text-right fs-xs text-muted">
//                                           {new Date(attempt.date).toLocaleDateString()}
//                                         </td>
//                                       </tr>
//                                   );
//                                 })}
//                                 </tbody>
//                               </table>
//                             </div>
//                         ) : (
//                             <div className="text-center text-muted" style={{ padding: '3rem' }}>
//                               <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.5, marginBottom: '1rem' }}>
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                               </svg>
//                               <p>This player hasn't completed any quizzes yet.</p>
//                             </div>
//                         )}
//                       </>
//                   )}
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                       className="btn btn-primary"
//                       onClick={() => setSelectedPlayer(null)}
//                       disabled={loading}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//         )}
//       </div>
//   );
// };
//
// export default Players;