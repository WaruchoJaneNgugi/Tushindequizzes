import { useState } from 'react';
import TakeExam from './views/TakeExam';
import type { Exam } from './types/exam';

const mockExam: Exam = {
    ExamID: 1,
    Title: "Survivor: Point Guard",
    Subject: "General Knowledge",
    Code: "GK-PRO",
    levels: [
        {
            level: 1, // Basic Arithmetic
            questions: [
                { QuestionID: "L1-Q1", QuestionText: "What is 15 + 27?", OptionA: "32", OptionB: "42", OptionC: "38", OptionD: "45", CorrectAnswer: "B" },
                { QuestionID: "L1-Q2", QuestionText: "What is 12 x 3?", OptionA: "32", OptionB: "36", OptionC: "42", OptionD: "34", CorrectAnswer: "B" },
                { QuestionID: "L1-Q3", QuestionText: "What is 100 - 45?", OptionA: "65", OptionB: "55", OptionC: "45", OptionD: "50", CorrectAnswer: "B" }
            ]
        },
        {
            level: 2, // Intermediate Algebra & Squares
            questions: [
                { QuestionID: "L2-Q1", QuestionText: "Solve: (5 x 5) + (10 / 2)", OptionA: "25", OptionB: "30", OptionC: "20", OptionD: "15", CorrectAnswer: "B" },
                { QuestionID: "L2-Q2", QuestionText: "What is 14 squared (14²)?", OptionA: "169", OptionB: "196", OptionC: "212", OptionD: "144", CorrectAnswer: "B" },
                { QuestionID: "L2-Q3", QuestionText: "If 3x = 27, what is x?", OptionA: "7", OptionB: "9", OptionC: "12", OptionD: "6", CorrectAnswer: "B" }
            ]
        },
        {
            level: 3, // Advanced Logic & Roots
            questions: [
                { QuestionID: "L3-Q1", QuestionText: "What is the square root of 225?", OptionA: "13", OptionB: "15", OptionC: "25", OptionD: "12", CorrectAnswer: "B" },
                { QuestionID: "L3-Q2", QuestionText: "Solve: 2³ + 4²", OptionA: "20", OptionB: "24", OptionC: "16", OptionD: "22", CorrectAnswer: "B" },
                { QuestionID: "L3-Q3", QuestionText: "What is 25% of 200?", OptionA: "40", OptionB: "50", OptionC: "60", OptionD: "25", CorrectAnswer: "B" }
            ]
        }
    ]
};

export const MathQuiz=()=> {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isWrong, setIsWrong] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [levelCorrectCount, setLevelCorrectCount] = useState(0);

    // Starting points
    const [points, setPoints] = useState(10);

    const levelData = mockExam.levels.find(l => l.level === currentLevel);
    const questions = levelData?.questions || [];
    const currentQuestion = questions[currentIndex];

    const handleAnswerSubmit = (answer: string) => {
        if (selectedAnswer || isFinished) return;

        setSelectedAnswer(answer);
        const isCorrect = answer === currentQuestion.CorrectAnswer;

        // --- POINT LOGIC ---
        setPoints((prev) => {
            // 1. Everytime I tackle a question, a point is deducted
            let runningTotal = prev - 1;

            // 2. When I get a question right, one point is added
            if (isCorrect) {
                runningTotal += 1;
            }

            // 3. When I loose (isCorrect is false), nothing else happens (so we just keep the -1)
            return runningTotal;
        });

        if (isCorrect) {
            setFeedback("✅ Correct! Point saved.");
            setIsWrong(false);
            setLevelCorrectCount(prev => prev + 1);
        } else {
            const correctText = (currentQuestion as any)[`Option${currentQuestion.CorrectAnswer}`];
            setFeedback(`❌ Wrong! -1 Point. Correct: ${currentQuestion.CorrectAnswer} (${correctText})`);
            setIsWrong(true);
        }

        setTimeout(() => {
            const isLastInLevel = currentIndex === questions.length - 1;

            if (!isLastInLevel) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setFeedback(null);
            } else {
                const totalCorrectInLevel = isCorrect ? levelCorrectCount + 1 : levelCorrectCount;
                const scorePercent = (totalCorrectInLevel / questions.length) * 100;

                if (scorePercent >= 70) {
                    if (currentLevel < 3) {
                        setFeedback(`🎉 Level ${currentLevel} Passed!`);
                        setTimeout(() => {
                            setCurrentLevel(prev => prev + 1);
                            setCurrentIndex(0);
                            setLevelCorrectCount(0);
                            setSelectedAnswer(null);
                            setFeedback(null);
                        }, 2000);
                    } else {
                        setFeedback("🏆 GRAND CHAMPION!");
                        setIsFinished(true);
                    }
                } else {
                    setFeedback(`❌ Level Failed (${Math.round(scorePercent)}%). Restarting...`);
                    setTimeout(() => {
                        setCurrentIndex(0);
                        setLevelCorrectCount(0);
                        setSelectedAnswer(null);
                        setFeedback(null);
                    }, 3000);
                }
            }
        }, 3000);
    };

    return (
        <TakeExam
            title={mockExam.Title}
            student={{ Name: "Player 1" }}
            questions={isFinished ? [] : [currentQuestion]}
            currentIndex={currentIndex}
            currentLevel={currentLevel}
            success={feedback}
            isWrong={isWrong}
            redirectUrl={null}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswerSubmit}
            points={points}
        />
    );
}

