class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggle(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1, delay: number = 0) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }

  playClick() {
    this.playTone(600, 'sine', 0.1, 0.1);
  }

  playMatch() {
    this.playTone(523.25, 'sine', 0.15, 0.1, 0); // C5
    this.playTone(659.25, 'sine', 0.2, 0.1, 0.1); // E5
    this.playTone(783.99, 'sine', 0.3, 0.1, 0.2); // G5
  }

  playUndo() {
    this.playTone(300, 'triangle', 0.15, 0.1);
    this.playTone(250, 'triangle', 0.2, 0.1, 0.1);
  }

  playVictory() {
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.3, 0.1, i * 0.15);
    });
  }

  playGameOver() {
    const notes = [440, 415.30, 392.00, 349.23]; // A4, G#4, G4, F4
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sawtooth', 0.4, 0.05, i * 0.2);
    });
  }
}

export const audio = new AudioEngine();
