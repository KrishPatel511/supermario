import Phaser from 'phaser';

export type EnemyType = 'sprout' | 'bramble' | 'puffwing' | 'emberjaw' | 'spiker';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public enemyType: EnemyType;
  public points = 100;
  public isDead = false;
  public isShellDormant = false;
  public isShellSliding = false;
  public isStompable = true;
  // Scene timestamp (ms) until which contact with this enemy is ignored.
  public graceUntil = 0;

  public speed = 55;
  private leftBound: number;
  private rightBound: number;
  private startY: number;
  private sineTimer = 0;
  private shellDormantTimer = 0;
  private isCharging = false;

  constructor(scene: Phaser.Scene, x: number, y: number, enemyType: EnemyType = 'sprout', patrolRange = 120) {
    const textureKey = Enemy.getTextureKey(enemyType);
    super(scene, x, y, textureKey);

    this.enemyType = enemyType;
    this.startY = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.5);
    this.leftBound = x - patrolRange;
    this.rightBound = x + patrolRange;

    // Apply mechanics & properties based on enemy type
    switch (enemyType) {
      case 'sprout':
        this.points = 100;
        this.speed = 55;
        this.setSize(14, 12).setOffset(1, 4);
        this.setVelocityX(-this.speed);
        break;

      case 'bramble':
        this.points = 200;
        this.speed = 52;
        this.setSize(14, 14).setOffset(1, 2);
        this.setVelocityX(-this.speed);
        break;

      case 'puffwing':
        this.points = 150;
        this.speed = 60;
        this.setSize(14, 14).setOffset(1, 1);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.setVelocityX(-this.speed);
        break;

      case 'emberjaw':
        this.points = 250;
        this.isStompable = false;
        this.setSize(14, 16).setOffset(1, 0);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        break;

      case 'spiker':
        this.points = 300;
        this.speed = 45;
        this.isStompable = false;
        this.setSize(14, 14).setOffset(1, 2);
        this.setVelocityX(-this.speed);
        break;
    }
  }

  private static getTextureKey(type: EnemyType): string {
    switch (type) {
      case 'sprout':
        return 'enemy_sprout';
      case 'bramble':
        return 'enemy_bramble';
      case 'puffwing':
        return 'enemy_puffwing';
      case 'emberjaw':
        return 'enemy_emberjaw';
      case 'spiker':
        return 'enemy_spiker';
      default:
        return 'enemy_sprout';
    }
  }

  update(delta = 16, playerX?: number) {
    if (this.isDead) return;

    // Walkers turn around when they bump into a pipe, block or wall.
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.enemyType !== 'puffwing' && this.enemyType !== 'emberjaw' && !this.isShellDormant) {
      if (body.blocked.left || body.blocked.right) {
        if (this.isShellSliding) {
          this.setVelocityX(body.blocked.left ? 400 : -400);
        } else {
          const dir = body.blocked.left ? 1 : -1;
          this.setVelocityX(dir * this.speed);
          this.setFlipX(dir > 0);
          this.isCharging = false;
        }
      }
    }

    // 1. Sprout Walker
    if (this.enemyType === 'sprout') {
      if (this.x <= this.leftBound) {
        this.setVelocityX(this.speed);
        this.setFlipX(true);
      } else if (this.x >= this.rightBound) {
        this.setVelocityX(-this.speed);
        this.setFlipX(false);
      }
    }

    // 2. Bramble Shell
    else if (this.enemyType === 'bramble') {
      if (this.isShellDormant) {
        this.shellDormantTimer += delta;
        if (this.shellDormantTimer > 5200) {
          // Wake up from shell
          this.isShellDormant = false;
          this.isStompable = true;
          this.setVelocityX(-this.speed);
        }
      } else if (!this.isShellSliding) {
        if (this.x <= this.leftBound) {
          this.setVelocityX(this.speed);
          this.setFlipX(true);
        } else if (this.x >= this.rightBound) {
          this.setVelocityX(-this.speed);
          this.setFlipX(false);
        }
      }
    }

    // 3. Puffwing (Sine wave floating)
    else if (this.enemyType === 'puffwing') {
      this.sineTimer += delta * 0.003;
      this.y = this.startY + Math.sin(this.sineTimer) * 40;

      if (this.x <= this.leftBound) {
        this.setVelocityX(this.speed);
        this.setFlipX(true);
      } else if (this.x >= this.rightBound) {
        this.setVelocityX(-this.speed);
        this.setFlipX(false);
      }
    }

    // 4. Emberjaw Bloom (Pipe pop-up cycle)
    else if (this.enemyType === 'emberjaw') {
      this.sineTimer += delta * 0.002;
      const cycle = Math.sin(this.sineTimer);
      if (cycle > 0) {
        this.y = this.startY - cycle * 30;
      } else {
        this.y = this.startY;
      }
    }

    // 5. Cinder Spiker (Charge on spot)
    else if (this.enemyType === 'spiker') {
      if (this.isCharging && playerX !== undefined && Math.abs(playerX - this.x) > 400) {
        this.isCharging = false;
      }
      if (playerX !== undefined && Math.abs(playerX - this.x) < 220 && !this.isCharging) {
        this.isCharging = true;
        const dir = playerX > this.x ? 1 : -1;
        this.setVelocityX(dir * 120);
        this.setFlipX(dir > 0);
      } else if (!this.isCharging) {
        if (this.x <= this.leftBound) {
          this.setVelocityX(this.speed);
          this.setFlipX(true);
        } else if (this.x >= this.rightBound) {
          this.setVelocityX(-this.speed);
          this.setFlipX(false);
        }
      }
    }
  }

  // Stomp interaction
  stomp(): boolean {
    if (this.isDead || !this.isStompable) return false;

    if (this.enemyType === 'bramble' && !this.isShellDormant && !this.isShellSliding) {
      // Turn into dormant shell
      this.isShellDormant = true;
      this.shellDormantTimer = 0;
      this.setVelocityX(0);
      return true;
    }

    if (this.enemyType === 'bramble' && this.isShellDormant) {
      // Kick the resting shell away at 400px/s
      this.isShellDormant = false;
      this.isShellSliding = true;
      this.setVelocityX(this.flipX ? -400 : 400);
      return true;
    }

    // Die instantly
    this.die();
    return true;
  }

  die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    this.setTint(0x888888);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.scene.time.delayedCall(300, () => this.destroy());
  }
}
