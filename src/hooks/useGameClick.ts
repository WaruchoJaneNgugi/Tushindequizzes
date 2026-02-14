// hooks/useGameClick.ts
import { useGameStore } from '../Store/gameStore';
import { useAuth } from './useAuth';
import { useUI } from './useUI';

export const useGameClick = () => {
    const { setSelectedGame, setShowGameOverlay } = useGameStore();
    const { isLoggedIn } = useAuth();
    const { setShowAuthModal, setAuthModalMode } = useUI();

    const handleGameClick = (gameId: string | number) => {
        const gameStore = useGameStore.getState();
        const game = gameStore.games.find(g => g.id === gameId || g.id === String(gameId));

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

        // Set the selected game and show overlay
        setSelectedGame(game);
        setShowGameOverlay(true);
        return true;
    };

    const handleGameCardClick = (game: any) => {
        return handleGameClick(game.id);
    };

    // ... showLoginToast function remains the same
    const showLoginToast = () => {
        // ... same as before
    };

    return {
        handleGameClick,
        handleGameCardClick,
        showLoginToast
    };
};