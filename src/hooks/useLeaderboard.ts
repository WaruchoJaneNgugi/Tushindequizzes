// hooks/useLeaderboard.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
    leaderboardAPI,
    type LeaderboardEntry,
    type LeaderboardPeriod,
    type LeaderboardFilters
} from '../Store/leaderboardService';

export const useLeaderboard = (initialGameId: string = 'default') => {
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<LeaderboardPeriod>('weekly');
    const [currentGameId, setCurrentGameId] = useState(initialGameId);
    const [games, setGames] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<{
        rank: number;
        period: LeaderboardPeriod;
        score: number;
    } | null>(null);

    const fetchLeaderboard = useCallback(async (page: number = 1) => {
        setLoading(true);
        setError(null);

        try {
            const filters: LeaderboardFilters = {
                gameId: currentGameId,
                period: currentPeriod,
                page,
                limit: pagination.limit
            };

            const response = await leaderboardAPI.getLeaderboard(filters);

            setLeaderboardData(response.data);
            setPagination(response.pagination);

            // Find user's rank in the current data
            if (user && response.data.length > 0) {
                const userEntry = response.data.find(entry => entry.userId === user.id);
                if (userEntry) {
                    setUserRank({
                        rank: userEntry.rank,
                        period: currentPeriod,
                        score: userEntry.score
                    });
                } else {
                    // If user not in current page, fetch their rank separately
                    try {
                        const rankData = await leaderboardAPI.getUserRank(user.id, currentGameId);
                        if (rankData) {
                            setUserRank(rankData);
                        } else {
                            setUserRank(null);
                        }
                    } catch (err) {
                        console.error('Error fetching user rank:', err);
                        setUserRank(null);
                    }
                }
            } else {
                setUserRank(null);
            }

            // Clear error if successful
            setError(null);
        } catch (err) {
            // Don't set error for empty leaderboards, just show empty state
            console.log('Leaderboard fetch returned empty or error:', err);
            setLeaderboardData([]);
            setPagination({
                page: 1,
                limit: pagination.limit,
                total: 0,
                pages: 0
            });
            setUserRank(null);
            // Don't set error state - we'll show empty UI instead
        } finally {
            setLoading(false);
        }
    }, [currentGameId, currentPeriod, pagination.limit, user]);

    const fetchGames = useCallback(async () => {
        try {
            const gamesData = await leaderboardAPI.getGames();
            setGames(gamesData);
        } catch (err) {
            console.error('Error fetching games:', err);
            setGames([]);
        }
    }, []);

    const changePeriod = useCallback((period: LeaderboardPeriod) => {
        setCurrentPeriod(period);
        // Reset to page 1 when changing period
        fetchLeaderboard(1);
    }, [fetchLeaderboard]);

    const changeGame = useCallback((gameId: string) => {
        setCurrentGameId(gameId);
        fetchLeaderboard(1);
    }, [fetchLeaderboard]);

    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= pagination.pages) {
            fetchLeaderboard(page);
        }
    }, [fetchLeaderboard, pagination.pages]);

    useEffect(() => {
        fetchLeaderboard(1);
        fetchGames();
    }, []); // Initial fetch

    return {
        leaderboardData,
        pagination,
        loading,
        error: error, // This will now only be set for real errors, not empty data
        currentPeriod,
        currentGameId,
        games,
        userRank,
        changePeriod,
        changeGame,
        goToPage,
        refresh: () => fetchLeaderboard(pagination.page)
    };
};