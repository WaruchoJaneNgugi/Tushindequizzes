// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import type { AdminUser } from '../types';
//
// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   user: AdminUser;
// }
//
// const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   const navItems = [
//     { to: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//     { to: '/admin/quizzes', label: 'Quizzes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
//     { to: '/admin/categories', label: 'Categories', icon: 'M7 7h.01M7 11h.01M7 15h.01M10 7h10M10 11h10M10 15h10' },
//     { to: '/admin/players', label: 'Players', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
//     { to: '/admin/results', label: 'Results', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
//   ];
//
//   return (
//       <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
//         <div className="sidebar-logo">
//           <div className="logo-box">
//             <svg className="icon-logo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//             </svg>
//           </div>
//           <span className="sidebar-title">QuizPro</span>
//         </div>
//
//         <nav className="sidebar-nav">
//           {navItems.map((item) => (
//               <NavLink
//                   key={item.to}
//                   to={item.to}
//                   onClick={onClose}
//                   className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
//               >
//                 <svg className="icon-logo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
//                 </svg>
//                 {item.label}
//               </NavLink>
//           ))}
//         </nav>
//       </aside>
//   );
// };
//
// export default Sidebar;