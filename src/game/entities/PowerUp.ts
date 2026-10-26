import Phaser from 'phaser';

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  public collected = false;
  private direction = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'gem');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1.5);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setVelocity(this.direction * 70, -220);
  }

  update() {
    if (!this.active) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.right) this.direction = -1;
    if (body.blocked.left) this.direction = 1;
    body.velocity.x = this.direction * 70;
  }
}
