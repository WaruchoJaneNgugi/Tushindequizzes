import { useState, useCallback } from 'react';
import type { GameLevel, PointsState, Transaction } from '../types/game.types';

const INITIAL_BALANCE = 1000;

const makeId = () => Math.random().toString(36).slice(2, 9);

export const usePoints = () => {
  const [state, setState] = useState<PointsState>({
    balance: INITIAL_BALANCE,
    transactions: [
      {
        id: makeId(),
        type: 'initial',
        amount: INITIAL_BALANCE,
        level: null,
        timestamp: Date.now(),
      },
    ],
  });

  const addTx = useCallback(
    (type: Transaction['type'], amount: number, level: GameLevel | null) => {
      const tx: Transaction = {
        id: makeId(),
        type,
        amount,
        level,
        timestamp: Date.now(),
      };
      setState((prev) => ({
        balance: prev.balance + amount,
        transactions: [...prev.transactions, tx],
      }));
    },
    []
  );

  /** Deduct wager before game starts. Returns false if insufficient. */
  const deductWager = useCallback(
    (wager: number, level: GameLevel): boolean => {
      if (state.balance <= wager) return false;
      addTx('wager', -wager, level);
      return true;
    },
    [state.balance, addTx]
  );

  /** Add reward on win */
  const addReward = useCallback(
    (reward: number, level: GameLevel) => {
      addTx('reward', reward, level);
    },
    [addTx]
  );

  /** Refund wager on draw (for easy/medium) */
  const refundWager = useCallback(
    (wager: number, level: GameLevel) => {
      addTx('refund', wager, level);
    },
    [addTx]
  );

  /** Check if player can afford to enter this level */
  const canAfford = useCallback(
    (wager: number): boolean => state.balance > wager,
    [state.balance]
  );

  return {
    balance: state.balance,
    transactions: state.transactions,
    deductWager,
    addReward,
    refundWager,
    canAfford,
  };
};
