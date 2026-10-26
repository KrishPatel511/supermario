import { useState } from 'react';
import { RetroAudio } from '../../game/audio/RetroAudio';

interface Props {
  onClose: () => void;
  onSelectLevel: (levelId: string) => void;
}

export interface WorldStage {
  id: string;
  number: string;
  name: string;
  status: 'open' | 'locked';
  isBoss?: boolean;
  bestScore: string;
  bestTime: string;
  stars: string;
  clearedStatus: string;
  objective: string;
  tileset: string;
}

export interface WorldInfo {
  num: number;
  name: string;
  theme: string;
  desc: string;
  stages: WorldStage[];
}

export const WORLD_DATA: Record<number, WorldInfo> = {
  1: {
    num: 1,
    name: 'EMBERLEAF MEADOW',
    theme: 'GREEN PLAINS',
    desc: 'Grass, bridges, pipes and hills — learn to run, jump and bump blocks.',
    stages: [
      { id: '1-1', number: '1-1', name: 'TUTORIAL MEADOW', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '3 / 3', clearedStatus: 'OPEN', objective: 'Collect 10 coins and reach flag', tileset: 'GREEN PLAINS SET' },
      { id: '1-2', number: '1-2', name: 'UNDERGROUND CAVERN', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Explore subterranean tunnels', tileset: 'SUBTERRANEAN CAVERN' },
      { id: '1-3', number: '1-3', name: 'SKY HIGHWAY', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Cross high cloud platforms', tileset: 'SKY PLATFORMS' },
      { id: '1-4', number: '1-4 • BOSS', name: 'MEADOW FORTRESS', status: 'open', isBoss: true, bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Defeat Fortress Guard', tileset: 'CASTLE KEEP' },
    ],
  },
  2: {
    num: 2,
    name: 'SUNSCORCH DUNES',
    theme: 'DESERT',
    desc: 'Golden sands, moving platforms, and cacti hazards across wide chasms.',
    stages: [
      { id: '2-1', number: '2-1', name: 'SANDSTONE WASTES', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Avoid cacti and pit drops', tileset: 'DESERT SANDSTONE' },
      { id: '2-2', number: '2-2', name: 'QUICKSAND RUN', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Ride horizontal moving platforms', tileset: 'DESERT RUN' },
      { id: '2-3', number: '2-3', name: 'PYRAMID LEDGES', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Climb high pyramid staircases', tileset: 'PYRAMID RUINS' },
      { id: '2-4', number: '2-4 • BOSS', name: 'DESERT BASTION', status: 'open', isBoss: true, bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Survive Bastion Boss Arena', tileset: 'DESERT BASTION' },
    ],
  },
  3: {
    num: 3,
    name: 'FROSTBITE PEAKS',
    theme: 'ICE MOUNTAIN',
    desc: 'Snowy ridges, slippery ice physics, and sharp falling icicles.',
    stages: [
      { id: '3-1', number: '3-1', name: 'SNOWFLAKE PASS', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Master slippery ice sliding', tileset: 'ICE MOUNTAIN' },
      { id: '3-2', number: '3-2', name: 'GLACIAL CAVERN', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Navigate frozen ice blocks', tileset: 'FROZEN CAVERN' },
      { id: '3-3', number: '3-3', name: 'FROSTBITE RIDGE', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Leap across icy gaps', tileset: 'ICE GLACIER' },
      { id: '3-4', number: '3-4 • BOSS', name: 'ICE CITADEL', status: 'open', isBoss: true, bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Defeat Citadel Ice Boss', tileset: 'FROST CITADEL' },
    ],
  },
  4: {
    num: 4,
    name: 'BOWSER VOLCANIC KEEP',
    theme: 'LAVA CASTLE',
    desc: 'Volcanic brick, glowing lava hazards, fireballs, and Bowser final Boss fight!',
    stages: [
      { id: '4-1', number: '4-1', name: 'ASHFALL TRAIL', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Avoid bottom lava pit', tileset: 'VOLCANIC TRAIL' },
      { id: '4-2', number: '4-2', name: 'MAGMA VAULT', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Survive volcanic spikes', tileset: 'MAGMA CHAMBER' },
      { id: '4-3', number: '4-3', name: 'INFERNO BRIDGE', status: 'open', bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'Cross collapsing bridges', tileset: 'LAVA KEEP' },
      { id: '4-4', number: '4-4 • BOSS', name: "BOWSER'S LAIR", status: 'open', isBoss: true, bestScore: '000000', bestTime: '--:--', stars: '0 / 3', clearedStatus: 'OPEN', objective: 'DEFEAT BOWSER IN FINAL BOSS FIGHT', tileset: 'BOWSER LAIR' },
    ],
  },
};

export default function WorldMapModal({ onClose, onSelectLevel }: Props) {
  const [activeWorld, setActiveWorld] = useState<number>(1);
  const [selectedStageId, setSelectedStageId] = useState<string>('1-1');

  const currentWorld = WORLD_DATA[activeWorld] || WORLD_DATA[1];
  const selectedStage = currentWorld.stages.find((s) => s.id === selectedStageId) || currentWorld.stages[0];

  const handlePlayLevel = () => {
    RetroAudio.playStartGame();
    onSelectLevel(selectedStage.id);
  };

  return (
    <div className="retro-modal-backdrop" onClick={onClose}>
      <div
        className="world-map-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '760px',
          maxWidth: '96%',
          backgroundColor: '#0a0b10',
          border: '4px solid #000',
          boxShadow: '8px 8px 0px #000',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontFamily: "'Silkscreen', 'Press Start 2P', monospace",
        }}
      >
        {/* Top Dark Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0a0b10',
            padding: '4px 6px',
          }}
        >
          <div>
            <div style={{ color: '#ffd000', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>
              WORLD MAP
            </div>
            <div style={{ color: '#aaa', fontSize: '9px', marginTop: '4px', letterSpacing: '0.5px' }}>
              16 STAGES • 4 WORLDS UNLOCKED
            </div>
          </div>

          <button
            className="retro-btn"
            style={{ padding: '6px 16px', fontSize: '11px', backgroundColor: '#ffffff' }}
            onClick={() => {
              RetroAudio.playClick();
              onClose();
            }}
          >
            BACK
          </button>
        </div>

        {/* Top World Tabs Row (W1 - W4 playable) */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[1, 2, 3, 4].map((wNum) => {
            const isActive = activeWorld === wNum;
            const wInfo = WORLD_DATA[wNum];
            return (
              <div
                key={wNum}
                onClick={() => {
                  RetroAudio.playClick();
                  setActiveWorld(wNum);
                  setSelectedStageId(`${wNum}-1`);
                }}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  height: '36px',
                  backgroundColor: isActive ? '#ffd000' : '#e0e0e2',
                  border: '3px solid #000',
                  boxShadow: isActive ? '2px 2px 0px #000' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: isActive ? '#000' : '#666',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={() => RetroAudio.playHover()}
              >
                {`W${wNum}: ${wInfo.theme}`}
              </div>
            );
          })}
        </div>

        {/* Main White Content Area */}
        <div className="world-map-grid"
          style={{
            backgroundColor: '#f8f9fa',
            border: '3px solid #000',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: World Title + Description + Level Cards Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>
              WORLD {currentWorld.num} • {currentWorld.name}
            </div>
            <div style={{ color: '#555', fontSize: '9px', lineHeight: '1.4' }}>
              {currentWorld.desc}
            </div>

            {/* Vertical Path & Stacked Level Cards */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  bottom: '20px',
                  left: '50%',
                  width: '3px',
                  backgroundColor: '#aaa',
                  transform: 'translateX(-50%)',
                  zIndex: 0,
                }}
              />

              {currentWorld.stages.map((stage) => {
                const isOpen = stage.status === 'open';
                const isSelected = selectedStage.id === stage.id;

                return (
                  <div
                    key={stage.id}
                    onClick={() => {
                      if (isOpen) {
                        RetroAudio.playClick();
                        setSelectedStageId(stage.id);
                      }
                    }}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      backgroundColor: isOpen ? (isSelected ? '#ffd000' : '#ffffff') : '#e0e2e5',
                      border: '3px solid #000',
                      boxShadow: isSelected ? '4px 4px 0px #000' : 'none',
                      padding: '12px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                      transition: 'all 0.1s ease',
                    }}
                    onMouseEnter={() => RetroAudio.playHover()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px' }}>
                        {stage.isBoss ? '👑' : '⭐'}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#000' }}>
                          {stage.number}
                        </span>
                        <span style={{ fontSize: '9px', color: '#333' }}>
                          {stage.name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 'bold',
                          border: '2px solid #000',
                          padding: '2px 6px',
                          backgroundColor: isSelected ? '#000' : '#fff',
                          color: isSelected ? '#fff' : '#000',
                        }}
                      >
                        {isSelected ? 'SELECTED' : 'PLAY'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Level Info Panel */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '3px solid #000',
              boxShadow: '6px 6px 0px #000',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Stage Title */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>
                {selectedStage.number}
              </div>
              <div style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>
                {selectedStage.name}
              </div>
            </div>

            {/* Stat rows with dotted dividers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '9px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #ccc',
                  paddingBottom: '4px',
                }}
              >
                <span style={{ color: '#555' }}>BEST SCORE</span>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{selectedStage.bestScore}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #ccc',
                  paddingBottom: '4px',
                }}
              >
                <span style={{ color: '#555' }}>BEST TIME</span>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{selectedStage.bestTime}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #ccc',
                  paddingBottom: '4px',
                }}
              >
                <span style={{ color: '#555' }}>STARS</span>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{selectedStage.stars}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: '#555' }}>STATUS</span>
                <span style={{ fontWeight: 'bold', color: selectedStage.status === 'open' ? '#e60012' : '#888' }}>
                  {selectedStage.clearedStatus}
                </span>
              </div>
            </div>

            {/* Objective Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#333' }}>OBJECTIVE</div>
              <div style={{ fontSize: '9px', color: '#000', fontWeight: 'bold' }}>
                {selectedStage.objective}
              </div>
            </div>

            {/* Tileset Pill Badge */}
            <div>
              <span
                style={{
                  fontSize: '8px',
                  border: '2px solid #000',
                  padding: '3px 8px',
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                  display: 'inline-block',
                }}
              >
                ☒ {selectedStage.tileset}
              </span>
            </div>

            {/* Action Play Button */}
            <button
              className="retro-btn retro-btn-yellow retro-btn-full"
              style={{ marginTop: '8px', fontSize: '11px', padding: '10px' }}
              onClick={handlePlayLevel}
              onMouseEnter={() => RetroAudio.playHover()}
            >
              PLAY {selectedStage.id}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
