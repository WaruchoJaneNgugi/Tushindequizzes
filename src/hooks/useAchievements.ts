// hooks/useAchievements.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {type Achievement, achievementsAPI, type AchievementStats} from "../Store/achievementsService.ts";

export const useAchievements = () => {
    const { token, user } = useAuth(); // Get user info as well
    const [stats, setStats] = useState<AchievementStats | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching achievement stats...');
            const data = await achievementsAPI.getStats();
            console.log('Stats fetched successfully:', data);
            setStats(data);
        } catch (err) {
            console.error('Error in fetchStats:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserAchievements = useCallback(async () => {
        if (!token) {
            console.log('No token available, skipping user achievements fetch');
            setAchievements([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log('Fetching user achievements with token...');
            const data = await achievementsAPI.getUserAchievements(token);
            console.log('User achievements fetched successfully:', data);

            if (data && data.length > 0) {
                console.log('First achievement sample:', data[0]);
                setAchievements(data);
            } else {
                console.log('No achievements returned from API');
                // Try fetching all achievements as fallback
                console.log('Fetching all achievements as fallback...');
                const allAchievements = await achievementsAPI.getAllAchievements();
                console.log('All achievements fetched:', allAchievements);

                // Mark them as locked since user hasn't earned them
                const lockedAchievements = allAchievements.map(ach => ({
                    ...ach,
                    status: 'locked'
                }));
                setAchievements(lockedAchievements);
            }
        } catch (err) {
            console.error('Error in fetchUserAchievements:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch achievements');

            // Try fallback to all achievements
            try {
                console.log('Error occurred, fetching all achievements as fallback...');
                const allAchievements = await achievementsAPI.getAllAchievements();
                const lockedAchievements = allAchievements.map(ach => ({
                    ...ach,
                    status: 'locked'
                }));
                setAchievements(lockedAchievements);
            } catch (fallbackErr) {
                console.error('Fallback also failed:', fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    const claimAchievement = useCallback(async (achievementId: string | number) => {
        if (!token) {
            console.error('No token available for claiming');
            throw new Error('Not authenticated');
        }

        setLoading(true);
        setError(null);
        try {
            console.log('Claiming achievement:', achievementId);
            await achievementsAPI.claimAchievement(achievementId, token);
            console.log('Achievement claimed successfully');

            // Refresh achievements after claiming
            await fetchUserAchievements();
            // Also refresh stats as points may have changed
            await fetchStats();
        } catch (err) {
            console.error('Error in claimAchievement:', err);
            setError(err instanceof Error ? err.message : 'Failed to claim achievement');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token, fetchUserAchievements, fetchStats]);

    useEffect(() => {
        console.log('useAchievements useEffect triggered', {
            hasToken: !!token,
            hasUser: !!user
        });

        const loadData = async () => {
            await fetchStats();
            await fetchUserAchievements();
        };

        loadData();
    }, [fetchStats, fetchUserAchievements, token, user]);

    return {
        stats,
        achievements,
        loading,
        error,
        fetchStats,
        fetchUserAchievements,
        claimAchievement
    };
};