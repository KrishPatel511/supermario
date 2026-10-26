import { GameSettings } from '../GameSettings';

// Lightweight synthesized sound effects using the native Web Audio API.
// No external .mp3/.wav files needed — every sound is generated in code.
// This also means: zero network requests, and no copyright concerns
// from reusing real Mario sound clips.

class SfxManager {
  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;


  // Master SFX volume from Settings (0..1).
  private vol() {
    return GameSettings.getSettings().sfxVolume / 100;
  }

  private getCtx() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private tone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.12, startDelay = 0) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Soft limiter to prevent clipping/distortion
      const maxVol = Math.max(Math.min(volume, 0.18) * this.vol(), 0.0001);

      osc.type = type;
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + startDelay;
      gain.gain.setValueAtTime(maxVol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio fallback silent
    }
  }

  jump() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine'; // Pure smooth sine wave (zero crackle/distortion)

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.12);

      gain.gain.setValueAtTime(Math.max(0.09 * this.vol(), 0.0001), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      this.tone(600, 0.12, 'sine', 0.08);
    }
  }

  coin() {
    // Pure metallic dual-tone coin chime (sine waves produce zero distortion)
    this.tone(988, 0.08, 'sine', 0.09);
    this.tone(1319, 0.16, 'sine', 0.09, 0.07);
  }

  stomp() {
    this.tone(260, 0.08, 'triangle', 0.1);
    this.tone(130, 0.12, 'sine', 0.08, 0.04);
  }

  hurt() {
    this.pitFall();
  }

  pitFall() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.35);

      gain.gain.setValueAtTime(Math.max(0.12 * this.vol(), 0.0001), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // Smooth Mario 4-note death tune
      const deathNotes = [493, 698, 698, 698, 659, 587, 523];
      deathNotes.forEach((f, i) => this.tone(f, 0.14, 'sine', 0.09, 0.38 + i * 0.12));
    } catch {
      this.tone(180, 0.3, 'sine', 0.1);
    }
  }

  levelComplete() {
    // Authentic 8-note NES Stage Clear Victory Fanfare
    const fanfare = [392, 523, 659, 784, 1047, 1319, 1567, 2093];
    fanfare.forEach((f, i) => this.tone(f, 0.2, 'sine', 0.1, i * 0.11));
  }

  gameOver() {
    const notes = [493, 698, 698, 698, 659, 587, 523];
    notes.forEach((f, i) => this.tone(f, 0.18, 'sine', 0.1, i * 0.16));
  }

  bump() {
    this.tone(280, 0.06, 'triangle', 0.08);
  }

  breakBrick() {
    this.tone(160, 0.08, 'triangle', 0.1);
    this.tone(90, 0.12, 'sine', 0.08, 0.04);
  }

  powerUp() {
    const notes = [523, 659, 784, 1047, 1319, 1567];
    notes.forEach((f, i) => this.tone(f, 0.08, 'sine', 0.09, i * 0.05));
  }

  shrink() {
    [400, 300, 200, 150].forEach((f, i) => this.tone(f, 0.1, 'sine', 0.09, i * 0.07));
  }

  startMusic() {
    // Disabled generic synth loop as requested by user
  }

  stopMusic() {
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const Sfx = new SfxManager();
