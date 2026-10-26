import { useState } from 'react';
import { RetroAudio } from '../../game/audio/RetroAudio';

import { HEROES_ROSTER } from '../../game/data/heroes';
import type { HeroData } from '../../game/data/heroes';
interface Props {
  onClose: () => void;
  onSelectHeroAndPlay: (heroId: string) => void;
  onOpenWorldMap: () => void;
}


export default function HeroSelectModal({ onClose, onSelectHeroAndPlay, onOpenWorldMap }: Props) {
  const [selectedHeroId, setSelectedHeroId] = useState<string>('riko');

  const selectedIndex = HEROES_ROSTER.findIndex((h) => h.id === selectedHeroId);
  const hero = HEROES_ROSTER[selectedIndex] || HEROES_ROSTER[0];

  const handlePrev = () => {
    RetroAudio.playClick();
    const prevIdx = (selectedIndex - 1 + HEROES_ROSTER.length) % HEROES_ROSTER.length;
    setSelectedHeroId(HEROES_ROSTER[prevIdx].id);
  };

  const handleNext = () => {
    RetroAudio.playClick();
    const nextIdx = (selectedIndex + 1) % HEROES_ROSTER.length;
    setSelectedHeroId(HEROES_ROSTER[nextIdx].id);
  };

  const renderPixelSprite = (heroData: HeroData, size = 36) => {
    const c = heroData.colors;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        <rect x="3" y="1" width="6" height="1" fill={c.hat} />
        <rect x="2" y="2" width="10" height="1" fill={c.hat} />
        <rect x="2" y="3" width="3" height="1" fill={c.shoes} />
        <rect x="5" y="3" width="2" height="1" fill={c.skin} />
        <rect x="7" y="3" width="1" height="1" fill="#000000" />
        <rect x="8" y="3" width="1" height="1" fill={c.skin} />
        <rect x="1" y="4" width="1" height="3" fill={c.shoes} />
        <rect x="2" y="4" width="1" height="1" fill={c.skin} />
        <rect x="3" y="4" width="1" height="1" fill={c.shoes} />
        <rect x="4" y="4" width="3" height="1" fill={c.skin} />
        <rect x="7" y="4" width="1" height="1" fill={c.shoes} />
        <rect x="8" y="4" width="3" height="1" fill={c.skin} />
        <rect x="2" y="5" width="1" height="1" fill={c.shoes} />
        <rect x="3" y="5" width="2" height="1" fill={c.skin} />
        <rect x="5" y="5" width="4" height="1" fill={c.shoes} />
        <rect x="9" y="5" width="3" height="1" fill={c.skin} />
        <rect x="3" y="6" width="6" height="1" fill={c.skin} />
        <rect x="2" y="7" width="2" height="1" fill={c.hat} />
        <rect x="4" y="7" width="1" height="1" fill={c.overalls} />
        <rect x="5" y="7" width="2" height="1" fill={c.hat} />
        <rect x="7" y="7" width="1" height="1" fill={c.overalls} />
        <rect x="8" y="7" width="2" height="1" fill={c.hat} />
        <rect x="1" y="8" width="3" height="1" fill={c.hat} />
        <rect x="4" y="8" width="1" height="1" fill={c.overalls} />
        <rect x="5" y="8" width="2" height="1" fill={c.button} />
        <rect x="7" y="8" width="1" height="1" fill={c.overalls} />
        <rect x="8" y="8" width="3" height="1" fill={c.hat} />
        <rect x="1" y="9" width="3" height="1" fill={c.hat} />
        <rect x="4" y="9" width="4" height="1" fill={c.overalls} />
        <rect x="8" y="9" width="3" height="1" fill={c.hat} />
        <rect x="2" y="10" width="2" height="1" fill={c.skin} />
        <rect x="4" y="10" width="4" height="1" fill={c.overalls} />
        <rect x="8" y="10" width="2" height="1" fill={c.skin} />
        <rect x="4" y="11" width="2" height="2" fill={c.overalls} />
        <rect x="6" y="11" width="2" height="2" fill={c.overalls} />
        <rect x="3" y="13" width="3" height="1" fill={c.shoes} />
        <rect x="6" y="13" width="3" height="1" fill={c.shoes} />
      </svg>
    );
  };

  return (
    <div className="retro-modal-backdrop" onClick={onClose}>
      <div
        className="hero-select-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '780px',
          maxWidth: '96%',
          backgroundColor: '#0a0b10',
          border: '4px solid #000',
          boxShadow: '8px 8px 0px #000',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0a0b10',
            padding: '2px 4px',
          }}
        >
          <div>
            <div style={{ color: '#ffcc00', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>
              SELECT YOUR HERO
            </div>
            <div style={{ color: '#a0a0a0', fontSize: '8px', marginTop: '4px', letterSpacing: '0.5px' }}>
              10 UNIQUE PLAYSTYLES
            </div>
          </div>

          <button
            onClick={() => {
              RetroAudio.playClick();
              onClose();
            }}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '3px solid #000',
              boxShadow: '3px 3px 0 #000',
              padding: '6px 14px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer',
              outline: 'none',
            }}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            BACK
          </button>
        </div>

        <div className="hero-detail-grid"
          style={{
            backgroundColor: '#ffffff',
            border: '3px solid #000',
            padding: '14px',
            display: 'grid',
            gridTemplateColumns: '250px 1fr',
            gap: '14px',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                height: '140px',
                backgroundColor: '#5c94fc',
                border: '3px solid #000',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <div style={{ transform: 'scale(2.2)', animation: 'marioBounce 1.5s infinite ease-in-out' }}>
                {renderPixelSprite(hero, 36)}
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#d84800',
                  color: '#fff',
                  fontSize: '8.5px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '5px 0',
                  borderTop: '2px solid #000',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {hero.special.name}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                style={{
                  backgroundColor: '#ffffff',
                  border: '3px solid #000',
                  boxShadow: '2px 2px 0 #000',
                  padding: '6px 10px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: "'Press Start 2P', monospace",
                }}
                onClick={handlePrev}
                onMouseEnter={() => RetroAudio.playHover()}
              >
                ◄
              </button>

              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  border: '3px solid #000',
                  padding: '6px 4px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>
                  {hero.name}
                </div>
                <div style={{ fontSize: '7px', color: '#666', marginTop: '3px' }}>
                  {hero.playstyle}
                </div>
              </div>

              <button
                style={{
                  backgroundColor: '#ffffff',
                  border: '3px solid #000',
                  boxShadow: '2px 2px 0 #000',
                  padding: '6px 10px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: "'Press Start 2P', monospace",
                }}
                onClick={handleNext}
                onMouseEnter={() => RetroAudio.playHover()}
              >
                ►
              </button>
            </div>

            <div style={{ fontSize: '7.5px', color: '#666', textAlign: 'center', letterSpacing: '0.5px' }}>
              DIFFICULTY {'★'.repeat(hero.difficultyStars)}{'☆'.repeat(5 - hero.difficultyStars)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8.5px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 18px', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#000' }}>SPEED</span>
                <div style={{ backgroundColor: '#e0e0e0', border: '2px solid #000', height: '14px', position: 'relative' }}>
                  <div style={{ backgroundColor: '#00c800', width: `${hero.stats.speed * 10}%`, height: '100%' }} />
                </div>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{hero.stats.speed}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 18px', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#000' }}>JUMP</span>
                <div style={{ backgroundColor: '#e0e0e0', border: '2px solid #000', height: '14px', position: 'relative' }}>
                  <div style={{ backgroundColor: '#00c800', width: `${hero.stats.jump * 10}%`, height: '100%' }} />
                </div>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{hero.stats.jump}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 18px', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#000' }}>POWER</span>
                <div style={{ backgroundColor: '#e0e0e0', border: '2px solid #000', height: '14px', position: 'relative' }}>
                  <div style={{ backgroundColor: '#ffcc00', width: `${hero.stats.power * 10}%`, height: '100%' }} />
                </div>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{hero.stats.power}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 18px', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#000' }}>DEFENSE</span>
                <div style={{ backgroundColor: '#e0e0e0', border: '2px solid #000', height: '14px', position: 'relative' }}>
                  <div style={{ backgroundColor: '#999999', width: `${hero.stats.defense * 10}%`, height: '100%' }} />
                </div>
                <span style={{ fontWeight: 'bold', color: '#000' }}>{hero.stats.defense}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div
                style={{
                  backgroundColor: '#0a0a0c',
                  color: '#fff',
                  border: '3px solid #000',
                  boxShadow: '3px 3px 0px #000',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ fontSize: '7.5px', color: '#ffcc00', fontWeight: 'bold' }}>
                  SPECIAL • X
                </div>
                <div style={{ fontSize: '9px', fontWeight: 'bold' }}>
                  {hero.special.name}
                </div>
                <div style={{ fontSize: '6.5px', color: '#ccc', lineHeight: '1.4', marginTop: '2px' }}>
                  {hero.special.desc}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0a0a0c',
                  color: '#fff',
                  border: '3px solid #000',
                  boxShadow: '3px 3px 0px #000',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ fontSize: '7.5px', color: '#ffcc00', fontWeight: 'bold' }}>
                  PASSIVE
                </div>
                <div style={{ fontSize: '9px', fontWeight: 'bold' }}>
                  {hero.passive.name}
                </div>
                <div style={{ fontSize: '6.5px', color: '#ccc', lineHeight: '1.4', marginTop: '2px' }}>
                  {hero.passive.desc}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {hero.tags.positives.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#00c800',
                    color: '#ffffff',
                    border: '2px solid #000',
                    fontSize: '6.5px',
                    fontWeight: 'bold',
                    padding: '3px 6px',
                  }}
                >
                  {tag}
                </span>
              ))}

              {hero.tags.negatives.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#e60012',
                    color: '#ffffff',
                    border: '2px solid #000',
                    fontSize: '6.5px',
                    fontWeight: 'bold',
                    padding: '3px 6px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-roster-grid"
          style={{
            backgroundColor: '#ffffff',
            border: '3px solid #000',
            padding: '6px',
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '4px',
            overflowX: 'auto',
          }}
        >
          {HEROES_ROSTER.map((item) => {
            const isSelected = item.id === hero.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  RetroAudio.playClick();
                  setSelectedHeroId(item.id);
                }}
                style={{
                  backgroundColor: isSelected ? '#ffcc00' : '#ffffff',
                  border: '3px solid #000',
                  boxShadow: isSelected ? '3px 3px 0px #000' : 'none',
                  padding: '6px 2px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transform: isSelected ? 'translate(-1px, -1px)' : 'none',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={() => RetroAudio.playHover()}
              >
                {renderPixelSprite(item, 24)}
                <span style={{ fontSize: '6.5px', fontWeight: 'bold', color: '#000', marginTop: '2px' }}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="hero-action-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px', gap: '8px' }}>
          <button
            style={{
              backgroundColor: '#ffcc00',
              color: '#000000',
              border: '3px solid #000',
              boxShadow: '4px 4px 0 #000',
              padding: '10px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              outline: 'none',
            }}
            onClick={() => {
              RetroAudio.playStartGame();
              onSelectHeroAndPlay(hero.id);
            }}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            START {hero.name} • 1-1
          </button>

          <button
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '3px solid #000',
              boxShadow: '3px 3px 0 #000',
              padding: '10px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer',
              outline: 'none',
            }}
            onClick={() => {
              RetroAudio.playClick();
              onOpenWorldMap();
            }}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            WORLD MAP
          </button>

          <button
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '3px solid #000',
              boxShadow: '3px 3px 0 #000',
              padding: '10px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer',
              outline: 'none',
            }}
            onClick={() => {
              RetroAudio.playClick();
              onClose();
            }}
            onMouseEnter={() => RetroAudio.playHover()}
          >
            BACK
          </button>
        </div>

        <div style={{ fontSize: '7px', color: '#888', textAlign: 'center', marginTop: '2px' }}>
          0/32 STAGES CLEARED • NEXT UP 1-1 TUTORIAL MEADOW
        </div>
      </div>
    </div>
  );
}
