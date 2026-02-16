// hooks/useAchievements.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {type Achievement, achievementsAPI, type AchievementStats} from "../Store/achievementsService.ts";

export const useAchievements = () => {
    const { token } = useAuth();
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
            console.log('Fetching user achievements...');
            const data = await achievementsAPI.getUserAchievements(token);
            console.log('User achievements fetched successfully:', data);
            setAchievements(data);
        } catch (err) {
            console.error('Error in fetchUserAchievements:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
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
        console.log('useAchievements useEffect triggered');
        fetchStats();
        fetchUserAchievements();
    }, [fetchStats, fetchUserAchievements]);

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