// src/pages/QuizPage/QuizPage.tsx - COMPLETE VERSION
import React, { useState, useEffect, useRef } from 'react';
import { useGameSounds } from '../../hooks/useGameSounds';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import GameOverModal from '../../components/GameOverModal/GameOverModal';
import { getQuizById } from '../../components/data/quizzes';
import { getQuestionsByQuizId } from '../../components/data/questions';
import type { Question, Quiz } from '../../components/types/quiz';
import './QuizPage.css';

const STARTING_POINTS = 100;

interface UserAnswer {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    pointsEarned: number;
    timeSpent?: number;
}

interface QuizPageProps {
    quizId: string;
    onComplete: (results: {
        score: number;
        correctCount: number;
        totalQuestions: number;
        timeSpent: number;
        percentage: number;
    }) => void;
    onGameOver: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ quizId, onComplete, onGameOver }) => {
    const sounds = useGameSounds({ volume: 0.5, soundEnabled: true });

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [score, setScore] = useState(STARTING_POINTS);
    const [showFeedback, setShowFeedback] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverReason, setGameOverReason] = useState<'points' | 'time' | 'quit'>('points');

    const lastWarningPlayed = useRef<'none' | 'low' | 'critical'>('none');
    const questionStartTime = useRef<Date>(new Date());
    const userAnswersRef = useRef<UserAnswer[]>([]);

    // Load quiz data
    useEffect(() => {
        const currentQuiz = getQuizById(quizId);
        const quizQuestions = getQuestionsByQuizId(quizId);

        setQuiz(currentQuiz ?? null);
        setQuestions(quizQuestions);
        setIsLoading(false);

        if (currentQuiz?.timeLimit) {
            setTimeLeft(currentQuiz.timeLimit * 60);
        }

        questionStartTime.current = new Date();
    }, [quizId]);

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && !quizCompleted && !gameOver && questions.length > 0 && !isLoading) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !quizCompleted && !gameOver && questions.length > 0) {
            sounds.playGameOver();
            setGameOver(true);
            setGameOverReason('time');
        }
    }, [timeLeft, quizCompleted, gameOver, questions.length, isLoading, sounds]);

    // Warning sounds effect
    useEffect(() => {
        if (gameOver || quizCompleted) return;

        if (score <= 20 && score > 0 && lastWarningPlayed.current !== 'critical') {
            sounds.playCritical();
            lastWarningPlayed.current = 'critical';
        } else if (score <= 40 && score > 20 && lastWarningPlayed.current !== 'low') {
            sounds.playLowScore();
            lastWarningPlayed.current = 'low';
        } else if (score > 40) {
            lastWarningPlayed.current = 'none';
        }
    }, [score, gameOver, quizCompleted, sounds]);

    const calculatePoints = (isCorrect: boolean): number => isCorrect ? 10 : -10;
    const checkGameOver = (newScore: number): boolean => newScore <= 0;

    const handleAnswerSelect = (answerIndex: number) => {
        if (showFeedback || quizCompleted || gameOver || !quiz) return;

        sounds.playClick();

        const timeSpent = Math.floor((new Date().getTime() - questionStartTime.current.getTime()) / 1000);
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answerIndex === currentQuestion.correctAnswer;

        if (isCorrect) sounds.playCorrect();
        else sounds.playWrong();

        const pointsEarned = calculatePoints(isCorrect);
        const newScore = score + pointsEarned;

        if (checkGameOver(newScore)) {
            sounds.playGameOver();
            setGameOver(true);
            setGameOverReason('points');
            setScore(newScore);
            return;
        }

        setScore(newScore);

        const userAnswer: UserAnswer = {
            questionId: currentQuestion.id,
            selectedOption: answerIndex,
            isCorrect,
            pointsEarned,
            timeSpent
        };

        setUserAnswers(prev => [...prev, userAnswer]);
        userAnswersRef.current = [...userAnswersRef.current, userAnswer];
        setSelectedAnswer(answerIndex);
        setShowFeedback(true);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
                questionStartTime.current = new Date();
            } else {
                handleQuizComplete();
            }
        }, 1500);
    };

    // In QuizPage.tsx - Verify handleQuizComplete
    const handleQuizComplete = () => {
        if (quizCompleted || gameOver || !quiz) return;

        sounds.playLevelComplete();
        setQuizCompleted(true);

        const finalAnswers = userAnswersRef.current;
        let correctCount = 0;
        let totalScore = STARTING_POINTS;

        questions.forEach(question => {
            const answer = finalAnswers.find(a => a.questionId === question.id);
            if (answer) {
                totalScore += answer.pointsEarned;
                if (answer.isCorrect) correctCount++;
            }
        });

        // Calculate time spent correctly
        const totalTimeSeconds = quiz.timeLimit ? (quiz.timeLimit * 60) - timeLeft : 0;
        const timeSpent = Math.max(0, totalTimeSeconds); // Ensure non-negative

        // ✅ Calculate percentage
        const percentage = Math.round((correctCount / questions.length) * 100);

        console.log('Quiz completed:', {
            score: totalScore,
            correctCount,
            totalQuestions: questions.length,
            timeSpent,
            percentage
        });

        setTimeout(() => onComplete({
            score: totalScore,
            correctCount,
            totalQuestions: questions.length,
            timeSpent,
            percentage
        }), 1500);
    };

    const handleGameOverClose = (action: 'retry' | 'home') => {
        sounds.playClick();
        if (action === 'retry') {
            // Reset and retry
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
            setUserAnswers([]);
            userAnswersRef.current = [];
            setScore(STARTING_POINTS);
            setShowFeedback(false);
            setGameOver(false);
            questionStartTime.current = new Date();
        } else {
            onGameOver();
        }
    };

    const pointsFromStart = score - STARTING_POINTS;
    const pointsFromStartDisplay = pointsFromStart >= 0 ? `+${pointsFromStart}` : `${pointsFromStart}`;
    const showLowScoreWarning = score <= 40 && score > 20 && !gameOver && !quizCompleted;
    const showCriticalWarning = score <= 20 && score > 0 && !gameOver && !quizCompleted;

    // Loading state
    if (isLoading) {
        return (
            <div className="quizPage">
                <div className="container">
                    <div className="loading">Loading quiz...</div>
                </div>
            </div>
        );
    }

    // Quiz not found
    if (!quiz) {
        return (
            <div className="quizPage">
                <div className="container">
                    <div className="errorMessage">
                        <h2>Quiz Not Found</h2>
                        <p>The quiz you're looking for doesn't exist.</p>
                        <button onClick={onGameOver} className="homeButton">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No questions
    if (questions.length === 0) {
        return (
            <div className="quizPage">
                <div className="container">
                    <div className="errorMessage">
                        <h2>No Questions Found</h2>
                        <p>This quiz doesn't have any questions yet.</p>
                        <button onClick={onGameOver} className="homeButton">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz completed
    if (quizCompleted) {
        return (
            <div className="quizPage">
                <div className="container">
                    <div className="completedMessage">
                        <h2>Quiz Completed!</h2>
                        <p>Your score: {score} points</p>
                        <p className="redirectMessage">Redirecting to results...</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Game over
    if (gameOver) {
        return (
            <GameOverModal
                score={score}
                startingPoints={STARTING_POINTS}
                reason={gameOverReason}
                totalQuestions={questions.length}
                questionsAnswered={userAnswers.length}
                onClose={handleGameOverClose}
                quizColor={quiz.color}
            />
        );
    }

    // Main quiz interface
    return (
        <div className="quizPage">
            <main className="mainContent">
                <div className="container">
                    <div className="quizInfo">
                        <h1 className="quizTitle">{quiz.title}</h1>
                        <p className="quizDescription">{quiz.description}</p>
                    </div>

                    <div className="quizStats">
                        <div className={`headerScore ${score <= 20 && score > 0 ? 'critical' : ''} ${score <= 40 && score > 20 ? 'warning' : ''}`}>
                            <div className="currentScore">
                                Score: <span>{score}</span>
                            </div>
                            <div className="scoreChange" style={{
                                color: pointsFromStart >= 0 ? '#2ecc71' : '#e74c3c'
                            }}>
                                {pointsFromStartDisplay} from start
                            </div>
                        </div>
                        {timeLeft > 0 && (
                            <div className="timer">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>

                    {showCriticalWarning && (
                        <div className="lowScoreWarning criticalWarning">
                            ⚠️ CRITICAL! Score is {score}. You're close to zero!
                        </div>
                    )}

                    {showLowScoreWarning && !showCriticalWarning && (
                        <div className="lowScoreWarning">
                            ⚠️ Warning! Score is getting low ({score} points). Be careful!
                        </div>
                    )}

                    <div className="progressBar">
                        <div
                            className="progressFill"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: quiz.color || '#3498db'
                            }}
                        />
                        <span className="progressText">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                    </div>

                    {currentQuestion && (
                        <QuestionCard
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={questions.length}
                            selectedAnswer={selectedAnswer}
                            onAnswerSelect={handleAnswerSelect}
                            showFeedback={showFeedback}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuizPage;