// src/hooks/useGameSounds.ts
import { useCallback, useEffect } from 'react';
import correctSound from '../sounds/correct.mp3';
import wrongSound from '../sounds/wrong.mp3';
import gameOverSound from '../sounds/gameover.mp3';
import levelCompleteSound from '../sounds/celebration.mp3';
import lowScoreSound from '../sounds/lowscore.mp3';
import criticalSound from '../sounds/critical.mp3';
import clickSound from '../sounds/click.mp3';


// References to your custom sounds in the public folder
const SOUNDS = {
    correct: correctSound,
    wrong: wrongSound,
    gameOver: gameOverSound,
    levelComplete: levelCompleteSound,
    lowScore: lowScoreSound,
    critical: criticalSound,
    click: clickSound,
} as const;

type SoundType = keyof typeof SOUNDS;

interface UseGameSoundsProps {
    volume?: number;
    soundEnabled?: boolean;
}

class SoundManager {
    private static instance: SoundManager;
    private audioElements: Map<string, HTMLAudioElement> = new Map();
    private soundEnabled: boolean = true;
    private globalVolume: number = 0.5;

    private constructor() {}

    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    preloadSound(soundId: SoundType, src: string) {
        if (!this.audioElements.has(soundId)) {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.volume = this.globalVolume;
            this.audioElements.set(soundId, audio);
        }
    }

    play(soundId: SoundType) {
        if (!this.soundEnabled) return;

        const audio = this.audioElements.get(soundId);
        if (audio) {
            // Clone the audio to allow overlapping sounds
            const soundClone = audio.cloneNode() as HTMLAudioElement;
            soundClone.volume = this.globalVolume;
            soundClone.play().catch(error => {
                console.log(`Sound play failed: ${soundId}`, error);
            });
        }
    }

    setEnabled(enabled: boolean) {
        this.soundEnabled = enabled;
    }

    setVolume(volume: number) {
        this.globalVolume = Math.max(0, Math.min(1, volume));
        this.audioElements.forEach(audio => {
            audio.volume = this.globalVolume;
        });
    }
}

export const useGameSounds = ({
                                  volume = 0.5,
                                  soundEnabled = true
                              }: UseGameSoundsProps = {}) => {
    const soundManager = SoundManager.getInstance();

    // Preload all sounds on mount
    useEffect(() => {
        Object.entries(SOUNDS).forEach(([key, src]) => {
            soundManager.preloadSound(key as SoundType, src);
        });
        soundManager.setVolume(volume);
        soundManager.setEnabled(soundEnabled);
    }, []);

    // Update volume when it changes
    useEffect(() => {
        soundManager.setVolume(volume);
    }, [volume]);

    // Update enabled state when it changes
    useEffect(() => {
        soundManager.setEnabled(soundEnabled);
    }, [soundEnabled]);

    return {
        playCorrect: useCallback(() => soundManager.play('correct'), []),
        playWrong: useCallback(() => soundManager.play('wrong'), []),
        playGameOver: useCallback(() => soundManager.play('gameOver'), []),
        playLevelComplete: useCallback(() => soundManager.play('levelComplete'), []),
        playLowScore: useCallback(() => soundManager.play('lowScore'), []),
        playCritical: useCallback(() => soundManager.play('critical'), []),
        playClick: useCallback(() => soundManager.play('click'), []),

        // Utility functions
        setVolume: useCallback((vol: number) => soundManager.setVolume(vol), []),
        setSoundEnabled: useCallback((enabled: boolean) => soundManager.setEnabled(enabled), []),
    };
};