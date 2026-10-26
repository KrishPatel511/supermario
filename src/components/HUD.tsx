import { useEffect, useRef, useState } from 'react';
import { EventBus } from '../game/EventBus';
import { RetroAudio } from '../game/audio/RetroAudio';

interface HudData {
  score: number;
  lives: number;
  coins: number;
  time: number;
  stage: string;
  heroName?: string;
  specialCooldown?: number;
}

interface Props {
  onReturnToMenu?: () => void;
  onNextStage?: (nextStageId: string) => void;
  heroName?: string;
}

type Status = 'playing' | 'paused' | 'gameover' | 'complete';

function getNextStageId(currentStage: string): string {
  const [worldStr, levelStr] = currentStage.split('-');
  let world = parseInt(worldStr, 10) || 1;
  let level = parseInt(levelStr, 10) || 1;

  if (level < 4) {
    level++;
  } else {
    world = world < 4 ? world + 1 : 1;
    level = 1;
  }
  return `${world}-${level}`;
}

export default function HUD({ onReturnToMenu, onNextStage, heroName = 'RIKO' }: Props) {
  const [hud, setHud] = useState<HudData>({ score: 0, lives: 3, coins: 0, time: 300, stage: '1-1' });
  const [status, setStatus] = useState<Status>('playing');
  const statusRef = useRef<Status>('playing');

  const changeStatus = (next: Status) => {
    statusRef.current = next;
    setStatus(next);
  };

  const restartStage = () => {
    changeStatus('playing');
    EventBus.emit('restart-stage');
  };

  const togglePause = () => {
    if (statusRef.current === 'playing') {
      changeStatus('paused');
      EventBus.emit('set-paused', true);
    } else if (statusRef.current === 'paused') {
      changeStatus('playing');
      EventBus.emit('set-paused', false);
    }
  };

  const togglePauseRef = useRef(togglePause);
  togglePauseRef.current = togglePause;
  const restartRef = useRef(restartStage);
  restartRef.current = restartStage;

  useEffect(() => {
    const onHud = (data: HudData) => setHud(data);
    const onGameOver = () => changeStatus('gameover');
    const onComplete = () => changeStatus('complete');

    EventBus.on('hud-update', onHud);
    EventBus.on('game-over', onGameOver);
    EventBus.on('level-complete', onComplete);

    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        togglePauseRef.current();
      } else if ((e.key === 'r' || e.key === 'R') && statusRef.current !== 'complete') {
        restartRef.current();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      EventBus.off('hud-update', onHud);
      EventBus.off('game-over', onGameOver);
      EventBus.off('level-complete', onComplete);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const currentHeroName = (hud.heroName || heroName).toUpperCase();
  const cd = hud.specialCooldown ?? 0;
  const nextStageId = getNextStageId(hud.stage);

  const click = (action?: () => void) => () => {
    RetroAudio.playClick();
    action?.();
  };

  return (
    <>
      {/* Classic NES-style score bar: LABEL/SCORE — COINS — WORLD — TIME */}
      <div className="hud-top">
        <div className="hud-score-bar">
          <div>
            {currentHeroName}
            <br />
            {hud.score.toString().padStart(6, '0')}
          </div>

          <div className="hud-coins">
            <img src="/assets/coin.png" alt="" />
            <span>×{hud.coins.toString().padStart(2, '0')}</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            WORLD
            <br />
            {hud.stage}
          </div>

          <div style={{ textAlign: 'right' }}>
            TIME
            <br />
            {hud.time}
          </div>
        </div>

        {/* Secondary bar: menu / pause buttons + special ability badge + lives */}
        <div className="hud-sub-bar">
          <div className="hud-btn-group">
            {onReturnToMenu && (
              <button className="retro-btn hud-btn" onClick={click(onReturnToMenu)}>
                ⬅ MENU
              </button>
            )}
            <button className="retro-btn hud-btn" onClick={click(togglePause)} aria-label="Pause">
              {status === 'paused' ? '▶' : '❚❚'}
            </button>
          </div>

          <div className={`hud-special ${cd > 0 ? 'hud-special-cd' : ''}`}>
            [X] SPECIAL {cd > 0 ? `(${cd}s)` : 'READY'}
          </div>

          <span className="hud-lives">
            {Array.from({ length: 3 }).map((_, i) => (
              <img
                key={i}
                src={i < hud.lives ? '/assets/heart_full.png' : '/assets/heart_empty.png'}
                alt=""
              />
            ))}
          </span>
        </div>
      </div>

      {status === 'paused' && (
        <div className="hud-overlay">
          <h2 className="hud-title">PAUSED</h2>
          <div className="hud-actions">
            <button className="retro-btn retro-btn-yellow" onClick={click(togglePause)}>
              RESUME ▶
            </button>
            <button className="retro-btn" onClick={click(restartStage)}>
              RESTART ↺
            </button>
            {onReturnToMenu && (
              <button className="retro-btn" onClick={click(onReturnToMenu)}>
                MAIN MENU
              </button>
            )}
          </div>
          <p className="hud-hint">ESC / P = PAUSE • R = RESTART</p>
        </div>
      )}

      {status === 'gameover' && (
        <div className="hud-overlay">
          <h2 className="hud-title" style={{ color: '#e60012' }}>GAME OVER</h2>
          <p className="hud-text">FINAL SCORE: {hud.score}</p>
          <div className="hud-actions">
            <button className="retro-btn retro-btn-yellow" onClick={click(restartStage)}>
              RETRY STAGE
            </button>
            {onReturnToMenu && (
              <button className="retro-btn" onClick={click(onReturnToMenu)}>
                MAIN MENU
              </button>
            )}
          </div>
        </div>
      )}

      {status === 'complete' && (
        <div className="hud-overlay">
          <div className={`hud-clear-card ${hud.stage === '4-4' ? 'hud-clear-card-final' : ''}`}>
            {hud.stage === '4-4' ? (
              <>
                <h2 className="hud-title" style={{ color: '#ffd000' }}>👑 GRAND CHAMPION! 👑</h2>
                <div style={{ color: '#00ffcc' }}>★ ALL 16 LEVELS CLEARED! ★</div>
                <div className="hud-quote">
                  "THANK YOU {currentHeroName}!
                  <br />
                  YOUR QUEST IS OVER!
                  <br />
                  <span style={{ color: '#ff69b4' }}>PRINCESS PEACH IS RESCUED!</span>"
                </div>
                <div className="hud-text" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <span>SCORE: {hud.score}</span>
                  <span>COINS: ×{hud.coins}</span>
                </div>
                <div className="hud-actions">
                  <button
                    className="retro-btn retro-btn-yellow"
                    onClick={click(() => {
                      changeStatus('playing');
                      onNextStage?.(nextStageId);
                    })}
                  >
                    PLAY AGAIN 👑
                  </button>
                  {onReturnToMenu && (
                    <button className="retro-btn" onClick={click(onReturnToMenu)}>
                      MAIN MENU
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="hud-title" style={{ color: '#ffd000' }}>★ STAGE {hud.stage} CLEARED! ★</h2>
                <p className="hud-text">SCORE: {hud.score}</p>
                <div className="hud-actions">
                  {onNextStage && (
                    <button
                      className="retro-btn retro-btn-yellow"
                      onClick={click(() => {
                        changeStatus('playing');
                        onNextStage(nextStageId);
                      })}
                    >
                      NEXT STAGE ({nextStageId}) ▶
                    </button>
                  )}
                  <button className="retro-btn" onClick={click(restartStage)}>
                    RETRY ↺
                  </button>
                  {onReturnToMenu && (
                    <button className="retro-btn" onClick={click(onReturnToMenu)}>
                      MAIN MENU
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
