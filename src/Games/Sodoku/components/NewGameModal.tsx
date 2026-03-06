import React from 'react';
import { X, Lock } from 'lucide-react';
import type {Difficulty} from '../utils/sudoku';

type NewGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: (difficulty: Difficulty) => void;
  unlockedLevels: Difficulty[];
};

export const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose, onStart, unlockedLevels }) => {
  if (!isOpen) return null;

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content new-game-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>New Game</h2>
            <button
                onClick={onClose}
                className="icon-btn new-game-close-btn"
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((diff) => {
              const isUnlocked = unlockedLevels.includes(diff);
              return (
                  <button
                      key={diff}
                      onClick={() => {
                        if (isUnlocked) {
                          onStart(diff);
                          onClose();
                        }
                      }}
                      className={`difficulty-btn ${!isUnlocked ? 'locked' : 'unlocked'}`}
                      disabled={!isUnlocked}
                  >
                    <div className="difficulty-btn-content">
                      <span>{diff}</span>
                      {!isUnlocked && <Lock size={14} color="#9ca3af" />}
                    </div>
                    <span className="desc">
                  {diff === 'Easy' ? '6x6 Grid (3 Stages)' : diff === 'Medium' ? '9x9 Grid (6 Stages)' : '9x9 Grid (10 Stages)'}
                </span>
                  </button>
              );
            })}
          </div>
        </div>
      </div>
  );
};
