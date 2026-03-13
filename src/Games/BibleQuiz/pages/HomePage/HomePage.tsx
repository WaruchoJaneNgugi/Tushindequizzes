// Mahjong/pages/HomePage/HomePage.tsx - Updated to use props
import React from 'react';
import QuizCard from '../../components/QuizCard/QuizCard';
import { quizzes } from '../../components/data/quizzes';
import './HomePage.css';

interface HomePageProps {
    onSelectQuiz: (quizId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectQuiz }) => {
    return (
        <div className="homePage">
            <div className="quizGrid">
                {quizzes.map((quiz) => (
                    <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onClick={() => onSelectQuiz(quiz.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomePage;