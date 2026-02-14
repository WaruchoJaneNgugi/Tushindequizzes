// export interface Quiz {
//     id: string;
//     title: string;
//     description: string;
//     duration: string;
//     participants: number;
//     difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Advance';
//     category: string;
//     tags?: string[];
//     completed?: boolean;
// }
//
// export interface DashboardStats {
//     totalCompleted: number;
//     participationRate: number;
//     createQuizPercentage: number;
// }
// In src/types/quiz.ts, add these properties to Quiz interface
export interface Quiz {
    id: string;
    title: string;
    description: string;
    duration: string;
    participants: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    tags?: string[];
    completed?: boolean;
    gameType?: 'quiz' | 'riddle' | 'puzzle' | 'timed';
    points: number;
    entryFee?: number;
    rating?: number; // Add this
    author?: string; // Add this
    totalQuizzes?: number; // Add this for "See all" count
}

export interface DashboardStats {
    totalCompleted: number;
    participationRate: number;
    createQuizPercentage: number;
    totalPoints: number;
    rank: string;
    level: number;
}

export interface GameCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    totalGames: number;
}