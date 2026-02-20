// import React from 'react';
//
// interface StatCardProps {
//     label: string;
//     value: string | number;
//     icon: React.ReactNode;
//     trend?: string;
//     color: 'blue' | 'indigo' | 'green' | 'amber';
// }
//
// const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, color }) => {
//     return (
//         <div className="card stat-card">
//             <div className="stat-content">
//                 <p className="subtitle stat-label">{label}</p>
//                 <h3 className="stat-value">{value}</h3>
//                 {trend && (
//                     <p className="stat-trend">
//                         <svg className="icon-xs" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                         </svg>
//                         {trend}
//                     </p>
//                 )}
//             </div>
//             <div className={`stat-icon icon-${color}`}>
//                 {icon}
//             </div>
//         </div>
//     );
// };
//
// export default StatCard;