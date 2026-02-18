// import React, { useState, useCallback, useEffect, useRef } from "react";
//
// // ============================================================
// // DIFFICULTY CONFIG
// // ============================================================
// const DIFFICULTY_CONFIG = {
//   easy:   { label: 'Easy',   cost: 2, reward: 2, depth: 1, description: 'Random moves',    emoji: '🌱' },
//   medium: { label: 'Medium', cost: 4, reward: 4, depth: 2, description: 'Basic strategy',  emoji: '⚔️' },
//   hard:   { label: 'Hard',   cost: 6, reward: 6, depth: 3, description: 'Tactical play',   emoji: '🔥' },
//   expert: { label: 'Expert', cost: 8, reward: 8, depth: 4, description: 'Near-perfect AI', emoji: '💀' },
// };
//
// // ============================================================
// // BOARD UTILS
// // ============================================================
// const PIECE_SYMBOLS = {
//   king:   { white: '♔', black: '♚' },
//   queen:  { white: '♕', black: '♛' },
//   rook:   { white: '♖', black: '♜' },
//   bishop: { white: '♗', black: '♝' },
//   knight: { white: '♘', black: '♞' },
//   pawn:   { white: '♙', black: '♟' },
// };
//
// let _pieceId = 0;
// const mkPiece = (type, color) => ({ id: `${color[0]}${type[0]}${++_pieceId}`, type, color, hasMoved: false });
//
// const createInitialBoard = () => {
//   const b = Array.from({ length: 8 }, () => Array(8).fill(null));
//   const backRank = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
//   backRank.forEach((t, c) => {
//     b[0][c] = mkPiece(t, 'black');
//     b[7][c] = mkPiece(t, 'white');
//   });
//   for (let c = 0; c < 8; c++) {
//     b[1][c] = mkPiece('pawn', 'black');
//     b[6][c] = mkPiece('pawn', 'white');
//   }
//   return b;
// };
//
// const cloneBoard = (b) => b.map(r => r.map(s => s ? { ...s } : null));
// const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
// const posEq = (a, b) => a.row === b.row && a.col === b.col;
// const opp = (c) => c === 'white' ? 'black' : 'white';
//
// const findKing = (b, color) => {
//   for (let r = 0; r < 8; r++)
//     for (let c = 0; c < 8; c++)
//       if (b[r][c] && b[r][c].type === 'king' && b[r][c].color === color) return { row: r, col: c };
//   return null;
// };
//
// const getRawMoves = (b, pos, enPassant) => {
//   const p = b[pos.row][pos.col];
//   if (!p) return [];
//   const r = pos.row, c = pos.col, color = p.color, type = p.type;
//   const moves = [];
//
//   const slide = (dr, dc) => {
//     let nr = r + dr, nc = c + dc;
//     while (inBounds(nr, nc)) {
//       const t = b[nr][nc];
//       if (t) { if (t.color !== color) moves.push({ row: nr, col: nc }); break; }
//       moves.push({ row: nr, col: nc });
//       nr += dr; nc += dc;
//     }
//   };
//
//   if (type === 'pawn') {
//     const dir = color === 'white' ? -1 : 1;
//     const startRow = color === 'white' ? 6 : 1;
//     if (inBounds(r + dir, c) && !b[r + dir][c]) {
//       moves.push({ row: r + dir, col: c });
//       if (r === startRow && !b[r + dir * 2][c]) moves.push({ row: r + dir * 2, col: c });
//     }
//     [-1, 1].forEach(dc2 => {
//       if (inBounds(r + dir, c + dc2)) {
//         const t = b[r + dir][c + dc2];
//         if (t && t.color !== color) moves.push({ row: r + dir, col: c + dc2 });
//         if (enPassant && enPassant.row === r + dir && enPassant.col === c + dc2)
//           moves.push({ row: r + dir, col: c + dc2 });
//       }
//     });
//   } else if (type === 'knight') {
//     [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc2]) => {
//       const nr = r+dr, nc = c+dc2;
//       if (inBounds(nr, nc) && b[nr][nc]?.color !== color) moves.push({ row: nr, col: nc });
//     });
//   } else if (type === 'bishop') {
//     [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc2]) => slide(dr,dc2));
//   } else if (type === 'rook') {
//     [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc2]) => slide(dr,dc2));
//   } else if (type === 'queen') {
//     [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc2]) => slide(dr,dc2));
//   } else if (type === 'king') {
//     [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc2]) => {
//       const nr = r+dr, nc = c+dc2;
//       if (inBounds(nr, nc) && b[nr][nc]?.color !== color) moves.push({ row: nr, col: nc });
//     });
//     // Castling
//     if (!p.hasMoved && !isSquareAttackedBy(b, { row: r, col: c }, opp(color))) {
//       const kr = b[r][7];
//       if (kr && !kr.hasMoved && !b[r][5] && !b[r][6] &&
//           !isSquareAttackedBy(b, {row:r,col:5}, opp(color)))
//         moves.push({row:r,col:6});
//       const qr = b[r][0];
//       if (qr && !qr.hasMoved && !b[r][1] && !b[r][2] && !b[r][3] &&
//           !isSquareAttackedBy(b, {row:r,col:3}, opp(color)))
//         moves.push({row:r,col:2});
//     }
//   }
//   return moves;
// };
//
// const isSquareAttackedBy = (b, pos, byColor) => {
//   for (let r = 0; r < 8; r++)
//     for (let c = 0; c < 8; c++)
//       if (b[r][c] && b[r][c].color === byColor)
//         if (getRawMoves(b, {row:r,col:c}, null).some(m => posEq(m, pos))) return true;
//   return false;
// };
//
// const isInCheckFn = (b, color) => {
//   const k = findKing(b, color);
//   return k ? isSquareAttackedBy(b, k, opp(color)) : false;
// };
//
// const applyMoveToBoard = (b, from, to, piece) => {
//   // En passant: diagonal pawn move to empty square removes the captured pawn
//   if (piece.type === 'pawn' && from.col !== to.col && !b[to.row][to.col]) {
//     b[from.row][to.col] = null;
//   }
//   b[to.row][to.col] = { ...piece, hasMoved: true };
//   b[from.row][from.col] = null;
//   // Castling
//   if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
//     if (to.col === 6) {
//       b[from.row][5] = { ...b[from.row][7], hasMoved: true };
//       b[from.row][7] = null;
//     } else {
//       b[from.row][3] = { ...b[from.row][0], hasMoved: true };
//       b[from.row][0] = null;
//     }
//   }
//   // Promotion
//   if (piece.type === 'pawn' && (to.row === 0 || to.row === 7))
//     b[to.row][to.col] = { ...b[to.row][to.col], type: 'queen' };
// };
//
// const applyMoveClean = (b, from, to, piece) => {
//   const nb = cloneBoard(b);
//   applyMoveToBoard(nb, from, to, piece);
//   return nb;
// };
//
// const getLegalMoves = (b, pos, enPassant) => {
//   const p = b[pos.row][pos.col];
//   if (!p) return [];
//   return getRawMoves(b, pos, enPassant).filter(to => {
//     const nb = applyMoveClean(b, pos, to, p);
//     return !isInCheckFn(nb, p.color);
//   });
// };
//
// const hasAnyLegal = (b, color, enPassant) => {
//   for (let r = 0; r < 8; r++)
//     for (let c = 0; c < 8; c++)
//       if (b[r][c] && b[r][c].color === color && getLegalMoves(b, {row:r,col:c}, enPassant).length > 0)
//         return true;
//   return false;
// };
//
// // ============================================================
// // AI ENGINE
// // ============================================================
// const PIECE_VALUES = { pawn:100, knight:320, bishop:330, rook:500, queen:900, king:20000 };
//
// const PST = {
//   pawn:   [[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
//   knight: [[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
//   bishop: [[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
//   rook:   [[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
//   queen:  [[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
//   king:   [[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]],
// };
//
// const pstScore = (type, color, row, col) => {
//   const r = color === 'white' ? row : 7 - row;
//   return PST[type][r][col];
// };
//
// const evalBoard = (b, forColor) => {
//   let score = 0;
//   for (let r = 0; r < 8; r++)
//     for (let c = 0; c < 8; c++) {
//       const p = b[r][c];
//       if (!p) continue;
//       const v = PIECE_VALUES[p.type] + pstScore(p.type, p.color, r, c);
//       score += p.color === forColor ? v : -v;
//     }
//   return score;
// };
//
// const getAllMoves = (b, color, en) => {
//   const moves = [];
//   for (let r = 0; r < 8; r++)
//     for (let c = 0; c < 8; c++)
//       if (b[r][c] && b[r][c].color === color)
//         getLegalMoves(b, {row:r,col:c}, en).forEach(to => moves.push({from:{row:r,col:c}, to}));
//   return moves;
// };
//
// const minimax = (b, depth, alpha, beta, maximizing, aiColor) => {
//   const curColor = maximizing ? aiColor : opp(aiColor);
//   if (depth === 0) return evalBoard(b, aiColor);
//   const moves = getAllMoves(b, curColor, null);
//   if (moves.length === 0) return isInCheckFn(b, curColor) ? (maximizing ? -99999 : 99999) : 0;
//   if (maximizing) {
//     let best = -Infinity;
//     for (const m of moves) {
//       const p = b[m.from.row][m.from.col];
//       const nb = applyMoveClean(b, m.from, m.to, p);
//       best = Math.max(best, minimax(nb, depth-1, alpha, beta, false, aiColor));
//       alpha = Math.max(alpha, best);
//       if (beta <= alpha) break;
//     }
//     return best;
//   } else {
//     let best = Infinity;
//     for (const m of moves) {
//       const p = b[m.from.row][m.from.col];
//       const nb = applyMoveClean(b, m.from, m.to, p);
//       best = Math.min(best, minimax(nb, depth-1, alpha, beta, true, aiColor));
//       beta = Math.min(beta, best);
//       if (beta <= alpha) break;
//     }
//     return best;
//   }
// };
//
// const getBestAIMove = (b, color, depth, en) => {
//   const moves = getAllMoves(b, color, en);
//   if (moves.length === 0) return null;
//   if (depth <= 1) return moves[Math.floor(Math.random() * moves.length)];
//   let bestMove = moves[0], bestVal = -Infinity;
//   const shuffled = [...moves].sort(() => Math.random() - 0.5);
//   for (const m of shuffled) {
//     const p = b[m.from.row][m.from.col];
//     const nb = applyMoveClean(b, m.from, m.to, p);
//     const val = minimax(nb, depth-1, -Infinity, Infinity, false, color);
//     if (val > bestVal) { bestVal = val; bestMove = m; }
//   }
//   return bestMove;
// };
//
// // ============================================================
// // STORAGE
// // ============================================================
// const STATS_KEY = 'chess_stats_v2';
// const loadStats = () => {
//   try { const s = localStorage.getItem(STATS_KEY); if (s) return JSON.parse(s); } catch {}
//   return { points: 20, wins: 0, losses: 0, gamesPlayed: 0 };
// };
// const saveStats = (s) => { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch {} };
//
// // ============================================================
// // CHILD COMPONENTS
// // ============================================================
//
// function SquareCell({ square, position, isSelected, isValid, isLastMove, isCheckKing, onClick }) {
//   const { row, col } = position;
//   const isLight = (row + col) % 2 === 0;
//   let bg = isLight ? '#f0d9b5' : '#b58863';
//   if (isCheckKing) bg = '#e74c3c';
//   else if (isSelected) bg = '#f6f669';
//   else if (isLastMove) bg = isLight ? '#cdd16e' : '#aaa23a';
//   const isWhite = square && square.color === 'white';
//
//   return (
//     <div onClick={() => onClick(position)} style={{
//       width: '100%', aspectRatio: '1', backgroundColor: bg,
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       position: 'relative', cursor: (square || isValid) ? 'pointer' : 'default',
//       userSelect: 'none', transition: 'background-color 0.1s',
//     }}>
//       {isValid && (
//         <div style={{
//           position: 'absolute',
//           width: square ? '86%' : '34%', height: square ? '86%' : '34%',
//           borderRadius: '50%',
//           background: square ? 'transparent' : 'rgba(0,0,0,0.18)',
//           border: square ? '3px solid rgba(0,0,0,0.3)' : 'none',
//           zIndex: 1, pointerEvents: 'none',
//         }} />
//       )}
//       {square && (
//         <span style={{
//           fontSize: 'clamp(18px, 6vw, 50px)', lineHeight: 1, zIndex: 2,
//           color: isWhite ? '#fff' : '#1a1a1a',
//           textShadow: isWhite
//             ? '0 1px 3px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.8)'
//             : '0 1px 2px rgba(255,255,255,0.2)',
//           WebkitTextStroke: isWhite ? '0.8px #666' : '0.5px #999',
//         }}>
//           {PIECE_SYMBOLS[square.type][square.color]}
//         </span>
//       )}
//       {col === 0 && (
//         <span style={{ position: 'absolute', top: 2, left: 3, fontSize: '10px', fontWeight: 700, color: isLight ? '#b58863' : '#f0d9b5', lineHeight: 1, zIndex: 3 }}>
//           {8 - row}
//         </span>
//       )}
//       {row === 7 && (
//         <span style={{ position: 'absolute', bottom: 2, right: 3, fontSize: '10px', fontWeight: 700, color: isLight ? '#b58863' : '#f0d9b5', lineHeight: 1, zIndex: 3 }}>
//           {String.fromCharCode(97 + col)}
//         </span>
//       )}
//     </div>
//   );
// }
//
// function ChessBoard({ board, selected, validMoves, history, inCheck, currentTurn, onSquareClick }) {
//   const last = history[history.length - 1];
//   return (
//     <div style={{
//       display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
//       width: '100%', maxWidth: '520px',
//       border: '4px solid #3d2b1f', borderRadius: '4px', overflow: 'hidden',
//       boxShadow: '0 16px 60px rgba(0,0,0,0.6)',
//     }}>
//       {board.map((row, ri) => row.map((sq, ci) => {
//         const pos = { row: ri, col: ci };
//         const isCheckKing = inCheck && sq && sq.type === 'king' && sq.color === currentTurn;
//         return (
//           <SquareCell key={`${ri}-${ci}`} square={sq} position={pos}
//             isSelected={!!(selected && posEq(selected, pos))}
//             isValid={validMoves.some(m => posEq(m, pos))}
//             isLastMove={!!(last && (posEq(last.from, pos) || posEq(last.to, pos)))}
//             isCheckKing={!!isCheckKing}
//             onClick={onSquareClick}
//           />
//         );
//       }))}
//     </div>
//   );
// }
//
// function DifficultySelector({ selected, onSelect, points, onStart }) {
//   const cfg = DIFFICULTY_CONFIG[selected];
//   const canAfford = points > cfg.cost;
//   const diffs = ['easy', 'medium', 'hard', 'expert'];
//   const colors = { easy: '#27ae60', medium: '#2980b9', hard: '#d4880e', expert: '#c0392b' };
//
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
//       <p style={{ color: '#b8a898', fontSize: '13px', margin: 0, textAlign: 'center' }}>
//         Your points must exceed the entry cost · Win to earn rewards
//       </p>
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
//         {diffs.map(d => {
//           const c = DIFFICULTY_CONFIG[d];
//           const isSel = d === selected;
//           const color = colors[d];
//           return (
//             <button key={d} onClick={() => onSelect(d)} style={{
//               background: isSel ? `linear-gradient(135deg, ${color}22, ${color}44)` : 'rgba(255,255,255,0.04)',
//               border: `2px solid ${isSel ? color : 'rgba(255,255,255,0.1)'}`,
//               borderRadius: '10px', padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
//               boxShadow: isSel ? `0 0 20px ${color}33` : 'none', transition: 'all 0.2s',
//             }}>
//               <div style={{ fontSize: '20px', marginBottom: '4px' }}>{c.emoji}</div>
//               <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{c.label}</div>
//               <div style={{ fontSize: '11px', color: '#b8a898', marginBottom: '8px' }}>{c.description}</div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
//                 <span style={{ color: '#e74c3c' }}>−{c.cost} pts</span>
//                 <span style={{ color: '#2ecc71' }}>+{c.reward} pts win</span>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//       <button onClick={onStart} disabled={!canAfford} style={{
//         background: canAfford ? 'linear-gradient(135deg, #8B6914, #c9a227)' : 'rgba(255,255,255,0.06)',
//         border: canAfford ? '2px solid #c9a227' : '2px solid rgba(255,255,255,0.1)',
//         borderRadius: '10px', padding: '16px', cursor: canAfford ? 'pointer' : 'not-allowed',
//         color: canAfford ? '#fff' : '#555', fontFamily: 'Georgia, serif',
//         fontSize: '17px', fontWeight: 700, letterSpacing: '0.5px',
//         boxShadow: canAfford ? '0 0 30px rgba(201,162,39,0.25)' : 'none', transition: 'all 0.2s',
//       }}>
//         {canAfford ? `Start · Pay ${cfg.cost} pts` : `Need more than ${cfg.cost} pts`}
//       </button>
//       {!canAfford && (
//         <p style={{ textAlign: 'center', color: '#e74c3c', fontSize: '12px', margin: 0 }}>
//           Win easier levels first to earn more points!
//         </p>
//       )}
//     </div>
//   );
// }
//
// function GameOverModal({ playerWon, status, difficulty, onPlayAgain, onChangeLevel }) {
//   const cfg = DIFFICULTY_CONFIG[difficulty];
//   const isDraw = status === 'stalemate';
//   return (
//     <div style={{
//       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
//       backdropFilter: 'blur(10px)',
//     }}>
//       <div style={{
//         background: 'linear-gradient(145deg, #140e04, #221808)',
//         border: `2px solid ${playerWon ? '#c9a227' : isDraw ? '#3498db' : '#e74c3c'}`,
//         borderRadius: '20px', padding: '36px', maxWidth: '360px', width: '90%', textAlign: 'center',
//         boxShadow: `0 0 80px ${playerWon ? 'rgba(201,162,39,0.35)' : isDraw ? 'rgba(52,152,219,0.3)' : 'rgba(231,76,60,0.35)'}`,
//       }}>
//         <div style={{ fontSize: '56px', marginBottom: '10px' }}>
//           {playerWon ? '🏆' : isDraw ? '🤝' : '💀'}
//         </div>
//         <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>
//           {playerWon ? 'Victory!' : isDraw ? 'Stalemate!' : 'Defeated!'}
//         </div>
//         <div style={{ color: '#b8a898', fontSize: '14px', marginBottom: '24px' }}>
//           {playerWon ? `You beat the ${cfg.label} AI!` : isDraw ? 'The game is a draw.' : `The ${cfg.label} AI wins.`}
//         </div>
//         {playerWon && (
//           <div style={{
//             background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)',
//             borderRadius: '10px', padding: '14px', marginBottom: '20px',
//           }}>
//             <span style={{ color: '#c9a227', fontSize: '22px', fontWeight: 700 }}>+{cfg.reward}</span>
//             <span style={{ color: '#b8a898', fontSize: '13px', marginLeft: '6px' }}>points earned!</span>
//           </div>
//         )}
//         <div style={{ display: 'flex', gap: '12px' }}>
//           <button onClick={onPlayAgain} style={{
//             flex: 1, background: 'linear-gradient(135deg, #8B6914, #c9a227)', border: 'none',
//             borderRadius: '10px', padding: '14px', color: '#fff', fontFamily: 'Georgia, serif',
//             fontSize: '15px', fontWeight: 700, cursor: 'pointer',
//           }}>Play Again</button>
//           <button onClick={onChangeLevel} style={{
//             flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
//             borderRadius: '10px', padding: '14px', color: '#fff', fontFamily: 'Georgia, serif',
//             fontSize: '14px', cursor: 'pointer',
//           }}>Change Level</button>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// function MoveHistory({ moves }) {
//   const endRef = useRef(null);
//   useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' }); }, [moves.length]);
//
//   const colL = (c) => String.fromCharCode(97 + c);
//   const rowN = (r) => 8 - r;
//   const fmt = (m) => {
//     if (m.isCastle) return m.to.col === 6 ? 'O-O' : 'O-O-O';
//     const sym = m.piece.type !== 'pawn' ? PIECE_SYMBOLS[m.piece.type][m.piece.color] : '';
//     const cap = (m.captured || m.isEnPassant) ? 'x' : '';
//     const ff = m.piece.type === 'pawn' && cap ? colL(m.from.col) : '';
//     return `${sym}${ff}${cap}${colL(m.to.col)}${rowN(m.to.row)}`;
//   };
//
//   const pairs = [];
//   for (let i = 0; i < moves.length; i += 2) pairs.push([moves[i], moves[i+1]]);
//
//   return (
//     <div style={{
//       background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
//       borderRadius: '10px', padding: '12px', maxHeight: '160px', overflowY: 'auto', width: '100%',
//     }}>
//       <div style={{ color: '#b8a898', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
//         Move History
//       </div>
//       {pairs.length === 0
//         ? <div style={{ color: '#444', fontSize: '12px', textAlign: 'center', padding: '8px' }}>No moves yet</div>
//         : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2px 8px' }}>
//             {pairs.map(([w, b], i) => (
//               <React.Fragment key={i}>
//                 <span style={{ color: '#444', fontSize: '11px', lineHeight: '20px' }}>{i+1}.</span>
//                 <span style={{ color: '#e8dcc8', fontSize: '12px', fontFamily: 'monospace', lineHeight: '20px' }}>{fmt(w)}</span>
//                 <span style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace', lineHeight: '20px' }}>{b ? fmt(b) : ''}</span>
//               </React.Fragment>
//             ))}
//           </div>
//         )
//       }
//       <div ref={endRef} />
//     </div>
//   );
// }