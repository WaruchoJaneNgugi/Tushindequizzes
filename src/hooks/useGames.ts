import {useGameStore} from "../Store/gameStore";

export const useGames = () => {
    const {
        games,
        filteredGames,
        activeFilter,
        selectedGame,
        showGameOverlay,
        searchQuery,
        isSearchActive,
        setActiveFilter,
        setSelectedGame,
        setShowGameOverlay,
        startGame,
        addGamePoints,
        setSearchQuery,
        setIsSearchActive,
        searchGames,
        getGamesByCategory,
    } = useGameStore();

    return {
        games,
        filteredGames,
        activeFilter,
        selectedGame,
        showGameOverlay,
        searchQuery,
        isSearchActive,
        setActiveFilter,
        setSelectedGame,
        setShowGameOverlay,
        startGame,
        addGamePoints,
        setSearchQuery,
        setIsSearchActive,
        searchGames,
        getGamesByCategory,
    };
};

// // hooks/useGames.ts for api updates
// import { useGameStore } from "../Store/gameStore";
//
// export const useGames = () => {
//     const {
//         games,
//         filteredGames,
//         activeFilter,
//         selectedGame,
//         showGameOverlay,
//         isLoading,
//         error,
//         setActiveFilter,
//         setSelectedGame,
//         setShowGameOverlay,
//         startGame,
//         addGamePoints,
//         fetchGames,
//         fetchGameDetails,
//         searchGames,
//         getGamesByCategory,
//     } = useGameStore();
//
//     return {
//         games,
//         filteredGames,
//         activeFilter,
//         selectedGame,
//         showGameOverlay,
//         isLoading,
//         error,
//         setActiveFilter,
//         setSelectedGame,
//         setShowGameOverlay,
//         startGame,
//         addGamePoints,
//         fetchGames,
//         fetchGameDetails,
//         searchGames,
//         getGamesByCategory,
//     };
// };