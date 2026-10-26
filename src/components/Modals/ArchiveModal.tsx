import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { RetroAudio } from '../../game/audio/RetroAudio';

interface Props {
  onClose: () => void;
}

// Retro Pixel Art SVG Logos
const GrowthOrbIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Black outline */}
    <rect x="5" y="1" width="6" height="1" fill="#000" />
    <rect x="3" y="2" width="10" height="1" fill="#000" />
    <rect x="2" y="3" width="12" height="6" fill="#000" />
    <rect x="3" y="9" width="10" height="6" fill="#000" />
    <rect x="5" y="15" width="6" height="1" fill="#000" />
    {/* Red mushroom cap */}
    <rect x="5" y="2" width="6" height="7" fill="#d32f2f" />
    <rect x="3" y="3" width="10" height="5" fill="#d32f2f" />
    {/* White spots */}
    <rect x="6" y="3" width="4" height="3" fill="#ffffff" />
    <rect x="3" y="5" width="2" height="2" fill="#ffffff" />
    <rect x="11" y="5" width="2" height="2" fill="#ffffff" />
    {/* Beige stem */}
    <rect x="4" y="9" width="8" height="5" fill="#ffe0b2" />
    {/* Eyes */}
    <rect x="5" y="10" width="1" height="2" fill="#000000" />
    <rect x="10" y="10" width="1" height="2" fill="#000000" />
  </svg>
);

const FireCrystalIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Black outline */}
    <rect x="5" y="2" width="6" height="1" fill="#000" />
    <rect x="3" y="3" width="10" height="1" fill="#000" />
    <rect x="2" y="4" width="12" height="8" fill="#000" />
    <rect x="3" y="12" width="10" height="1" fill="#000" />
    <rect x="5" y="13" width="6" height="1" fill="#000" />
    {/* Red crystal body */}
    <rect x="5" y="3" width="6" height="10" fill="#d32f2f" />
    <rect x="3" y="5" width="10" height="6" fill="#d32f2f" />
    <rect x="4" y="4" width="8" height="8" fill="#d32f2f" />
    {/* Orange inner glow */}
    <rect x="5" y="4" width="6" height="2" fill="#ff7043" />
    <rect x="4" y="5" width="2" height="6" fill="#ff7043" />
    {/* Center hole / white core */}
    <rect x="6" y="6" width="4" height="4" fill="#ffffff" />
  </svg>
);

const BananaIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Black outline */}
    <rect x="10" y="2" width="4" height="2" fill="#000" />
    <rect x="7" y="4" width="6" height="2" fill="#000" />
    <rect x="4" y="6" width="6" height="2" fill="#000" />
    <rect x="2" y="8" width="5" height="4" fill="#000" />
    <rect x="1" y="11" width="4" height="4" fill="#000" />
    {/* Stem top */}
    <rect x="12" y="2" width="1" height="2" fill="#5d4037" />
    {/* Yellow body */}
    <rect x="9" y="4" width="3" height="1" fill="#fbc02d" />
    <rect x="6" y="5" width="5" height="2" fill="#ffeb3b" />
    <rect x="4" y="7" width="5" height="2" fill="#ffeb3b" />
    <rect x="3" y="9" width="3" height="2" fill="#ffeb3b" />
    <rect x="2" y="11" width="2" height="2" fill="#fbc02d" />
    {/* Tip bottom */}
    <rect x="1" y="13" width="1" height="1" fill="#5d4037" />
  </svg>
);

const CatBellIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Black outline */}
    <rect x="6" y="2" width="4" height="1" fill="#000" />
    <rect x="5" y="3" width="6" height="1" fill="#000" />
    <rect x="4" y="4" width="8" height="7" fill="#000" />
    <rect x="2" y="11" width="12" height="3" fill="#000" />
    {/* Gold bell body */}
    <rect x="6" y="3" width="4" height="1" fill="#ffd54f" />
    <rect x="5" y="4" width="6" height="2" fill="#ffc107" />
    <rect x="5" y="6" width="6" height="4" fill="#ffb300" />
    <rect x="3" y="11" width="10" height="2" fill="#ffa000" />
    {/* Bell white shine */}
    <rect x="6" y="4" width="2" height="4" fill="#ffffff" />
    {/* Clapper slit */}
    <rect x="7" y="8" width="2" height="2" fill="#000000" />
    <rect x="7" y="12" width="2" height="1" fill="#ffffff" />
  </svg>
);

const EmberHeartIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Black outline */}
    <rect x="5" y="1" width="6" height="1" fill="#000" />
    <rect x="3" y="2" width="10" height="1" fill="#000" />
    <rect x="2" y="3" width="12" height="6" fill="#000" />
    <rect x="3" y="9" width="10" height="6" fill="#000" />
    <rect x="5" y="15" width="6" height="1" fill="#000" />
    {/* Green mushroom cap */}
    <rect x="5" y="2" width="6" height="7" fill="#2e7d32" />
    <rect x="3" y="3" width="10" height="5" fill="#2e7d32" />
    {/* White spots */}
    <rect x="6" y="3" width="4" height="3" fill="#ffffff" />
    <rect x="3" y="5" width="2" height="2" fill="#ffffff" />
    <rect x="11" y="5" width="2" height="2" fill="#ffffff" />
    {/* Beige stem */}
    <rect x="4" y="9" width="8" height="5" fill="#ffe0b2" />
    {/* Eyes */}
    <rect x="5" y="10" width="1" height="2" fill="#000000" />
    <rect x="10" y="10" width="1" height="2" fill="#000000" />
  </svg>
);

const GoldenRelicIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Black outline */}
    <rect x="7" y="1" width="2" height="1" fill="#000" />
    <rect x="5" y="2" width="6" height="2" fill="#000" />
    <rect x="3" y="4" width="10" height="2" fill="#000" />
    <rect x="1" y="6" width="14" height="4" fill="#000" />
    <rect x="3" y="10" width="10" height="2" fill="#000" />
    <rect x="5" y="12" width="6" height="2" fill="#000" />
    <rect x="7" y="14" width="2" height="1" fill="#000" />
    {/* Diamond yellow fill */}
    <rect x="7" y="2" width="2" height="12" fill="#ffd700" />
    <rect x="5" y="4" width="6" height="8" fill="#ffca28" />
    <rect x="3" y="6" width="10" height="4" fill="#ffb300" />
    {/* White sparkle center */}
    <rect x="6" y="5" width="2" height="2" fill="#ffffff" />
  </svg>
);

const SproutEnemyIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="6" y="1" width="4" height="2" fill="#2e7d32" />
    <rect x="4" y="3" width="8" height="2" fill="#000" />
    <rect x="3" y="5" width="10" height="7" fill="#000" />
    <rect x="4" y="5" width="8" height="6" fill="#8d6e63" />
    <rect x="5" y="7" width="2" height="3" fill="#ffffff" />
    <rect x="9" y="7" width="2" height="3" fill="#ffffff" />
    <rect x="6" y="8" width="1" height="2" fill="#000000" />
    <rect x="10" y="8" width="1" height="2" fill="#000000" />
    <rect x="3" y="12" width="3" height="3" fill="#5d4037" />
    <rect x="10" y="12" width="3" height="3" fill="#5d4037" />
  </svg>
);

const BrambleShellIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="5" y="2" width="6" height="1" fill="#000" />
    <rect x="3" y="3" width="10" height="1" fill="#000" />
    <rect x="2" y="4" width="12" height="8" fill="#000" />
    <rect x="3" y="12" width="10" height="1" fill="#000" />
    <rect x="5" y="13" width="6" height="1" fill="#000" />
    <rect x="4" y="4" width="8" height="8" fill="#1565c0" />
    <rect x="6" y="5" width="4" height="6" fill="#1e88e5" />
    <rect x="3" y="8" width="10" height="3" fill="#fff" />
  </svg>
);

const PuffwingIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="2" y="4" width="12" height="8" fill="#000" />
    <rect x="3" y="5" width="10" height="6" fill="#00bcd4" />
    <rect x="1" y="6" width="14" height="3" fill="#00e5ff" />
    <rect x="5" y="6" width="2" height="2" fill="#fff" />
    <rect x="9" y="6" width="2" height="2" fill="#fff" />
    <rect x="6" y="7" width="1" height="1" fill="#000" />
    <rect x="10" y="7" width="1" height="1" fill="#000" />
  </svg>
);

const EmberjawIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="4" y="1" width="8" height="10" fill="#000" />
    <rect x="5" y="2" width="6" height="8" fill="#c62828" />
    <rect x="6" y="3" width="2" height="2" fill="#fff" />
    <rect x="9" y="3" width="2" height="2" fill="#fff" />
    <rect x="5" y="6" width="6" height="2" fill="#ffffff" />
    <rect x="6" y="6" width="1" height="1" fill="#000" />
    <rect x="9" y="6" width="1" height="1" fill="#000" />
    <rect x="3" y="10" width="10" height="5" fill="#2e7d32" />
  </svg>
);

const SpikerIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="1" width="2" height="3" fill="#000" />
    <rect x="3" y="4" width="10" height="8" fill="#000" />
    <rect x="4" y="5" width="8" height="6" fill="#d84800" />
    <rect x="5" y="6" width="2" height="2" fill="#ffeb3b" />
    <rect x="9" y="6" width="2" height="2" fill="#ffeb3b" />
    <rect x="3" y="11" width="3" height="3" fill="#000" />
    <rect x="10" y="11" width="3" height="3" fill="#000" />
  </svg>
);

const BowserIcon = () => (
  <svg width="44" height="44" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="5" y="1" width="6" height="3" fill="#000" />
    <rect x="6" y="1" width="4" height="2" fill="#ffd700" />
    <rect x="3" y="4" width="10" height="9" fill="#000" />
    <rect x="4" y="5" width="8" height="7" fill="#2e7d32" />
    <rect x="5" y="6" width="2" height="2" fill="#c62828" />
    <rect x="9" y="6" width="2" height="2" fill="#c62828" />
    <rect x="4" y="9" width="8" height="2" fill="#ffeb3b" />
  </svg>
);

