// hooks/useGameClick.ts
import { useGameStore } from '../Store/gameStore';
import { useAuth } from './useAuth';
import { useUI } from './useUI';
import { useCallback } from 'react';
import type { GameCard } from '../types/game';

export const useGameClick = () => {
    const { setSelectedGame, setShowGameOverlay } = useGameStore();
    const { isLoggedIn } = useAuth();
    const { setShowAuthModal, setAuthModalMode } = useUI();

    const handleGameClick = useCallback((gameId: string | number, gameData?: GameCard) => {
        // If gameData is provided, use it; otherwise find it in the store
        let game = gameData;

        if (!game) {
            const gameStore = useGameStore.getState();
            game = gameStore.games.find(g => g.id === gameId || g.id === String(gameId));
        }

        if (!game) {
            console.warn(`Game ${gameId} not found`);
            return false;
        }

        // Check if user is logged in
        if (!isLoggedIn) {
            showLoginToast();
            setAuthModalMode('login');
            setShowAuthModal(true);
            return false;
        }

        // Track the game open in session storage
        trackGameOpen(game);

        // Set the selected game and show overlay
        setSelectedGame(game);
        setShowGameOverlay(true);
        return true;
    }, [isLoggedIn, setAuthModalMode, setShowAuthModal, setSelectedGame, setShowGameOverlay]);

    const handleGameCardClick = useCallback((game: GameCard) => {
        return handleGameClick(game.id, game);
    }, [handleGameClick]);

    const showLoginToast = useCallback(() => {
        // You can implement toast here if needed
        console.log('Please login to play');
    }, []);

    return {
        handleGameClick,
        handleGameCardClick,
        showLoginToast
    };
};

// Helper function to track game opens (not a hook)
const trackGameOpen = (game: GameCard) => {
    try {
        const savedOpenedGames = sessionStorage.getItem('openedGames');
        let openedGames: GameCard[] = savedOpenedGames ? JSON.parse(savedOpenedGames) : [];

        // Remove if already exists
        const existingIndex = openedGames.findIndex(g => g.id === game.id);
        if (existingIndex !== -1) {
            openedGames.splice(existingIndex, 1);
        }

        // Add to beginning
        openedGames = [game, ...openedGames];

        // Limit to 20 games
        if (openedGames.length > 20) {
            openedGames = openedGames.slice(0, 20);
        }

        sessionStorage.setItem('openedGames', JSON.stringify(openedGames));

        // Optional: Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('openedGamesUpdated', { detail: openedGames }));
    } catch (error) {
        console.error('Failed to track opened game:', error);
    }
};