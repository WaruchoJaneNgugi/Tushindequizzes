import { useCallback, useRef } from 'react';

export function useSoundEffects(isMuted: boolean = false) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [isMuted, getAudioContext]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    // A short, muted "tick" sound for selecting a tile
    playTone(400, 'sine', 0.1, 0.05);
  }, [playTone, isMuted]);

  const playMatch = useCallback(() => {
    if (isMuted) return;
    // A pleasant "ding" sound for matching tiles
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

    osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc2.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.3);
    osc2.stop(ctx.currentTime + 0.3);
  }, [getAudioContext, isMuted]);

  const playUndo = useCallback(() => {
    if (isMuted) return;
    // A descending "swoosh" sound for undo
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [getAudioContext, isMuted]);

  const playVictory = useCallback(() => {
    if (isMuted) return;
    // A triumphant arpeggio for stage clear
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.15;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * duration);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * duration);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * duration + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * duration + duration * 2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime + i * duration);
      osc.stop(ctx.currentTime + i * duration + duration * 2);
    });
  }, [getAudioContext, isMuted]);

  const playGameOver = useCallback(() => {
    if (isMuted) return;
    // A descending, sad sound for game over
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }, [getAudioContext, isMuted]);

  return {
    playClick,
    playMatch,
    playUndo,
    playVictory,
    playGameOver
  };
}
