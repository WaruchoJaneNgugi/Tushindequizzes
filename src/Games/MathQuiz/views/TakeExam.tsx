import React from "react";
import type { Question, Student } from "../types/exam";
import { GameStyles } from "../styles/gameStyles";
import { OptionRow } from "../components/OptionRow";

interface Props {
  title: string;
  student: Student;
  questions: Question[];
  currentIndex: number;
  currentLevel: number;
  success: string | null;
  isWrong: boolean;
  redirectUrl: string | null;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  points: number;
}

const TakeExam: React.FC<Props> = (props) => {
  const { 
    title, 
    questions, 
    currentIndex, 
    currentLevel, 
    success, 
    isWrong, 
    selectedAnswer, 
    onAnswer, 
    points 
  } = props;

  const currentQuestion = questions && questions.length > 0 ? questions[0] : null;
  const progressPercent = ((currentIndex + 1) / 3) * 100;
  const gameIsOver = !currentQuestion && success?.includes("CHAMPION");

  return (
    <div className="game-wrapper">
      <style dangerouslySetInnerHTML={{ __html: GameStyles }} />

      <div className="game-card">
        <header>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px' 
          }}>
            <div className="level-tag">LEVEL {currentLevel}</div>
            <div style={{ 
              fontWeight: 800, 
              fontSize: '1.2em',
              color: points < 5 ? '#e53e3e' : '#2b6cb0'
            }}>
              🪙 {points} <span style={{ fontSize: '0.7em', opacity: 0.8 }}>PTS</span>
            </div>
          </div>

          <h1 style={{ margin: '0 0 10px 0', fontSize: '1.2em', textAlign: 'center', color: '#1a202c' }}>
            {title}
          </h1>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </header>

        {success && (
          <div className="feedback-popup" style={{ 
            background: isWrong ? '#fff5f5' : '#f0fff4',
            color: isWrong ? '#c53030' : '#2f855a',
            border: `2px solid ${isWrong ? '#feb2b2' : '#9ae6b4'}`,
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '0.9em'
          }}>
            {success}
          </div>
        )}

        {currentQuestion ? (
          <div className="question-container">
            <p style={{ fontSize: '1.3em', fontWeight: 600, textAlign: 'center', marginBottom: '25px',color:'black' }}>
              {currentQuestion.QuestionText}
            </p>
            
            <div className="options-grid">
              {["A", "B", "C", "D"].map((opt) => (
                <div 
                  key={opt} 
                  onClick={() => !selectedAnswer && onAnswer(opt)}
                  style={{ cursor: selectedAnswer ? 'not-allowed' : 'pointer' }}
                >
                  <OptionRow 
                    letter={opt}
                    text={(currentQuestion as any)[`Option${opt}`]}
                    isSelected={selectedAnswer === opt}
                    isWrong={isWrong}
                    disabled={!!selectedAnswer}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {gameIsOver ? (
              <div>
                <h2>🏆 Victory!</h2>
                <p>You finished with <strong>{points} points</strong>.</p>
                <button onClick={() => window.location.reload()} className="btn-submit">
                  PLAY AGAIN
                </button>
              </div>
            ) : (
              !success?.includes("Failed") && <p>Loading...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeExam;