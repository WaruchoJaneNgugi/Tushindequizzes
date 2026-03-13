// Mahjong/data/quizzes.ts
// Mahjong/data/quizzes.ts
import type {Quiz} from '../types/quiz';

export const quizzes: Quiz[] = [
    {
        id: 'bible-people',
        title: 'Bible People',
        description: 'Test your knowledge of biblical characters from Adam to Paul',
        category: 'people',
        difficulty: 'medium',
        questionCount: 10,
        icon: '👥',
        color: '#3498db',
        timeLimit: 15,
        scoring: {
            correctPoints: 10,        // +10 for correct
            wrongPenalty: 10,           // -5 for wrong
            timeBonus: true,
            minScore: 0                // Can't go below 0
        }
    },
    {
        id: 'bible-places',
        title: 'Bible Places',
        description: 'Identify locations mentioned throughout Scripture',
        category: 'places',
        difficulty: 'medium',
        questionCount: 10,
        icon: '🗺️',
        color: '#2ecc71',
        timeLimit: 15,
        scoring: {
            correctPoints: 10,        // +10 for correct
            wrongPenalty: 10,           // -5 for wrong
            timeBonus: true,
            minScore: 0                // Can't go below 0
        }
    },
    {
        id: 'bible-events',
        title: 'Bible Events',
        description: 'Major events from biblical history',
        category: 'events',
        difficulty: 'hard',
        questionCount: 10,
        icon: '📜',
        color: '#e74c3c',
        timeLimit: 20,
        scoring: {
            correctPoints: 10,        // +10 for correct
            wrongPenalty: 10,           // -5 for wrong
            timeBonus: true,
            minScore: 0                // Can't go below 0
        }
    },
    {
        id: 'bible-concepts',
        title: 'Bible Concepts',
        description: 'Theological concepts and teachings',
        category: 'concepts',
        difficulty: 'hard',
        questionCount: 10,
        icon: '💭',
        color: '#9b59b6',
        timeLimit: 20,
        scoring: {
            correctPoints: 10,        // +10 for correct
            wrongPenalty: 10,           // -5 for wrong
            timeBonus: true,
            minScore: 0                // Can't go below 0
        }
    },
    {
        id: 'bible-verses',
        title: 'Bible Verses',
        description: 'Identify books, chapters and verses',
        category: 'verses',
        difficulty: 'medium',
        questionCount: 10,
        icon: '📖',
        color: '#f39c12',
        timeLimit: 15,
        scoring: {
            correctPoints: 10,        // +10 for correct
            wrongPenalty: 10,           // -5 for wrong
            timeBonus: true,
            minScore: 0                // Can't go below 0
        }
    },
    {
        id: 'general-bible',
        title: 'General Bible Knowledge',
        description: 'Mixed questions from all categories',
        category: 'general',
        difficulty: 'easy',
        questionCount: 10,
        icon: '❓',
        color: '#1abc9c',
        timeLimit: 10,
        scoring: {
            correctPoints: 10,        // +10 for correct
            wrongPenalty: 10,           // -5 for wrong
            timeBonus: true,
            minScore: 0                // Can't go below 0
        }
    }
];

export const getQuizById = (id: string): Quiz | undefined => {
    return quizzes.find(quiz => quiz.id === id);
};

export const getQuizzesByCategory = (category: string): Quiz[] => {
    return quizzes.filter(quiz => quiz.category === category);
};