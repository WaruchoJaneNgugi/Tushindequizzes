// Mahjong/components/SoundControl/SoundControl.tsx - UPDATED with props
import React, { useState } from 'react';
import './SoundControl.css';

interface SoundControlProps {
    soundEnabled: boolean;
    onSoundToggle: () => void;
    className?: string;
}

const SoundControl: React.FC<SoundControlProps> = ({
                                                       soundEnabled,
                                                       onSoundToggle,
                                                       className
                                                   }) => {
    const [showVolume, setShowVolume] = useState(false);
    const [volume, setVolume] = useState(50);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        // You can add volume control logic here if needed
    };

    return (
        <div className={`sound-control ${className || ''}`}>
            <button
                className="sound-toggle"
                onClick={onSoundToggle}
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
                aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
            >
                {soundEnabled ? (volume > 70 ? '🔊' : volume > 30 ? '🔉' : '🔈') : '🔇'}
            </button>

            {showVolume && soundEnabled && (
                <div className="volume-slider-container">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                        aria-label="Volume"
                    />
                    <span className="volume-value">{volume}%</span>
                </div>
            )}
        </div>
    );
};

export default SoundControl;