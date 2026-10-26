import { useState, useEffect } from 'react';
import { RetroAudio } from '../../game/audio/RetroAudio';
import { GameSettings, type GameSettingsData } from '../../game/GameSettings';

interface Props {
  onClose: () => void;
  crtScanlines?: boolean;
  onToggleCrt?: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const [settings, setSettings] = useState<GameSettingsData>(GameSettings.getSettings());

  useEffect(() => {
    return GameSettings.subscribe((newSettings) => {
      setSettings(newSettings);
    });
  }, []);

  const update = (partial: Partial<GameSettingsData>) => {
    RetroAudio.playClick();
    GameSettings.updateSettings(partial);
  };

  const handleClose = () => {
    RetroAudio.playClick();
    onClose();
  };

  return (
    <div className="retro-modal-backdrop" onClick={handleClose}>
      <div
        style={{
          width: 740,
          maxWidth: '96%',
          backgroundColor: '#e9ecef',
          border: '4px solid #000',
          boxShadow: '8px 8px 0px #000',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Press Start 2P', monospace",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#111116',
            borderBottom: '3px solid #000',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                color: '#ffcc00',
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              SETTINGS
            </div>
            <div
              style={{
                color: '#a0a0a0',
                fontSize: 7.5,
                letterSpacing: 1,
              }}
            >
              SAVED AUTOMATICALLY
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '3px solid #000',
              boxShadow: '3px 3px 0 #000',
              padding: '6px 14px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              fontWeight: 'bold',
              cursor: 'pointer',
              outline: 'none',
            }}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            BACK
          </button>
        </div>

        {/* Content Box */}
        <div style={{ padding: 20, backgroundColor: '#e9ecef' }}>
          <div
            style={{
              border: '3px solid #000',
              padding: '20px 24px',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Top 2-Column Grid (AUDIO & DISPLAY) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              {/* AUDIO SECTION */}
              <div>
                <div
                  style={{
                    color: '#d32f2f',
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginBottom: 16,
                  }}
                >
                  AUDIO
                </div>

                {/* MUSIC Slider */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 9, color: '#000', marginBottom: 8 }}>MUSIC</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="range"
                      className="retro-slider"
                      min="0"
                      max="100"
                      value={settings.musicVolume}
                      onChange={(e) => update({ musicVolume: Number(e.target.value) })}
                    />
                    <div style={{ fontSize: 8.5, color: '#000', width: 44, textAlign: 'right' }}>
                      {settings.musicVolume}%
                    </div>
                  </div>
                </div>

                {/* SFX Slider */}
                <div>
                  <div style={{ fontSize: 9, color: '#000', marginBottom: 8 }}>SFX</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="range"
                      className="retro-slider"
                      min="0"
                      max="100"
                      value={settings.sfxVolume}
                      onChange={(e) => update({ sfxVolume: Number(e.target.value) })}
                    />
                    <div style={{ fontSize: 8.5, color: '#000', width: 44, textAlign: 'right' }}>
                      {settings.sfxVolume}%
                    </div>
                  </div>
                </div>
              </div>

              {/* DISPLAY SECTION */}
              <div>
                <div
                  style={{
                    color: '#d32f2f',
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginBottom: 16,
                  }}
                >
                  DISPLAY
                </div>

                {/* SCREEN SHAKE */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ fontSize: 9, color: '#000' }}>SCREEN SHAKE</div>
                  <button
                    onClick={() => update({ screenShake: !settings.screenShake })}
                    style={{
                      backgroundColor: settings.screenShake ? '#ffc107' : '#ffffff',
                      color: '#000000',
                      border: '3px solid #000',
                      boxShadow: '3px 3px 0 #000',
                      padding: '7px 16px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    onMouseEnter={() => RetroAudio.playHover()}
                  >
                    {settings.screenShake ? 'ON ✓' : 'OFF ✕'}
                  </button>
                </div>

                {/* PARTICLES */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ fontSize: 9, color: '#000' }}>PARTICLES</div>
                  <button
                    onClick={() => update({ particles: !settings.particles })}
                    style={{
                      backgroundColor: settings.particles ? '#ffc107' : '#ffffff',
                      color: '#000000',
                      border: '3px solid #000',
                      boxShadow: '3px 3px 0 #000',
                      padding: '7px 16px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    onMouseEnter={() => RetroAudio.playHover()}
                  >
                    {settings.particles ? 'ON ✓' : 'OFF ✕'}
                  </button>
                </div>

                {/* PIXEL PERFECT */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 9, color: '#000' }}>PIXEL PERFECT</div>
                    <div style={{ fontSize: 7, color: '#666666', marginTop: 4, lineHeight: 1.4 }}>
                      Locks rendering to whole-
                      <br />
                      number zoom.
                    </div>
                  </div>
                  <button
                    onClick={() => update({ pixelPerfect: !settings.pixelPerfect })}
                    style={{
                      backgroundColor: settings.pixelPerfect ? '#ffc107' : '#ffffff',
                      color: '#000000',
                      border: '3px solid #000',
                      boxShadow: '3px 3px 0 #000',
                      padding: '7px 16px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    onMouseEnter={() => RetroAudio.playHover()}
                  >
                    {settings.pixelPerfect ? 'ON ✓' : 'OFF ✕'}
                  </button>
                </div>
              </div>
            </div>

            {/* ACCESSIBILITY SECTION */}
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  color: '#d32f2f',
                  fontSize: 10,
                  fontWeight: 'bold',
                  marginBottom: 16,
                }}
              >
                ACCESSIBILITY
              </div>

              {/* REDUCED MOTION */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 9, color: '#000' }}>REDUCED MOTION</div>
                  <div style={{ fontSize: 7, color: '#666666', marginTop: 4 }}>
                    Stops background drift and menu animation.
                  </div>
                </div>
                <button
                  onClick={() => update({ reducedMotion: !settings.reducedMotion })}
                  style={{
                    backgroundColor: settings.reducedMotion ? '#ffc107' : '#ffffff',
                    color: '#000000',
                    border: '3px solid #000',
                    boxShadow: '3px 3px 0 #000',
                    padding: '7px 16px',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  onMouseEnter={() => RetroAudio.playHover()}
                >
                  {settings.reducedMotion ? 'ON ✓' : 'OFF ✕'}
                </button>
              </div>

              {/* HIGH CONTRAST */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 9, color: '#000' }}>HIGH CONTRAST</div>
                  <div style={{ fontSize: 7, color: '#666666', marginTop: 4 }}>
                    Stronger separation between text and panels.
                  </div>
                </div>
                <button
                  onClick={() => update({ highContrast: !settings.highContrast })}
                  style={{
                    backgroundColor: settings.highContrast ? '#ffc107' : '#ffffff',
                    color: '#000000',
                    border: '3px solid #000',
                    boxShadow: '3px 3px 0 #000',
                    padding: '7px 16px',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  onMouseEnter={() => RetroAudio.playHover()}
                >
                  {settings.highContrast ? 'ON ✓' : 'OFF ✕'}
                </button>
              </div>

              {/* TOUCH CONTROLS */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 9, color: '#000' }}>TOUCH CONTROLS</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['AUTO', 'ON', 'OFF'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => update({ touchControls: opt })}
                      style={{
                        backgroundColor: settings.touchControls === opt ? '#ffc107' : '#ffffff',
                        color: '#000000',
                        border: '3px solid #000',
                        boxShadow: '3px 3px 0 #000',
                        padding: '7px 14px',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 9,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      onMouseEnter={() => RetroAudio.playHover()}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

