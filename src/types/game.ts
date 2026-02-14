// types/game.ts

export interface GameCard {
    id: string | number;
    title: string;
    content: string;
    imageUrl?: string;
    category?: string;
    tags?: string[];
    description?: string;
    players?: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    points?: number;
    duration?: string;
    isFeatured:boolean;

}

export interface GameCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    totalGames: number;
}

export interface GameStats {
    totalPlayed: number;
    totalPoints: number;
    averageScore: number;
    favoriteCategory: string;
}