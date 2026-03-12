import React from 'react';

interface Props {
  letter: string;
  text: string;
  isSelected: boolean;
  isWrong: boolean;
  isCorrectAnswer: boolean; // New prop for the blue reveal
  disabled: boolean;
}

export const OptionRow: React.FC<Props> = ({ letter, text, isSelected, isWrong, isCorrectAnswer, disabled }) => {
  let statusClass = "";

  if (disabled) {
    if (isSelected && isWrong) {
      statusClass = "choice-wrong"; // You clicked the wrong one
    } else if (isCorrectAnswer) {
      statusClass = "choice-reveal"; // This is the actual right answer
    }
  }

  return (
    <div className={`option-row ${statusClass}`} style={{ opacity: disabled && !isSelected && !isCorrectAnswer ? 0.6 : 1 }}>
      <strong>{letter}: </strong> {text}
    </div>
  );
};