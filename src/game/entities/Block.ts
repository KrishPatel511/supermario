import Phaser from 'phaser';

export type BlockType = 'coin' | 'powerup' | 'brick';

export class Block extends Phaser.Physics.Arcade.Sprite {
  public blockType: BlockType;
  public isUsed = false;

  constructor(scene: Phaser.Scene, x: number, y: number, blockType: BlockType) {
    const texture = blockType === 'brick' ? 'brick_block' : 'quest_block';
    super(scene, x, y, texture);
    this.blockType = blockType;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setScale(1.4);
    (this.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
  }

  markUsed() {
    if (this.isUsed) return;
    this.isUsed = true;
    this.setTexture('used_block');
  }

  bumpAnim() {
    this.scene.tweens.add({
      targets: this,
      scaleY: this.scaleY * 0.75,
      duration: 60,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  }
}
