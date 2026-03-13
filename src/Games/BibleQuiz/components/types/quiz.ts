// Mahjong/types/quiz.types.ts
export type QuizCategory = 'people' | 'places' | 'events' | 'concepts' | 'verses' | 'general';

export interface QuizConfig {
    correctPoints: number;      // Points gained for correct answer
    wrongPenalty: number;        // Points deducted for wrong answer
    timeBonus?: boolean;         // Optional time bonus
    minScore?: number;           // Minimum score (can't go below 0)
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    category: QuizCategory;
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    icon: string;
    color: string;
    timeLimit?: number; // in minutes
    scoring: QuizConfig;
}

export interface Question {
    id: string;
    quizId: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    bibleReference?: string;
    points: number;
}

export interface UserAnswer {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeSpent: number; // in seconds
}

export interface QuizResult {
    quizId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    percentage: number;
    timeSpent: number;
    answers: UserAnswer[];
    completedAt: Date;
}

export interface QuizSession {
    currentQuestionIndex: number;
    userAnswers: UserAnswer[];
    startTime: Date;
    isCompleted: boolean;
    score: number;
}