const powerUpsData = [
  {
    title: 'GROWTH ORB',
    description: 'Grow big - take one extra hit and smash bricks.',
    icon: <GrowthOrbIcon />,
  },
  {
    title: 'FIRE CRYSTAL',
    description: "Throw with X - the shot matches your hero's signature move.",
    icon: <FireCrystalIcon />,
  },
  {
    title: 'BANANA',
    description: 'Monkey form: higher jumps and arcing bananas along the floor.',
    icon: <BananaIcon />,
  },
  {
    title: 'CAT BELL',
    description: 'Cat form: claws, the highest leap and a bonus air jump.',
    icon: <CatBellIcon />,
  },
  {
    title: 'EMBER HEART',
    description: 'Hidden 1-Up. Adds a life to your run.',
    icon: <EmberHeartIcon />,
  },
  {
    title: 'GOLDEN RELIC',
    description: 'Three per stage, tucked into secret routes.',
    icon: <GoldenRelicIcon />,
  },
];

const enemiesData = [
  {
    title: 'SPROUT WALKER',
    description: 'Basic patroller. Stomp or blast to clear your path.',
    icon: <SproutEnemyIcon />,
  },
  {
    title: 'BRAMBLE SHELL',
    description: 'Stomp once to retreat into shell, stomp again to kick!',
    icon: <BrambleShellIcon />,
  },
  {
    title: 'PUFFWING',
    description: 'Floats in sine waves. Watch out for unpredictable flight!',
    icon: <PuffwingIcon />,
  },
  {
    title: 'EMBERJAW BLOOM',
    description: 'Emerges periodically from pipes. Cannot be stomped!',
    icon: <EmberjawIcon />,
  },
  {
    title: 'CINDER SPIKER',
    description: 'Charges fast when you get close. Sharp spikes - do not stomp!',
    icon: <SpikerIcon />,
  },
  {
    title: 'KING KOOPA',
    description: 'Ruler of the final stage. Breathes fire and leaps across arenas.',
    icon: <BowserIcon />,
  },
];

export default function ArchiveModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<string>('powerups');

  const handleTabChange = (val: string) => {
    RetroAudio.playClick();
    setActiveTab(val);
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
              ARCHIVE
            </div>
            <div
              style={{
                color: '#a0a0a0',
                fontSize: 7.5,
                letterSpacing: 1,
              }}
            >
              KNOW IT BEFORE IT KNOWS YOU
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

        {/* Radix UI Tabs Component */}
        <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
          {/* Navigation Tabs Bar */}
          <Tabs.List
            style={{
              backgroundColor: '#e9ecef',
              padding: '14px 20px 0px 20px',
              display: 'flex',
              gap: 12,
            }}
          >
            <Tabs.Trigger
              value="powerups"
              style={{
                backgroundColor: activeTab === 'powerups' ? '#ffc107' : '#ffffff',
                color: '#000000',
                border: '3px solid #000',
                boxShadow: '3px 3px 0 #000',
                padding: '9px 18px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                fontWeight: 'bold',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={() => RetroAudio.playHover()}
            >
              POWER-UPS
            </Tabs.Trigger>

            <Tabs.Trigger
              value="enemies"
              style={{
                backgroundColor: activeTab === 'enemies' ? '#ffc107' : '#ffffff',
                color: '#000000',
                border: '3px solid #000',
                boxShadow: '3px 3px 0 #000',
                padding: '9px 18px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                fontWeight: 'bold',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={() => RetroAudio.playHover()}
            >
              ENEMIES
            </Tabs.Trigger>
          </Tabs.List>

          {/* Content Box with Grid */}
          <div
            style={{
              padding: 20,
              backgroundColor: '#e9ecef',
            }}
          >
            <Tabs.Content value="powerups">
              <div
                style={{
                  border: '3px solid #000',
                  padding: 14,
                  backgroundColor: '#f8f9fa',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                }}
              >
                {powerUpsData.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '3px solid #000',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      minHeight: 78,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 5,
                      }}
                    >
                      <div
                        style={{
                          color: '#d32f2f',
                          fontSize: 9.5,
                          fontWeight: 'bold',
                          letterSpacing: 0.5,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: '#000000',
                          fontSize: 7.5,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            <Tabs.Content value="enemies">
              <div
                style={{
                  border: '3px solid #000',
                  padding: 14,
                  backgroundColor: '#f8f9fa',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                }}
              >
                {enemiesData.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '3px solid #000',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      minHeight: 78,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 5,
                      }}
                    >
                      <div
                        style={{
                          color: '#d32f2f',
                          fontSize: 9.5,
                          fontWeight: 'bold',
                          letterSpacing: 0.5,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: '#000000',
                          fontSize: 7.5,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}


