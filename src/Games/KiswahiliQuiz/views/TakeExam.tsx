import React from "react";
import "../styles/TakeExam.css";
import { OptionRow } from "../components/OptionRow";
import type { Question, Student } from "../types/exam";

interface Props {
  title: string;
  student: Student;
  questions: Question[];
  currentIndex: number;
  currentLevel: number;
  success: string | null;
  isWrong: boolean;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  points: number;
  redirectUrl: string | null;
}

const TakeExam: React.FC<Props> = (props) => {
  const { title, questions, currentIndex, currentLevel, success, isWrong, selectedAnswer, onAnswer, points } = props;
  const currentQuestion = questions[0];
  const progressPercent = ((currentIndex + 1) / 3) * 100;

  return (
    <div className="game-wrapper">
      <div className="game-card">
        <header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="level-tag">NGAZI YA {currentLevel}</div>
            <div style={{ fontWeight: 800, fontSize: '1.2em' }}>🪙 {points} PTS</div>
          </div>
          <h1>{title}</h1>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </header>

        {success && (
          <div style={{ 
            padding: '15px', borderRadius: '15px', textAlign: 'center', marginBottom: '15px',
            background: isWrong ? '#fff5f5' : '#f0fff4', color: isWrong ? '#c53030' : '#2f855a',
            fontWeight: 'bold', border: '1px solid currentColor'
          }}>
            {success}
          </div>
        )}

        {currentQuestion ? (
          <div className="question-container">
            <p style={{color:"black", textAlign: 'center', fontWeight: 600, fontSize: '1.1rem', marginBottom: '20px' }}>
              {currentQuestion.QuestionText}
            </p>
            <div className="options-grid">
              {["A", "B", "C", "D"].map((opt) => (
                <div key={opt} onClick={() => !selectedAnswer && onAnswer(opt)}>
                  <OptionRow 
                    letter={opt} 
                    text={(currentQuestion as any)[`Option${opt}`]} 
                    isSelected={selectedAnswer === opt} 
                    isWrong={isWrong} 
                    isCorrectAnswer={!!selectedAnswer && opt === currentQuestion.CorrectAnswer}
                    disabled={!!selectedAnswer} 
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
             <h2>🏆 HONGERA SHUJAA!</h2>
             <p>Umefika mwisho wa safari.</p>
             <button onClick={() => window.location.reload()} className="btn-submit">CHEZA TENA</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeExam;