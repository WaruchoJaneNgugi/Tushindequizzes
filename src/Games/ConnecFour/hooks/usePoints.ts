import { useState, useCallback } from 'react';
import { INITIAL_POINTS } from '../types/game.types';

export interface UsePointsReturn {
  points: number;
  totalWon: number;
  totalLost: number;
  gamesPlayed: number;
  deductPoints: (amount: number) => boolean;
  addPoints: (amount: number) => void;
  canAfford: (amount: number) => boolean;
}

export const usePoints = (): UsePointsReturn => {
  const [points, setPoints]           = useState<number>(INITIAL_POINTS);
  const [totalWon, setTotalWon]       = useState<number>(0);
  const [totalLost, setTotalLost]     = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  const canAfford = useCallback((amount: number): boolean => points > amount, [points]);

  const deductPoints = useCallback((amount: number): boolean => {
    if (points <= amount) return false;
    setPoints(prev => prev - amount);
    setTotalLost(prev => prev + amount);
    setGamesPlayed(prev => prev + 1);
    return true;
  }, [points]);

  const addPoints = useCallback((amount: number): void => {
    setPoints(prev => prev + amount);
    setTotalWon(prev => prev + amount);
  }, []);

  return { points, totalWon, totalLost, gamesPlayed, deductPoints, addPoints, canAfford };
};
