// src/components/QuizCard/QuizCard.tsx
import React from 'react';
import type { Quiz } from '../types/quiz';
import './QuizCard.css'

interface QuizCardProps {
    quiz: Quiz;
    onClick: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {
    return (
        <div
            className="quizCard"
            data-category={quiz.category}
            onClick={onClick}
        >
            <div className="quizIcon" style={{ color: quiz.color }}>
                {quiz.icon}
            </div>
            <div className="quizContent">
                <h3 className="quizTitle">{quiz.title}</h3>
                <p className="quizDescription">{quiz.description}</p>
                <div className="quizMeta">
                    <span
                        className="quizDifficulty"
                        style={{
                            backgroundColor:
                                quiz.difficulty === 'easy'
                                    ? '#2ecc71'
                                    : quiz.difficulty === 'medium'
                                        ? '#f39c12'
                                        : '#e74c3c'
                        }}
                    >
                        {quiz.difficulty}
                    </span>
                    <span className="quizCount">{quiz.questionCount} questions</span>
                    {quiz.timeLimit && (
                        <span className="quizTime">⏱️ {quiz.timeLimit} min</span>
                    )}
                </div>
                <button
                    className="startButton"
                    style={{ backgroundColor: quiz.color }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizCard;