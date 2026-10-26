import { useEffect, useState } from 'react';
import { GameSettings } from '../game/GameSettings';
import { TouchInput } from '../game/input/TouchInput';

type TouchKey = 'left' | 'right' | 'jump' | 'special';

function detectTouchDevice() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

function useTouchControlsVisible() {
  const [mode, setMode] = useState(GameSettings.getSettings().touchControls);
  useEffect(() => GameSettings.subscribe((s) => setMode(s.touchControls)), []);
  return mode === 'ON' || (mode === 'AUTO' && detectTouchDevice());
}

function PadButton({ k, label, className }: { k: TouchKey; label: string; className: string }) {
  const press = (e: React.PointerEvent<HTMLButtonElement>, down: boolean) => {
    e.preventDefault();
    TouchInput[k] = down;
    if (down) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Capture is best-effort; pointerup/cancel still release the button.
      }
    }
  };

  return (
    <button
      type="button"
      className={`touch-btn ${className}`}
      aria-label={label}
      onPointerDown={(e) => press(e, true)}
      onPointerUp={(e) => press(e, false)}
      onPointerCancel={(e) => press(e, false)}
      onLostPointerCapture={() => {
        TouchInput[k] = false;
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  );
}

export default function TouchControls() {
  const visible = useTouchControlsVisible();

  useEffect(() => {
    TouchInput.reset();
    return () => TouchInput.reset();
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="touch-controls">
      <div className="touch-pad touch-pad-left">
        <PadButton k="left" label="◀" className="touch-btn-dir" />
        <PadButton k="right" label="▶" className="touch-btn-dir" />
      </div>
      <div className="touch-pad touch-pad-right">
        <PadButton k="special" label="X" className="touch-btn-special" />
        <PadButton k="jump" label="JUMP" className="touch-btn-jump" />
      </div>
    </div>
  );
}
