export interface GameSettingsData {
  musicVolume: number; // 0 to 100
  sfxVolume: number; // 0 to 100
  screenShake: boolean;
  particles: boolean;
  pixelPerfect: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  touchControls: 'AUTO' | 'ON' | 'OFF';
}

const DEFAULT_SETTINGS: GameSettingsData = {
  musicVolume: 90,
  sfxVolume: 80,
  screenShake: true,
  particles: true,
  pixelPerfect: true,
  reducedMotion: false,
  highContrast: false,
  touchControls: 'AUTO',
};

const STORAGE_KEY = 'mario_game_settings_v2';

class GameSettingsManager {
  private settings: GameSettingsData = { ...DEFAULT_SETTINGS };
  private listeners: Array<(settings: GameSettingsData) => void> = [];

  constructor() {
    this.load();
  }

  public getSettings(): GameSettingsData {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<GameSettingsData>) {
    this.settings = { ...this.settings, ...partial };
    this.save();
    this.applyGlobalEffects();
    this.notify();
  }

  public subscribe(listener: (settings: GameSettingsData) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.getSettings()));
  }

  private load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // ignore
    }
  }

  public applyGlobalEffects() {
    if (typeof document !== 'undefined') {
      if (this.settings.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }

      if (this.settings.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    }
  }
}

export const GameSettings = new GameSettingsManager();
