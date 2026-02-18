import { useState, useCallback } from 'react';
import { type PlayerStats, type Difficulty, DIFFICULTY_CONFIG } from '../types/chess.ts';

export const STORAGE_KEY = 'chess_player_stats';

export const loadStats = (): PlayerStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error){console.log(error)}
  return { points: 50, wins: 0, losses: 0, gamesPlayed: 0 };
};

export const saveStats = (stats: PlayerStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error){
    console.log(error);
  }
};

export const usePlayerStats = () => {
  const [stats, setStats] = useState<PlayerStats>(loadStats);

  const canAfford = useCallback((difficulty: Difficulty): boolean => {
    return stats.points > DIFFICULTY_CONFIG[difficulty].cost;
  }, [stats.points]);

  const deductCost = useCallback((difficulty: Difficulty) => {
    setStats(prev => {
      const updated = { ...prev, points: prev.points - DIFFICULTY_CONFIG[difficulty].cost, gamesPlayed: prev.gamesPlayed + 1 };
      saveStats(updated);
      return updated;
    });
  }, []);

  const addWinReward = useCallback((difficulty: Difficulty) => {
    setStats(prev => {
      const updated = { ...prev, points: prev.points + DIFFICULTY_CONFIG[difficulty].reward, wins: prev.wins + 1 };
      saveStats(updated);
      return updated;
    });
  }, []);

  const recordLoss = useCallback(() => {
    setStats(prev => {
      const updated = { ...prev, losses: prev.losses + 1 };
      saveStats(updated);
      return updated;
    });
  }, []);

  const resetStats = useCallback(() => {
    const fresh: PlayerStats = { points: 20, wins: 0, losses: 0, gamesPlayed: 0 };
    setStats(fresh);
    saveStats(fresh);
  }, []);

  return { stats, canAfford, deductCost, addWinReward, recordLoss, resetStats };
};
