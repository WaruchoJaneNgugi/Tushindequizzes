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
            level: 1,
            questions: [
                { QuestionID: "L1-Q1", QuestionText: "Level 1: 2 + 2?", OptionA: "3", OptionB: "4", OptionC: "5", OptionD: "6", CorrectAnswer: "B" },
                { QuestionID: "L1-Q2", QuestionText: "Level 1: Color of grass?", OptionA: "Blue", OptionB: "Green", OptionC: "Red", OptionD: "Yellow", CorrectAnswer: "B" },
                { QuestionID: "L1-Q3", QuestionText: "Level 1: Capital of France?", OptionA: "London", OptionB: "Paris", OptionC: "Rome", OptionD: "Berlin", CorrectAnswer: "B" }
            ]
        },
        {
            level: 2,
            questions: [
                { QuestionID: "L2-Q1", QuestionText: "Level 2: 5 x 5?", OptionA: "20", OptionB: "25", OptionC: "30", OptionD: "35", CorrectAnswer: "B" },
                { QuestionID: "L2-Q2", QuestionText: "Level 2: Largest planet?", OptionA: "Mars", OptionB: "Jupiter", OptionC: "Earth", OptionD: "Saturn", CorrectAnswer: "B" },
                { QuestionID: "L2-Q3", QuestionText: "Level 2: Boiling point of water?", OptionA: "90°C", OptionB: "100°C", OptionC: "110°C", OptionD: "120°C", CorrectAnswer: "B" }
            ]
        },
        {
            level: 3,
            questions: [
                { QuestionID: "L3-Q1", QuestionText: "Level 3: Square root of 144?", OptionA: "10", OptionB: "12", OptionC: "14", OptionD: "16", CorrectAnswer: "B" },
                { QuestionID: "L3-Q2", QuestionText: "Level 3: Who wrote 'Hamlet'?", OptionA: "Dickens", OptionB: "Shakespeare", OptionC: "Twain", OptionD: "Austen", CorrectAnswer: "B" },
                { QuestionID: "L3-Q3", QuestionText: "Level 3: Fastest land animal?", OptionA: "Lion", OptionB: "Cheetah", OptionC: "Horse", OptionD: "Falcon", CorrectAnswer: "B" }
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

