
class SoundService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private init() {
    if (this.muted) return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(val: boolean) {
    this.muted = val;
    if (val && this.ctx) {
      this.ctx.suspend();
    } else if (!val && this.ctx) {
      this.ctx.resume();
    }
  }

  getIsMuted() {
    return this.muted;
  }

  private createOscillator(freq: number, type: OscillatorType, startTime: number, duration: number, volume: number) {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playTick() {
    this.init();
    if (!this.ctx || this.muted) return;
    this.createOscillator(880, 'sine', this.ctx.currentTime, 0.05, 0.1);
  }

  playSuccess() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    this.createOscillator(523.25, 'triangle', now, 0.2, 0.2); // C5
    this.createOscillator(659.25, 'triangle', now + 0.1, 0.3, 0.2); // E5
  }

  playHint() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      this.createOscillator(1000 + i * 200, 'sine', now + i * 0.05, 0.1, 0.05);
    }
  }

  playWin() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      this.createOscillator(freq, 'square', now + i * 0.1, 0.4, 0.05);
    });
  }

  playLoss() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.5);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }
}

export const soundService = new SoundService();
