import React from 'react';

type CongratsModalProps = {
    isOpen: boolean;
    onNext: () => void;
    onReplay: () => void;
};

export const CongratsModal: React.FC<CongratsModalProps> = ({ isOpen, onNext, onReplay }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content congrats-content">
                <div className="congrats-icon">🎉</div>
                <h2 className="congrats-title">
                    Congratulations!
                </h2>
                <p className="congrats-text">
                    You solved the puzzle! What would you like to do next?
                </p>
                <div className="congrats-buttons">
                    <button
                        onClick={onNext}
                        className="congrats-btn-primary"
                    >
                        Next Stage
                    </button>
                    <button
                        onClick={onReplay}
                        className="congrats-btn-secondary"
                    >
                        Replay Stage
                    </button>
                </div>
            </div>
        </div>
    );
};
