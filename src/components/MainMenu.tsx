import { RetroAudio } from '../game/audio/RetroAudio';

interface Props {
  activeHeroName?: string;
  onStartGame: () => void;
  onOpenWorldMap: () => void;
  onOpenArchive: () => void;
  onOpenControls: () => void;
  onOpenSettings: () => void;
  onOpenInspector: () => void;
}

export default function MainMenu({
  activeHeroName = 'RIKO',
  onStartGame,
  onOpenWorldMap,
  onOpenArchive,
  onOpenControls,
  onOpenSettings,
  onOpenInspector,
}: Props) {
  const handleBtnClick = (action: () => void) => {
    RetroAudio.playClick();
    action();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '18px',
        paddingBottom: '96px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Top Section: Subtitle & Title Box */}
      <div className="retro-title-container">
        <div className="retro-subtitle">AN ORIGINAL 8-BIT ADVENTURE</div>
        <div className="retro-title-card">
          <div className="retro-title-text">
            RIKO <span className="retro-title-highlight">&</span> THE
            <br />
            EMBERLEAF MEADOW
          </div>
        </div>

        {/* Sub-tags Pill Badges Row */}
        <div className="retro-tags-row">
          <div className="retro-tag">
            <span className="retro-tag-accent">▲</span> 10 HEROES
          </div>
          <div className="retro-tag">4 WORLDS - 16 STAGES</div>
          <div className="retro-tag">ORIGINAL ART & AUDIO</div>
        </div>
      </div>

      {/* Center 8-Bit Mario Character Sprite */}
      <div className="mario-character-container" style={{ margin: '14px 0 8px 0' }}>
        <svg className="mario-pixel-sprite" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hat & Hair */}
          <rect x="3" y="1" width="6" height="1" fill="#E60012" />
          <rect x="2" y="2" width="10" height="1" fill="#E60012" />
          <rect x="2" y="3" width="3" height="1" fill="#882800" />
          <rect x="5" y="3" width="2" height="1" fill="#FFCC99" />
          <rect x="7" y="3" width="1" height="1" fill="#000000" />
          <rect x="8" y="3" width="1" height="1" fill="#FFCC99" />

          {/* Face */}
          <rect x="1" y="4" width="1" height="3" fill="#882800" />
          <rect x="2" y="4" width="1" height="1" fill="#FFCC99" />
          <rect x="3" y="4" width="1" height="1" fill="#882800" />
          <rect x="4" y="4" width="3" height="1" fill="#FFCC99" />
          <rect x="7" y="4" width="1" height="1" fill="#882800" />
          <rect x="8" y="4" width="3" height="1" fill="#FFCC99" />

          <rect x="2" y="5" width="1" height="1" fill="#882800" />
          <rect x="3" y="5" width="2" height="1" fill="#FFCC99" />
          <rect x="5" y="5" width="4" height="1" fill="#882800" />
          <rect x="9" y="5" width="3" height="1" fill="#FFCC99" />

          <rect x="3" y="6" width="6" height="1" fill="#FFCC99" />

          {/* Shirt & Overalls */}
          <rect x="2" y="7" width="2" height="1" fill="#E60012" />
          <rect x="4" y="7" width="1" height="1" fill="#0022AA" />
          <rect x="5" y="7" width="2" height="1" fill="#E60012" />
          <rect x="7" y="7" width="1" height="1" fill="#0022AA" />
          <rect x="8" y="7" width="2" height="1" fill="#E60012" />

          <rect x="1" y="8" width="3" height="1" fill="#E60012" />
          <rect x="4" y="8" width="1" height="1" fill="#0022AA" />
          <rect x="5" y="8" width="2" height="1" fill="#FFCC00" />
          <rect x="7" y="8" width="1" height="1" fill="#0022AA" />
          <rect x="8" y="8" width="3" height="1" fill="#E60012" />

          <rect x="1" y="9" width="3" height="1" fill="#E60012" />
          <rect x="4" y="9" width="4" height="1" fill="#0022AA" />
          <rect x="8" y="9" width="3" height="1" fill="#E60012" />

          {/* Hands & Pants */}
          <rect x="2" y="10" width="2" height="1" fill="#FFCC99" />
          <rect x="4" y="10" width="4" height="1" fill="#0022AA" />
          <rect x="8" y="10" width="2" height="1" fill="#FFCC99" />

          <rect x="4" y="11" width="2" height="2" fill="#0022AA" />
          <rect x="6" y="11" width="2" height="2" fill="#0022AA" />

          {/* Shoes */}
          <rect x="3" y="13" width="3" height="1" fill="#882800" />
          <rect x="6" y="13" width="3" height="1" fill="#882800" />
        </svg>
      </div>

      {/* Main Menu Card Container */}
      <div className="retro-menu-card">
        {/* Yellow Main Play Button with active hero name */}
        <button
          className="retro-btn retro-btn-yellow retro-btn-full"
          onClick={() => handleBtnClick(onStartGame)}
          onMouseEnter={() => RetroAudio.playHover()}
        >
          PLAY • {activeHeroName.toUpperCase()}
        </button>

        {/* Progress Subtext */}
        <div className="retro-progress-text">
          0 / 16 STAGES CLEARED • NEXT UP 1-1
          <br />
          GREEN PLAINS
        </div>

        {/* 2x2 Grid Buttons */}
        <div className="retro-btn-grid">
          <button
            className="retro-btn"
            onClick={() => handleBtnClick(onOpenWorldMap)}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            WORLD MAP
          </button>
          <button
            className="retro-btn"
            onClick={() => handleBtnClick(onOpenArchive)}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            HERO ROSTER
          </button>
          <button
            className="retro-btn"
            onClick={() => handleBtnClick(onOpenControls)}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            CONTROLS
          </button>
          <button
            className="retro-btn"
            onClick={() => handleBtnClick(onOpenSettings)}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            SETTINGS
          </button>
        </div>

        {/* Full-width bottom Inspector button */}
        <button
          className="retro-btn retro-btn-full"
          onClick={() => handleBtnClick(onOpenInspector)}
          onMouseEnter={() => RetroAudio.playHover()}
        >
          STAGE INSPECTOR
        </button>
      </div>

      {/* Bush/Tree Row - Full Screen width */}
      <div className="bush-row">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="bush" />
        ))}
      </div>

      {/* Ground Tile Floor - Full Screen width */}
      <div className="nes-ground-container">
        <div className="nes-grass-stripe" />
        <div className="nes-brick-floor" />
      </div>
    </div>
  );
}
