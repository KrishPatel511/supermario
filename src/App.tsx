import { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import MainMenu from './components/MainMenu';
import WorldMapModal from './components/Modals/WorldMapModal';
import ControlsModal from './components/Modals/ControlsModal';
import SettingsModal from './components/Modals/SettingsModal';
import ArchiveModal from './components/Modals/ArchiveModal';
import StageInspectorModal from './components/Modals/StageInspectorModal';
import HeroSelectModal from './components/Modals/HeroSelectModal';
import { HEROES_ROSTER } from './game/data/heroes';
import TouchControls from './components/TouchControls';
import LoadingScreen from './components/LoadingScreen';
import { GameSettings } from './game/GameSettings';

type ActiveView = 'menu' | 'game';
type ActiveModal = 'worldmap' | 'controls' | 'settings' | 'archive' | 'inspector' | 'heroselect' | 'loading' | null;

function App() {
  const [view, setView] = useState<ActiveView>('menu');
  const [modal, setModal] = useState<ActiveModal>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<string>('riko');
  const [selectedStageId, setSelectedStageId] = useState<string>('1-1');
  const [crtScanlines, setCrtScanlines] = useState<boolean>(false);

  useEffect(() => {
    GameSettings.applyGlobalEffects();
  }, []);

  const hero = HEROES_ROSTER.find((h) => h.id === selectedHeroId) || HEROES_ROSTER[0];
  const worldNum = selectedStageId.split('-')[0] || '1';

  return (
    <div className="game-viewport">
      {/* CRT Scanline Filter Layer */}
      {crtScanlines && <div className="crt-overlay" />}

      {/* Main Menu View */}
      {view === 'menu' && (
        <MainMenu
          activeHeroName={hero.name}
          onStartGame={() => setModal('heroselect')}
          onOpenWorldMap={() => setModal('worldmap')}
          onOpenArchive={() => setModal('archive')}
          onOpenControls={() => setModal('controls')}
          onOpenSettings={() => setModal('settings')}
          onOpenInspector={() => setModal('inspector')}
        />
      )}

      {/* Playable Widescreen Phaser Mario Canvas View */}
      {view === 'game' && (
        <div className="game-stage">
          <div className="game-stage-grid" />

          <div className="game-stage-header">
            <span className="game-stage-title">🎮 RIKO &amp; THE EMBERLEAF MEADOW</span>
            <span className="game-stage-dot">•</span>
            <span>WORLD {worldNum} - STAGE {selectedStageId}</span>
          </div>

          {/* Widescreen Game Cabinet Container (16:9, scales to any screen) */}
          <div className="game-cabinet">
            <GameCanvas heroId={selectedHeroId} stageId={selectedStageId} />
            <HUD
              heroName={hero.name}
              onReturnToMenu={() => setView('menu')}
              onNextStage={(nextStageId) => {
                setSelectedStageId(nextStageId);
                setModal('loading');
              }}
            />
            <TouchControls />
          </div>

          <div className="rotate-hint">↻ ROTATE YOUR PHONE FOR A BIGGER SCREEN</div>
        </div>
      )}

      {/* Retro Stage Loading Screen */}
      {modal === 'loading' && (
        <LoadingScreen
          heroName={hero.name}
          stageNumber={selectedStageId}
          stageName={`STAGE ${selectedStageId}`}
          worldName={`WORLD ${worldNum}`}
          objective="Reach the flag & defeat enemies"
          onLoadingComplete={() => {
            setModal(null);
            setView('game');
          }}
        />
      )}

      {/* Hero Select Modal Screen */}
      {modal === 'heroselect' && (
        <HeroSelectModal
          onClose={() => setModal(null)}
          onSelectHeroAndPlay={(heroId) => {
            setSelectedHeroId(heroId);
            setModal('loading');
          }}
          onOpenWorldMap={() => setModal('worldmap')}
        />
      )}

      {/* Interactive Sub-Modals */}
      {modal === 'worldmap' && (
        <WorldMapModal
          onClose={() => setModal(null)}
          onSelectLevel={(lvlId) => {
            setSelectedStageId(lvlId);
            setModal('heroselect');
          }}
        />
      )}

      {modal === 'controls' && <ControlsModal onClose={() => setModal(null)} />}

      {modal === 'settings' && (
        <SettingsModal
          onClose={() => setModal(null)}
          crtScanlines={crtScanlines}
          onToggleCrt={() => setCrtScanlines((prev) => !prev)}
        />
      )}

      {modal === 'archive' && <ArchiveModal onClose={() => setModal(null)} />}

      {modal === 'inspector' && <StageInspectorModal onClose={() => setModal(null)} />}
    </div>
  );
}

export default App;
