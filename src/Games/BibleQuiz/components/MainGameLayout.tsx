// Mahjong/components/MainGameLayout.tsx - COMPLETE WORKING VERSION
import type { FC } from "react";
import { useState } from 'react';
import { QuizProvider } from './contexts/QuizContext/QuizContext';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import HomePage from '../pages/HomePage/HomePage';
import QuizPage from '../pages/QuizPage/QuizPage';
import ResultsPage from '../pages/ResultsPage/ResultPage';
import './MainGameLayout.css';

interface MainGameLayoutProps {
    isOpen?: boolean;
    onClose?: () => void;
    initialView?: 'home' | 'quiz' | 'results';
    initialQuizId?: string;
    standalone?: boolean;
}

// Quiz results interface matching what QuizPage sends
interface QuizResults {
    score: number;
    correctCount: number;
    totalQuestions: number;
    timeSpent: number;
    percentage: number;
}

export const MainGameLayout: FC<MainGameLayoutProps> = ({
                                                            isOpen = true,
                                                            onClose,
                                                            initialView = 'home',
                                                            initialQuizId,
                                                            standalone = true
                                                        }) => {
    const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'results'>(initialView);
    const [currentQuizId, setCurrentQuizId] = useState<string | undefined>(initialQuizId);
    const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Navigation handlers
    const goToHome = () => {
        setCurrentView('home');
        setCurrentQuizId(undefined);
        setQuizResults(null);
    };

    const goToQuiz = (quizId: string) => {
        setCurrentView('quiz');
        setCurrentQuizId(quizId);
        setQuizResults(null);
    };

    const goToResults = (quizId: string, results: QuizResults) => {
        console.log('Quiz completed with results:', results);
        setCurrentView('results');
        setCurrentQuizId(quizId);
        setQuizResults(results);
    };

    const handleBack = () => {
        if (currentView === 'quiz') {
            goToHome();
        } else if (currentView === 'results') {
            goToHome();
        } else if (!standalone) {
            onClose?.();
        }
    };

    const handleRetry = () => {
        if (currentQuizId) {
            goToQuiz(currentQuizId);
        }
    };

    if (!isOpen && !standalone) return null;

    const getHeaderTitle = () => {
        switch (currentView) {
            case 'home':
                return "Bible Challenge Quizzes";
            case 'quiz':
                return "Bible Quiz";
            case 'results':
                return "Quiz Results";
            default:
                return "Bible Challenge";
        }
    };

    const getHeaderSubtitle = () => {
        switch (currentView) {
            case 'home':
                return "How well do you know the Bible? Find out with the Bible Challenge!";
            case 'quiz':
                return quizResults ? `${quizResults.correctCount}/${quizResults.totalQuestions} correct` : "Test your knowledge";
            case 'results':
                return quizResults ? `${quizResults.percentage}% Score` : "Your results";
            default:
                return "How well do you know the Bible?";
        }
    };

    const gameContent = (
        <QuizProvider>
            <div className="main-game-layout">
                <Header
                    useImageHeader={currentView === 'home'}
                    showBackButton={currentView !== 'home'}
                    onBackClick={handleBack}
                    soundEnabled={soundEnabled}
                    onSoundToggle={() => setSoundEnabled(!soundEnabled)}
                    title={getHeaderTitle()}
                    subtitle={getHeaderSubtitle()}
                />

                <main className="game-main">
                    {currentView === 'home' && (
                        <HomePage onSelectQuiz={goToQuiz} />
                    )}

                    {currentView === 'quiz' && currentQuizId && (
                        <QuizPage
                            quizId={currentQuizId}
                            onComplete={(results) => goToResults(currentQuizId, results)}
                            onGameOver={goToHome}
                        />
                    )}

                    {currentView === 'results' && currentQuizId && quizResults && (
                        <ResultsPage
                            quizId={currentQuizId}
                            score={quizResults.score}
                            timeSpent={quizResults.timeSpent}
                            onRetry={handleRetry}
                            onHome={goToHome}
                        />
                    )}
                </main>

                <Footer />
            </div>
        </QuizProvider>
    );

    if (standalone) {
        return gameContent;
    }

    return (
        <div className="game-modal-overlay" onClick={onClose}>
            <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
                {gameContent}
            </div>
        </div>
    );
};