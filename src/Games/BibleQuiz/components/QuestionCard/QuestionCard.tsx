// Mahjong/components/QuestionCard/QuestionCard.tsx
import React from 'react';
import type { Question } from '../types/quiz';
import './QuestionCard.css'

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    selectedAnswer: number | null;
    onAnswerSelect: (answerIndex: number) => void;
    showFeedback?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
                                                       question,
                                                       questionNumber,
                                                       totalQuestions,
                                                       selectedAnswer,
                                                       onAnswerSelect,
                                                       showFeedback = false
                                                   }) => {
    const getOptionClass = (index: number) => {
        let className = "option";

        if (selectedAnswer === index) {
            if (showFeedback) {
                className += index === question.correctAnswer
                    ? " correct"
                    : " incorrect";
            } else {
                className += " selected";
            }
        }

        if (showFeedback && index === question.correctAnswer) {
            className += " correct";
        }

        return className;
    };

    return (
        <div className="questionCard">
            <div className="questionHeader">
                <div className="questionCounter">
                    Question {questionNumber} of {totalQuestions}
                </div>
                <div className="pointsBadge">
                    {question.points} points
                </div>
            </div>

            <h3 className="questionText">{question.text}</h3>

            {/*{question.bibleReference && (*/}
            {/*    <div className="bibleReference">*/}
            {/*        📖 {question.bibleReference}*/}
            {/*    </div>*/}
            {/*)}*/}

            <div className="optionsContainer">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        className={getOptionClass(index)}
                        onClick={() => onAnswerSelect(index)}
                        disabled={showFeedback}
                    >
                        <span className="optionLetter">
                            {String.fromCharCode(65 + index)}
                        </span>
                        <span className="optionText">{option}</span>
                    </button>
                ))}
            </div>

            {showFeedback && question.explanation && (
                <div className="explanation">
                    <strong>Explanation:</strong> {question.explanation}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;