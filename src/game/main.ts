import Phaser from 'phaser';
import { PlayScene } from './scenes/PlayScene';

export function createGame(parent: HTMLElement, heroId = 'riko', stageId = '1-1') {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent,
    input: { touch: true },
    render: { pixelArt: true },
    backgroundColor: '#1d1d2b',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 900 },
        debug: false,
      },
    },
  };

  const game = new Phaser.Game(config);
  game.events.once('ready', () => {
    game.scene.add('PlayScene', PlayScene, true, { heroId, stageId });
  });

  return game;
}
