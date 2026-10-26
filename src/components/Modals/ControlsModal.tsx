import { RetroAudio } from '../../game/audio/RetroAudio';

interface Props {
  onClose: () => void;
}

const controlsData = [
  {
    title: 'MOVE',
    subtext: 'OR  ← →  ARROW KEYS',
    keys: ['A', 'D'],
  },
  {
    title: 'JUMP',
    subtext: 'HOLD FOR HEIGHT',
    keys: ['SPACE', 'W'],
  },
  {
    title: 'RUN',
    subtext: 'MOMENTUM BUILDS',
    keys: ['SHIFT'],
  },
  {
    title: 'SPECIAL',
    subtext: "YOUR HERO'S SIGNATURE MOVE",
    keys: ['X'],
  },
  {
    title: 'RESTART STAGE',
    subtext: null,
    keys: ['R'],
  },
  {
    title: 'PAUSE',
    subtext: 'ON PHONES: USE THE ON-SCREEN BUTTONS',
    keys: ['ESC', 'P'],
  },
];

export default function ControlsModal({ onClose }: Props) {
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
              CONTROLS
            </div>
            <div
              style={{
                color: '#a0a0a0',
                fontSize: 7.5,
                letterSpacing: 1,
              }}
            >
              KEYBOARD • GAMEPAD-FRIENDLY
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

        {/* Content Panel Box */}
        <div style={{ padding: 20, backgroundColor: '#e9ecef' }}>
          <div
            style={{
              border: '3px solid #000',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {controlsData.map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: idx < controlsData.length - 1 ? '2px solid #e0e0e0' : 'none',
                  minHeight: 56,
                }}
              >
                {/* Left Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div
                    style={{
                      color: '#000000',
                      fontSize: 9.5,
                      fontWeight: 'bold',
                      letterSpacing: 0.5,
                    }}
                  >
                    {row.title}
                  </div>
                  {row.subtext && (
                    <div
                      style={{
                        color: '#666666',
                        fontSize: 7.5,
                        letterSpacing: 0.5,
                      }}
                    >
                      {row.subtext}
                    </div>
                  )}
                </div>

                {/* Right Key Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {row.keys.map((keyName, kIdx) => (
                    <div
                      key={kIdx}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: '3px solid #000',
                        boxShadow: '3px 3px 0 #000',
                        padding: keyName.length > 2 ? '6px 10px' : '6px 12px',
                        fontSize: keyName.length > 3 ? 8 : 9,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        minWidth: keyName.length === 1 ? 32 : 'auto',
                      }}
                    >
                      {keyName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

