import { useEffect, useRef } from 'react';
import { createGame } from '../game/main';
import Phaser from 'phaser';

interface Props {
  heroId?: string;
  stageId?: string;
}

export default function GameCanvas({ heroId = 'riko', stageId = '1-1' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanly destroy previous Phaser game instance when heroId or stageId changes
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    gameRef.current = createGame(containerRef.current, heroId, stageId);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [heroId, stageId]);

  return <div ref={containerRef} className="game-canvas-host" />;
}
