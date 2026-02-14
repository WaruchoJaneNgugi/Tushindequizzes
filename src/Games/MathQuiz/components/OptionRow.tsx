import React from 'react';
// REMOVED: import type { Question } from '../types/exam'; 

interface OptionRowProps {
  letter: string;
  text: string;
  isSelected: boolean;
  isWrong: boolean;
  disabled: boolean;
}

export const OptionRow: React.FC<OptionRowProps> = ({ 
  letter, 
  text, 
  isSelected, 
  isWrong, 
  disabled 
}) => {
  let statusClass = "";
  
  if (isSelected) {
    statusClass = isWrong ? "choice-wrong" : "choice-correct";
  }

  return (
    <label className={`option-row ${statusClass}`}>
      <input 
        type="radio" 
        name="answer" 
        value={letter} 
        required 
        disabled={disabled} 
        style={{ display: 'none' }} 
      />
      <span style={{ marginRight: '10px', opacity: 0.5 }}>{letter}</span>
      {text}
    </label>
  );
};