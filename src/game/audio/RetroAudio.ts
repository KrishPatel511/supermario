import { GameSettings } from '../GameSettings';

class RetroAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    const settings = GameSettings.getSettings();
    if (settings.sfxVolume <= 0 && settings.musicVolume <= 0) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getSfxGain(): number {
    const volume = GameSettings.getSettings().sfxVolume;
    return (volume / 100);
  }

  public playClick() {
    const ctx = this.getContext();
    const sfxVol = this.getSfxGain();
    if (!ctx || sfxVol <= 0) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.12 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.01 * sfxVol, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // audio error fallback
    }
  }

  public playHover() {
    const ctx = this.getContext();
    const sfxVol = this.getSfxGain();
    if (!ctx || sfxVol <= 0) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.04 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001 * sfxVol, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // audio error fallback
    }
  }

  public playOpenModal() {
    const ctx = this.getContext();
    const sfxVol = this.getSfxGain();
    if (!ctx || sfxVol <= 0) return;

    try {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08 * sfxVol, now);
        gain.gain.exponentialRampToValueAtTime(0.01 * sfxVol, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      });
    } catch {
      // audio error fallback
    }
  }

  public playStartGame() {
    const ctx = this.getContext();
    const sfxVol = this.getSfxGain();
    if (!ctx || sfxVol <= 0) return;

    try {
      const arpeggio = [440, 554.37, 659.25, 880];
      arpeggio.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12 * sfxVol, now);
        gain.gain.exponentialRampToValueAtTime(0.01 * sfxVol, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
      });
    } catch {
      // audio error fallback
    }
  }
}

export const RetroAudio = new RetroAudioSynthesizer();
