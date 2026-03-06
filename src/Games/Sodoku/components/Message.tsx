import React from 'react';
import type {Difficulty} from '../utils/sudoku';

type MessageProps = {
  isComplete: boolean;
  difficulty: Difficulty;
  stage: number;
};

export const Message: React.FC<MessageProps> = ({ isComplete, difficulty, stage }) => {
  if (isComplete) {
    return (
      <div className="message success">
        <span className="icon">🎉</span>
        <span className="text">Congratulations! You solved the puzzle!</span>
      </div>
    );
  }

  return (
    <div className="message info">
      <span className="icon">✏️</span>
      <span className="text">
        {difficulty === 'Easy' && stage === 1 
          ? "Here's your first puzzle to get you started." 
          : `You are at ${difficulty} level stage ${stage}.`}
      </span>
    </div>
  );
};
