// src/pages/ResultsPage/ResultPage.tsx - CORRECTED INTERFACE
import React from 'react';
import ScoreDisplay from '../../components/ScoreDisplay/ScoreDisplay';
import { getQuizById } from '../../components/data/quizzes.ts';
import { getQuestionsByQuizId } from '../../components/data/questions.ts';
import './ResultsPage.css';

// Make sure this interface includes timeSpent
interface ResultsPageProps {
    quizId: string;
    score: number;
    timeSpent: number;  // This must be here
    onRetry: () => void;
    onHome: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({
                                                     quizId,
                                                     score,
                                                     timeSpent,  // This must be here
                                                     onRetry,
                                                     onHome
                                                 }) => {
    const quiz = getQuizById(quizId);
    const questions = quiz ? getQuestionsByQuizId(quizId) : [];

    if (!quiz) {
        return (
            <div className="resultsPage">
                <div className="container">
                    <div className="errorMessage">
                        <h2>Quiz Not Found</h2>
                        <p>The quiz you're looking for doesn't exist.</p>
                        <button onClick={onHome} className="homeButton">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalQuestions = questions.length || 10;
    const startingPoints = 100;
    const pointsPerQuestion = 10;

    // Calculate points earned/lost
    const pointsEarned = score - startingPoints;

    // Calculate correct answers based on points
    let correctCount = Math.round((pointsEarned + 10 * totalQuestions) / 20);
    correctCount = Math.max(0, Math.min(totalQuestions, correctCount));
    const wrongCount = totalQuestions - correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const totalPossibleScore = startingPoints + (totalQuestions * pointsPerQuestion);

    const results = {
        score: score,
        startingPoints: startingPoints,
        total: totalQuestions,
        totalPossibleScore: totalPossibleScore,
        correct: correctCount,
        wrong: wrongCount,
        percentage: percentage,
        timeSpent: timeSpent,  // Use the passed timeSpent
        scoring: { correctPoints: 10, wrongPenalty: 10 }
    };

    return (
        <div className="resultsPage">
            <main className="mainContent">
                <div className="container">
                    <div className="resultsCard">
                        <div className="quizHeader">
                            <div className="quizIcon" style={{ color: quiz.color }}>
                                {quiz.icon}
                            </div>
                            <div>
                                <h2 className="quizTitle">{quiz.title}</h2>
                                <p className="quizDescription">{quiz.description}</p>
                            </div>
                        </div>

                        <ScoreDisplay
                            score={results.score}
                            startingPoints={results.startingPoints}
                            total={results.total}
                            totalPossibleScore={results.totalPossibleScore}
                            correct={results.correct}
                            wrong={results.wrong}
                            percentage={results.percentage}
                            timeSpent={results.timeSpent}
                            scoring={results.scoring}
                        />

                        <div className="resultsActions">
                            <button
                                onClick={onRetry}
                                className="retryButton"
                                style={{ backgroundColor: quiz.color }}
                            >
                                Try Again
                            </button>
                            <button
                                onClick={onHome}
                                className="homeButton"
                            >
                                Choose Another Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResultsPage;