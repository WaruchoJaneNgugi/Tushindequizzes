// hooks/useTrackGameOpen.ts
import { useEffect } from 'react';
import type { GameCard } from '../types/game';

export const useTrackGameOpen = (gameId: string | number, gameData?: GameCard) => {
    useEffect(() => {
        if (!gameId || !gameData) return;

        try {
            const savedOpenedGames = sessionStorage.getItem('openedGames');
            let openedGames: GameCard[] = savedOpenedGames ? JSON.parse(savedOpenedGames) : [];

            // Remove if already exists
            const existingIndex = openedGames.findIndex(g => g.id === gameId);
            if (existingIndex !== -1) {
                openedGames.splice(existingIndex, 1);
            }

            // Add to beginning
            openedGames = [gameData, ...openedGames];

            // Limit to 20 games
            if (openedGames.length > 20) {
                openedGames = openedGames.slice(0, 20);
            }

            sessionStorage.setItem('openedGames', JSON.stringify(openedGames));
        } catch (error) {
            console.error('Failed to track opened game:', error);
        }
    }, [gameId, gameData]);
};