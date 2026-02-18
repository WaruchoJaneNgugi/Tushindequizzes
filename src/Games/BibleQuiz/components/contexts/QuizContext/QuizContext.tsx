// src/contexts/QuizContext/QuizContext.tsx
import React, { createContext, useState, type ReactNode } from 'react';
import type {QuizSession, QuizResult, UserAnswer} from '../../types/quiz';



interface QuizContextType {
    currentQuizId: string | null;
    quizSession: QuizSession | null;
    quizResults: QuizResult[];

    startQuiz: (quizId: string) => void;
    submitAnswer: (questionId: string, selectedOption: number, timeSpent: number) => void;
    completeQuiz: () => QuizResult;
    resetQuiz: () => void;
    getQuizResults: (quizId: string) => QuizResult[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);
//
// export const useQuiz = () => {
//     const context = useContext(QuizContext);
//     if (!context) {
//         throw new Error('useQuiz must be used within a QuizProvider');
//     }
//     return context;
// };

interface QuizProviderProps {
    children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
    const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
    const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
    const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

    const startQuiz = (quizId: string) => {
        setCurrentQuizId(quizId);
        setQuizSession({
            score: 0,
            currentQuestionIndex: 0,
            userAnswers: [],
            startTime: new Date(),
            isCompleted: false
        });
    };

    const submitAnswer = (questionId: string, selectedOption: number, timeSpent: number) => {
        if (!quizSession) return;

        // In a real app, you would check if the answer is correct
        // For now, we'll mark all as correct (you'll need to implement actual checking)
        const isCorrect = true; // This should come from your question data

        const newAnswer: UserAnswer = {
            questionId,
            selectedOption,
            isCorrect,
            timeSpent
        };

        setQuizSession(prev => {
            if (!prev) return null;
            return {
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                userAnswers: [...prev.userAnswers, newAnswer]
            };
        });
    };

    const completeQuiz = (): QuizResult => {
        if (!quizSession || !currentQuizId) {
            throw new Error('No active quiz session');
        }

        const correctAnswers = quizSession.userAnswers.filter(a => a.isCorrect).length;
        const totalQuestions = quizSession.userAnswers.length;
        const score = quizSession.userAnswers.reduce((sum, answer) =>
            sum + (answer.isCorrect ? 10 : 0), 0
        );

        const endTime = new Date();
        const timeSpent = (endTime.getTime() - quizSession.startTime.getTime()) / 1000;

        const result: QuizResult = {
            quizId: currentQuizId,
            score,
            totalQuestions,
            correctAnswers,
            wrongAnswers: totalQuestions - correctAnswers,
            percentage: Math.round((correctAnswers / totalQuestions) * 100),
            timeSpent,
            answers: quizSession.userAnswers,
            completedAt: endTime
        };

        setQuizResults(prev => [...prev, result]);
        setQuizSession(prev => prev ? { ...prev, isCompleted: true } : null);

        return result;
    };

    const resetQuiz = () => {
        setCurrentQuizId(null);
        setQuizSession(null);
    };

    const getQuizResults = (quizId: string): QuizResult[] => {
        return quizResults.filter(result => result.quizId === quizId);
    };

    return (
        <QuizContext.Provider value={{
            currentQuizId,
            quizSession,
            quizResults,
            startQuiz,
            submitAnswer,
            completeQuiz,
            resetQuiz,
            getQuizResults
        }}>
            {children}
        </QuizContext.Provider>
    );
};