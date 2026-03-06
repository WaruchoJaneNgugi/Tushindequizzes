import React from 'react';
import { X } from 'lucide-react';

type HowToPlayModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>How to Play</h2>
            <button
                onClick={onClose}
                className="icon-btn"
            >
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            <p>Fill the grid so that every row, column, and box contains all digits without repeating.</p>

            <h3 className="modal-section-title">Scoring & Progression</h3>
            <ul>
              <li><strong>Easy (6x6):</strong> +10 points per stage</li>
              <li><strong>Medium (9x9):</strong> +15 points per stage</li>
              <li><strong>Hard (9x9):</strong> +30 points per stage</li>
              <li><strong>Hint:</strong> Costs 2 points</li>
            </ul>

            <h3 className="modal-section-title">Controls</h3>
            <ul>
              <li>Tap a cell to select it.</li>
              <li>Use the number pad to fill in a number.</li>
              <li>Use <strong>Hint</strong> if you get stuck!</li>
            </ul>
          </div>
          <button
              onClick={onClose}
              className="modal-btn"
          >
            Got it!
          </button>
        </div>
      </div>
  );
};
