import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { Enemy } from '../entities/Enemy';
import { Block } from '../entities/Block';
import type { BlockType } from '../entities/Block';
import { PowerUp } from '../entities/PowerUp';
import { Sfx } from '../audio/Sfx';
import { HEROES_ROSTER } from '../data/heroes';
import { GameSettings } from '../GameSettings';
import { TouchInput } from '../input/TouchInput';

export class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKeys!: { space: Phaser.Input.Keyboard.Key; w: Phaser.Input.Keyboard.Key };
  private specialKey!: Phaser.Input.Keyboard.Key;
  private altKeys!: { a: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key; shift: Phaser.Input.Keyboard.Key };
  private prevTouchJump = false;
  private prevTouchSpecial = false;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private blocksGroup!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.Group;
  private enemies: Enemy[] = [];
  private powerUps: PowerUp[] = [];
  private goal!: Phaser.Physics.Arcade.Sprite;

  private score = 0;
  private lives = 3;
  private coinsCollected = 0;
  private timeRemaining = 300;
  private timerEvent?: Phaser.Time.TimerEvent;
  private stageLabel = '1-1';
  private levelComplete = false;
  private selectedHeroId = 'riko';
  private specialCooldownMs = 0;
  private isDashing = false;
  private activeShield = false;

  // Bowser Boss Fight state
  private bowserBoss?: Phaser.Physics.Arcade.Sprite;
  private bowserHp = 3;
  private bowserFireballTimer?: Phaser.Time.TimerEvent;
  private movingPlatforms: Phaser.Physics.Arcade.Sprite[] = [];

  // Hero color tints
  private static readonly HERO_TINTS: Record<string, number> = {
    riko: 0xffffff,
    miko: 0xffff33,
    volt: 0x33ffff,
    blade: 0x555555,
    aegis: 0xdddddd,
    shin: 0x9933ff,
    cinder: 0xff5500,
    frost: 0x99e6ff,
    aero: 0xccffff,
    titan: 0xb87333,
  };

  // Variable jump height state (hold jump = jump higher)
  private isHoldingJump = false;
  private jumpHoldTime = 0;
  private readonly maxJumpHoldMs = 220;

  // Brief invincibility + flashing after taking a hit
  private isInvincible = false;

  // Growth power-up state
  private isBig = false;
  private readonly smallScale = 1.3;
  private readonly bigScale = 1.7;

  constructor() {
    super('PlayScene');
  }

  init(data?: { heroId?: string; stageId?: string }) {
    if (data && data.heroId) {
      this.selectedHeroId = data.heroId;
    }
    if (data && data.stageId) {
      this.stageLabel = data.stageId;
    }
  }

  preload() {
    const a = 'assets';

    // Terrain / items (Kenney "Platformer Art: Pixel", CC0)
    this.load.image('ground', `${a}/ground.png`);
    this.load.image('coin', `${a}/coin.png`);
    this.load.image('gem', `${a}/gem.png`);
    this.load.image('flag', `${a}/flag.png`);
    this.load.image('spike', `${a}/spike.png`);

    // Enemies (5 Bestiary Types)
    this.load.image('enemy_sprout', `${a}/enemies/sprout.png`);
    this.load.image('enemy_bramble', `${a}/enemies/bramble.png`);
    this.load.image('enemy_puffwing', `${a}/enemies/puffwing.png`);
    this.load.image('enemy_emberjaw', `${a}/enemies/emberjaw.png`);
    this.load.image('enemy_spiker', `${a}/enemies/spiker.png`);
    this.load.image('enemy_idle', `${a}/enemy_idle.png`);
    this.load.image('enemy_walk', `${a}/enemy_walk.png`);
    this.load.image('enemy_dead', `${a}/enemy_dead.png`);

    // Hero animation sheets
    this.load.spritesheet('hero_idle', `${a}/hero/idle.png`, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('hero_walk', `${a}/hero/walk.png`, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('hero_jump', `${a}/hero/jump.png`, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('hero_fall', `${a}/hero/fall.png`, { frameWidth: 128, frameHeight: 128 });

    this.load.audio('coin_sfx', `${a}/sfx/coin.mp3`);
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.coinsCollected = 0;
    this.timeRemaining = 300;
    this.levelComplete = false;
    this.isInvincible = false;
    this.isBig = false;
    this.isDashing = false;
    this.activeShield = false;
    this.specialCooldownMs = 0;
    this.isHoldingJump = false;
    this.prevTouchJump = false;
    this.prevTouchSpecial = false;
    this.bowserBoss = undefined;
    this.powerUps = [];
    this.movingPlatforms = [];

    const worldNum = this.stageLabel.split('-')[0] || '1';
    let bgColor = '#0f172a'; // Deep subterranean blue gradient (matching reference image)
    let groundKey = 'brick_ground';
    let topKey = 'ground';

    if (worldNum === '2') {
      bgColor = '#3d2716'; // Desert subterranean sandstone
      groundKey = 'sand_ground';
      topKey = 'sand_ground';
    } else if (worldNum === '3') {
      bgColor = '#1e3a4c'; // Ice mountain cavern
      groundKey = 'ice_ground';
      topKey = 'ice_ground';
    } else if (worldNum === '4') {
      bgColor = '#2b0d0d'; // Volcanic keep
      groundKey = 'castle_ground';
      topKey = 'castle_ground';
    }

    this.cameras.main.setBackgroundColor(bgColor);

    this.createAnimations();
    this.createBlockTextures();
    this.createPipeTextures();
    this.createCustomTilesets();
    this.addBackgroundDecor(worldNum);

    // Expand Physics & Camera bounds to 3800px wide
    this.physics.world.setBounds(0, 0, 3800, 900);
    // Enable Left, Right, Top collisions, but DISABLE bottom collision so player falls into pit gaps
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.platforms = this.physics.add.staticGroup();
    this.blocksGroup = this.physics.add.staticGroup();
    this.hazards = this.physics.add.staticGroup();

    // 1. Create player sprite FIRST
    this.player = this.physics.add.sprite(100, 520, 'hero_idle');
    this.player.setScale(this.smallScale);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(34, 39).setOffset(40, 42);
    this.player.play('hero-idle');
    this.player.setDepth(5);

    const heroTint = PlayScene.HERO_TINTS[this.selectedHeroId] || 0xffffff;
    if (heroTint !== 0xffffff) {
      this.player.setTint(heroTint);
    }

    // 2. Build NES-Style Ground Segments resting at the VERY BOTTOM of screen (top y=624, bottom y=720)
    const groundY = 672;
    const groundH = 96;
    const topY = 624; // Top surface of the ground floor

    this.makeGroundSegment(450, groundY, 900, groundH, groundKey, topKey); // x: 0 to 900
    this.makeGroundSegment(1410, groundY, 820, groundH, groundKey, topKey); // x: 1000 to 1820
    this.makeGroundSegment(2380, groundY, 860, groundH, groundKey, topKey); // x: 1950 to 2810
    this.makeGroundSegment(3370, groundY, 860, groundH, groundKey, topKey); // x: 2940 to 3800

    // Elevated Platforms & Bridges (with ample jumping room above!)
    this.makePlatform(600, 460, 5, groundKey, topKey);
    this.makePlatform(960, 480, 4, groundKey, topKey); // Bridge over Gap 1
    this.makePlatform(1250, 460, 5, groundKey, topKey);
    this.makePlatform(1885, 480, 4, groundKey, topKey); // Bridge over Gap 2
    this.makePlatform(2250, 460, 5, groundKey, topKey);
    this.makePlatform(2875, 480, 4, groundKey, topKey); // Bridge over Gap 3

    // Moving platform over Gap 2 (x=1885)
    const movingPlat = this.physics.add.sprite(1885, 530, groundKey).setImmovable(true).setDepth(4);
    (movingPlat.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.tweens.add({
      targets: movingPlat,
      x: 1940,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.physics.add.collider(this.player, movingPlat);
    this.movingPlatforms.push(movingPlat);

    // Mario Warp Pipes resting on ground top (y=624) with stepping blocks!
    this.makeBlock(448, topY - 32, 'brick'); // Step block before pipe
    this.makePipe(480, topY, 96);

    this.makeBlock(1168, topY - 64, 'brick'); // Step block before pipe
    this.makePipe(1200, topY, 128);

    this.makeBlock(2168, topY - 32, 'brick'); // Step block before pipe
    this.makePipe(2200, topY, 96);

    this.makeBlock(3018, topY - 32, 'brick'); // Step block before pipe
    this.makePipe(3050, topY, 96);

    // Brick Pyramids (# Staircases) resting on ground
    for (let step = 0; step < 4; step++) {
      for (let y = 0; y <= step; y++) {
        this.makeBlock(1450 + step * 32, topY - 16 - y * 32, 'brick');
      }
    }
    for (let step = 0; step < 4; step++) {
      for (let y = 0; y <= step; y++) {
        this.makeBlock(2500 + step * 32, topY - 16 - y * 32, 'brick');
      }
    }

    // Classic hittable block rows (`?` - Brick - `?`)
    this.makeBlock(280, 480, 'powerup');
    this.makeBlock(312, 480, 'brick');
    this.makeBlock(344, 480, 'coin');
    this.makeBlock(376, 480, 'brick');

    this.makeBlock(600, 340, 'coin');
    this.makeBlock(632, 340, 'powerup');
    this.makeBlock(664, 340, 'coin');

    this.makeBlock(1100, 360, 'coin');
    this.makeBlock(1132, 360, 'brick');
    this.makeBlock(1164, 360, 'coin');

    this.makeBlock(2000, 360, 'powerup');
    this.makeBlock(2032, 360, 'brick');
    this.makeBlock(2064, 360, 'coin');

    this.makeBlock(2800, 340, 'coin');
    this.makeBlock(2832, 340, 'coin');

    // Hazards (Spikes & Lava)
    this.makeSpike(550, topY - 10);
    this.makeSpike(1380, topY - 10);
    this.makeSpike(2350, topY - 10);

    if (worldNum === '4') {
      const lava = this.add.rectangle(1900, 680, 3800, 40, 0xff2200).setDepth(2);
      this.physics.add.existing(lava, true);
      this.physics.add.overlap(this.player, lava, () => this.hitHazard(), undefined, this);
    }

    // 3. Attach main colliders after player and terrain exist
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.blocksGroup, (playerObj, blockObj) => {
      const body = (playerObj as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
      if (body.touching.up) {
        this.bumpBlock(blockObj as Block);
      }
    }, undefined, this);
    this.physics.add.overlap(this.player, this.hazards, () => this.hitHazard(), undefined, this);

    this.coins = this.physics.add.group({ allowGravity: false });
    const coinPositions: [number, number][] = [
      [312, 440], [344, 440], [632, 300],
      [930, 440], [950, 410], [970, 440],
      [1440, 530], [1465, 500], [1490, 530],
      [2220, 440], [2250, 410], [2280, 440],
      [2900, 440], [2930, 410], [2960, 440],
    ];
    coinPositions.forEach(([x, y]) => {
      const coin = this.coins.create(x, y, 'coin') as Phaser.Physics.Arcade.Sprite;
      coin.setScale(1.4);
      coin.setSize(14, 14);
    });
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this);

    const [worldStr, levelStr] = this.stageLabel.split('-');
    const wNum = parseInt(worldStr, 10) || 1;
    const lNum = parseInt(levelStr, 10) || 1;

    // Procedurally spawn enemies matching the stage difficulty & world theme
    this.enemies = this.buildStageEnemies(wNum, lNum, topY);
    this.enemies.forEach((enemy) => {
      if (enemy.enemyType !== 'puffwing' && enemy.enemyType !== 'emberjaw') {
        this.physics.add.collider(enemy, this.platforms);
        this.physics.add.collider(enemy, this.blocksGroup);
      }
      this.physics.add.overlap(this.player, enemy, () => this.handleEnemyContact(enemy), undefined, this);
    });

    // World 4-4 Bowser Boss Arena
    if (this.stageLabel === '4-4') {
      this.bowserHp = 3;
      this.bowserBoss = this.physics.add.sprite(3450, topY - 40, 'enemy_emberjaw').setScale(3);
      this.bowserBoss.setTint(0xff0000);
      this.physics.add.collider(this.bowserBoss, this.platforms);

      this.tweens.add({
        targets: this.bowserBoss,
        x: 3250,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.bowserFireballTimer = this.time.addEvent({
        delay: 2400,
        loop: true,
        callback: () => {
          if (!this.bowserBoss || !this.bowserBoss.active) return;
          const fireball = this.add.circle(this.bowserBoss.x - 30, this.bowserBoss.y, 14, 0xff5500).setDepth(6);
          this.physics.add.existing(fireball);
          const body = fireball.body as Phaser.Physics.Arcade.Body;
          body.setAllowGravity(false);
          body.setVelocityX(-260);

          this.physics.add.overlap(this.player, fireball, () => {
            fireball.destroy();
            this.takeDamage(fireball.x);
          });
        },
      });

      this.physics.add.overlap(this.player, this.bowserBoss, () => {
        if (!this.bowserBoss || !this.bowserBoss.active) return;
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        if (playerBody.velocity.y > 0 && this.player.y < this.bowserBoss.y - 30) {
          this.damageBowser();
          this.player.setVelocityY(-350);
        } else {
          this.takeDamage(this.bowserBoss.x);
        }
      });
    }

    // Flagpole & Base Stand firmly attached to ground top (y=624)
    const poleX = 3500;
    const poleHeight = 180;
    const poleTopY = topY - poleHeight; // y = 444

    const poleG = this.add.graphics();
    // 1. Base Block resting firmly on ground
    poleG.fillStyle(0x737373, 1);
    poleG.fillRect(poleX - 16, topY - 16, 32, 16);
    poleG.fillStyle(0xa3a3a3, 1);
    poleG.fillRect(poleX - 14, topY - 14, 28, 4);

    // 2. Brass/Metallic Pole Shaft from base up to poleTopY
    poleG.fillStyle(0x48e048, 1);
    poleG.fillRect(poleX - 4, poleTopY, 8, poleHeight - 16);
    poleG.fillStyle(0x80ff80, 1);
    poleG.fillRect(poleX - 2, poleTopY, 3, poleHeight - 16);

    // 3. Shining Gold Ball Finial at very top tip
    poleG.fillStyle(0xffd000, 1);
    poleG.fillCircle(poleX, poleTopY, 8);
    poleG.fillStyle(0xffffff, 1);
    poleG.fillCircle(poleX - 2, poleTopY - 2, 3);
    poleG.setDepth(3);

    // 4. Waving Mario Victory Flag attached near top tip
    this.goal = this.physics.add.sprite(poleX + 18, poleTopY + 22, 'flag').setDepth(4);
    this.goal.setScale(2.2);
    (this.goal.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Trigger zone covering entire height of flagpole from ground to tip
    const triggerZone = this.add.rectangle(poleX, topY - poleHeight / 2, 40, poleHeight);
    this.physics.add.existing(triggerZone, true);
    this.physics.add.overlap(this.player, triggerZone, this.completeLevel, undefined, this);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.jumpKeys = this.input.keyboard!.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      w: Phaser.Input.Keyboard.KeyCodes.W,
    }) as { space: Phaser.Input.Keyboard.Key; w: Phaser.Input.Keyboard.Key };
    this.specialKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.altKeys = this.input.keyboard!.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    }) as { a: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key; shift: Phaser.Input.Keyboard.Key };

    const heroData = HEROES_ROSTER.find((h) => h.id === this.selectedHeroId) || HEROES_ROSTER[0];
    const banner = this.add.text(this.player.x, this.player.y - 65, `HERO: ${heroData.name}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '11px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(10);

    this.tweens.add({
      targets: banner,
      y: this.player.y - 110,
      alpha: 0,
      duration: 2200,
      ease: 'Cubic.easeOut',
      onComplete: () => banner.destroy(),
    });

    // Camera height matches the 720px view so the ground sits at the bottom of the screen.
    this.cameras.main.setBounds(0, 0, 3800, 720);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.levelComplete) return;
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        this.emitHud();
        if (this.timeRemaining === 0) {
          Sfx.hurt();
          if (this.loseLife()) this.respawnPlayer();
        }
      },
    });

    Sfx.startMusic();

    const onSetPaused = (paused: boolean) => {
      if (this.levelComplete) return;
      if (paused) this.scene.pause();
      else this.scene.resume();
    };
    const onRestart = () => this.scene.restart();
    EventBus.on('set-paused', onSetPaused);
    EventBus.on('restart-stage', onRestart);

    this.events.once('shutdown', () => {
      EventBus.off('set-paused', onSetPaused);
      EventBus.off('restart-stage', onRestart);
      Sfx.stopMusic();
      this.timerEvent?.remove();
      TouchInput.reset();
    });

    EventBus.emit('current-scene-ready', this);
    this.emitHud();
  }

  private createAnimations() {
    if (this.anims.exists('hero-idle')) return;

    this.anims.create({
      key: 'hero-idle',
      frames: this.anims.generateFrameNumbers('hero_idle', { start: 0, end: 9 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-walk',
      frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 9 }),
      frameRate: 14,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-jump',
      frames: this.anims.generateFrameNumbers('hero_jump', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-fall',
      frames: this.anims.generateFrameNumbers('hero_fall', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  // Procedurally renders authentic 1:1 NES Super Mario Bros 1985 8-bit vector tiles
  private createBlockTextures() {
    const size = 32;

    // NES Question (?) Block — matching vector sheet (Screenshot 2)
    this.makeCanvasTexture('quest_block', size, (ctx) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#fc9838'; // NES Golden Yellow
      ctx.fillRect(2, 2, size - 4, size - 4);
      ctx.fillStyle = '#f8d878'; // Highlight
      ctx.fillRect(2, 2, size - 4, 3);
      ctx.fillRect(2, 2, 3, size - 4);

      // 4 Corner Rivets
      ctx.fillStyle = '#000000';
      ctx.fillRect(4, 4, 3, 3);
      ctx.fillRect(size - 7, 4, 3, 3);
      ctx.fillRect(4, size - 7, 3, 3);
      ctx.fillRect(size - 7, size - 7, 3, 3);

      // 8-Bit NES ? Glyph
      ctx.font = '900 19px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.fillText('?', size / 2 + 1, size / 2 + 2);
      ctx.fillStyle = '#f8d878';
      ctx.fillText('?', size / 2, size / 2);
    });

    // NES Used Block
    this.makeCanvasTexture('used_block', size, (ctx) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#8c5214'; // NES Brown
      ctx.fillRect(2, 2, size - 4, size - 4);
      ctx.fillStyle = '#000000';
      ctx.fillRect(4, 4, 3, 3);
      ctx.fillRect(size - 7, 4, 3, 3);
      ctx.fillRect(4, size - 7, 3, 3);
      ctx.fillRect(size - 7, size - 7, 3, 3);
    });

    // NES Solid Brick Block — 2-row staggered brick pattern (Screenshot 2)
    this.makeCanvasTexture('brick_block', size, (ctx) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#c84c0c'; // NES Brick Red-Orange
      ctx.fillRect(2, 2, size - 4, size - 4);

      ctx.fillStyle = '#000000';
      // Horizontal mortar line
      ctx.fillRect(2, 15, size - 4, 2);
      // Top row vertical grout lines
      ctx.fillRect(10, 2, 2, 13);
      ctx.fillRect(24, 2, 2, 13);
      // Bottom row staggered vertical grout lines
      ctx.fillRect(4, 17, 2, 13);
      ctx.fillRect(17, 17, 2, 13);
      ctx.fillRect(29, 17, 2, 13);
    });
  }

  private makeCanvasTexture(key: string, size: number, draw: (ctx: CanvasRenderingContext2D) => void) {
    if (this.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    draw(ctx);
    this.textures.addCanvas(key, canvas);
  }

  // Classic NES-style background: rolling hills, bushes and clouds drawn
  // as simple pixel-puff silhouettes, parallaxed behind the stage.
  private addBackgroundDecor(worldNum = '1') {
    let hillColor = 0x2e8b57; // Classic Mario Sea Green Hills
    let cloudColor = 0xffffff;

    if (worldNum === '2') {
      hillColor = 0xc27a2b; // Sand dunes
      cloudColor = 0xfff0e0;
    } else if (worldNum === '3') {
      hillColor = 0x5b9bd5; // Snowy peaks
      cloudColor = 0xf0f8ff;
    } else if (worldNum === '4') {
      hillColor = 0x4a1525; // Dark lava keep
      cloudColor = 0x662233;
    }

    const topY = 624;

    // 1. Pixel-Art Parallax Hills resting on ground top
    const hillPositions: [number, number, number][] = [
      [300, topY, 120],
      [950, topY, 140],
      [1600, topY, 130],
      [2250, topY, 150],
      [2900, topY, 130],
      [3400, topY, 140],
    ];
    hillPositions.forEach(([x, y, radius]) => {
      const g = this.add.graphics();
      g.fillStyle(hillColor, 0.9);
      g.fillTriangle(x - radius, y, x, y - radius * 0.8, x + radius, y);
      g.fillStyle(0x000000, 0.2);
      g.fillTriangle(x, y - radius * 0.8, x + radius, y, x, y);
      g.setScrollFactor(0.3);
      g.setDepth(-10);
    });

    // 2. NES Pixel-Art Clouds
    const cloudPositions: [number, number][] = [
      [220, 160], [680, 140], [1150, 170], [1650, 150],
      [2150, 160], [2680, 130], [3150, 170], [3600, 150],
    ];
    cloudPositions.forEach(([cx, cy]) => {
      const cg = this.add.graphics();
      cg.fillStyle(cloudColor, 0.95);
      cg.fillRect(cx - 30, cy, 60, 20);
      cg.fillRect(cx - 20, cy - 12, 40, 32);
      cg.fillRect(cx - 10, cy - 20, 20, 40);
      cg.setScrollFactor(0.4);
      cg.setDepth(-11);
    });

    // 3. Pixel-Art Victory Castle resting on ground top (topY = 624)
    const castleG = this.add.graphics();
    // Main Castle Wall
    castleG.fillStyle(0x8b4513, 1); // Dark Brick
    castleG.fillRect(3530, topY - 120, 100, 120);
    // Doorway
    castleG.fillStyle(0x000000, 1);
    castleG.fillRect(3565, topY - 60, 30, 60);
    // Castle Battlements
    castleG.fillStyle(0x5c2e0b, 1);
    [3530, 3555, 3580, 3605].forEach((bx) => castleG.fillRect(bx, topY - 140, 18, 20));
    // Castle Flag
    castleG.fillStyle(0xff0000, 1);
    castleG.fillTriangle(3580, topY - 160, 3580, topY - 140, 3605, topY - 150);
    castleG.setDepth(2);
  }

  update(_time: number, delta: number) {
    if (this.levelComplete) return;

    if (this.specialCooldownMs > 0) {
      this.specialCooldownMs = Math.max(0, this.specialCooldownMs - delta);
    }

    const touchSpecialJustPressed = TouchInput.special && !this.prevTouchSpecial;
    this.prevTouchSpecial = TouchInput.special;
    if ((this.specialKey && Phaser.Input.Keyboard.JustDown(this.specialKey)) || touchSpecialJustPressed) {
      this.useSpecialAbility();
    }

    const heroData = HEROES_ROSTER.find((h) => h.id === this.selectedHeroId) || HEROES_ROSTER[0];
    const speedStat = heroData.stats.speed;
    const jumpStat = heroData.stats.jump;

    const running = this.altKeys.shift.isDown;
    const maxSpeed = (150 + speedStat * 15) * (running ? 1.25 : 1);
    const acceleration = 900;
    const deceleration = 1200;
    const initialJumpVelocity = -(390 + jumpStat * 15);
    const extraLiftPerMs = 1.1;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const dt = delta / 1000;

    let moving = false;
    if (!this.isDashing) {
      const goLeft = this.cursors.left.isDown || this.altKeys.a.isDown || TouchInput.left;
      const goRight = this.cursors.right.isDown || this.altKeys.d.isDown || TouchInput.right;
      if (goLeft && !goRight) {
        body.velocity.x = Math.max(body.velocity.x - acceleration * dt, -maxSpeed);
        this.player.setFlipX(true);
        moving = true;
      } else if (goRight && !goLeft) {
        body.velocity.x = Math.min(body.velocity.x + acceleration * dt, maxSpeed);
        this.player.setFlipX(false);
        moving = true;
      } else if (body.velocity.x > 0) {
        body.velocity.x = Math.max(body.velocity.x - deceleration * dt, 0);
      } else if (body.velocity.x < 0) {
        body.velocity.x = Math.min(body.velocity.x + deceleration * dt, 0);
      }
    }

    const jumpPressed = this.cursors.up.isDown || this.jumpKeys.space.isDown || this.jumpKeys.w.isDown || TouchInput.jump;
    const touchJumpJustPressed = TouchInput.jump && !this.prevTouchJump;
    const touchJumpJustReleased = !TouchInput.jump && this.prevTouchJump;
    this.prevTouchJump = TouchInput.jump;
    const jumpJustPressed =
      touchJumpJustPressed ||
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.jumpKeys.space) ||
      Phaser.Input.Keyboard.JustDown(this.jumpKeys.w);
    const jumpJustReleased =
      (touchJumpJustReleased ||
        Phaser.Input.Keyboard.JustUp(this.cursors.up) ||
        Phaser.Input.Keyboard.JustUp(this.jumpKeys.space) ||
        Phaser.Input.Keyboard.JustUp(this.jumpKeys.w)) &&
      !jumpPressed;

    const onGround = body.blocked.down;

    if (jumpJustPressed && onGround) {
      this.player.setVelocityY(initialJumpVelocity);
      this.isHoldingJump = true;
      this.jumpHoldTime = 0;
      Sfx.jump();
    }

    if (this.isHoldingJump) {
      if (jumpPressed && this.jumpHoldTime < this.maxJumpHoldMs && body.velocity.y < 0) {
        this.jumpHoldTime += delta;
        this.player.setVelocityY(body.velocity.y - extraLiftPerMs * delta);
      } else {
        this.isHoldingJump = false;
      }
    }

    if (jumpJustReleased && body.velocity.y < -100) {
      this.player.setVelocityY(body.velocity.y * 0.5);
      this.isHoldingJump = false;
    }

    if (!onGround) {
      this.player.anims.play(body.velocity.y < 0 ? 'hero-jump' : 'hero-fall', true);
    } else if (moving) {
      this.player.anims.play('hero-walk', true);
    } else {
      this.player.anims.play('hero-idle', true);
    }

    this.enemies.forEach((e) => e.update(delta, this.player.x));

    this.powerUps = this.powerUps.filter((p) => p.active);
    this.powerUps.forEach((p) => p.update());

    if (this.player.y > 660) {
      this.respawnAtStart();
    }
  }

  private useSpecialAbility() {
    if (this.specialCooldownMs > 0 || this.levelComplete) return;
    this.specialCooldownMs = 3000;

    const heroData = HEROES_ROSTER.find((h) => h.id === this.selectedHeroId) || HEROES_ROSTER[0];
    const facingRight = !this.player.flipX;

    const abilityText = this.add
      .text(this.player.x, this.player.y - 45, heroData.special.name, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '9px',
        color: '#ffcc00',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.tweens.add({
      targets: abilityText,
      y: this.player.y - 80,
      alpha: 0,
      duration: 900,
      onComplete: () => abilityText.destroy(),
    });

    switch (this.selectedHeroId) {
      case 'miko': {
        this.isDashing = true;
        this.isInvincible = true;
        this.player.setVelocityX(facingRight ? 580 : -580);
        Sfx.jump();
        this.time.delayedCall(300, () => {
          this.isDashing = false;
          this.isInvincible = false;
        });
        break;
      }
      case 'volt': {
        this.player.setVelocityY(-620);
        Sfx.jump();
        break;
      }
      case 'aero': {
        this.player.setVelocityY(-670);
        Sfx.jump();
        break;
      }
      case 'aegis': {
        this.activeShield = true;
        this.isInvincible = true;
        this.player.setTint(0xffd700);
        this.time.delayedCall(3500, () => {
          this.activeShield = false;
          this.isInvincible = false;
          const heroTint = PlayScene.HERO_TINTS[this.selectedHeroId] || 0xffffff;
          if (heroTint !== 0xffffff) this.player.setTint(heroTint);
          else this.player.clearTint();
        });
        Sfx.powerUp();
        break;
      }
      case 'titan': {
        if (GameSettings.getSettings().screenShake) this.cameras.main.shake(250, 0.015);
        this.enemies.forEach((enemy) => {
          if (!enemy.isDead) {
            enemy.die();
            this.score += 150;
          }
        });
        Sfx.breakBrick();
        this.emitHud();
        break;
      }
      case 'frost': {
        this.enemies.forEach((enemy) => {
          if (!enemy.isDead) {
            enemy.setTint(0x00ffff);
            const body = enemy.body as Phaser.Physics.Arcade.Body;
            if (body) body.setVelocityX(0);
            this.time.delayedCall(3000, () => {
              if (!enemy.isDead) {
                enemy.clearTint();
                if (body) body.setVelocityX(enemy.speed);
              }
            });
          }
        });
        Sfx.powerUp();
        break;
      }
      default: {
        const blastX = this.player.x + (facingRight ? 45 : -45);
        const blast = this.add.circle(blastX, this.player.y, 24, 0xff5500, 0.8).setDepth(6);
        this.tweens.add({
          targets: blast,
          scale: 2,
          alpha: 0,
          duration: 350,
          onComplete: () => blast.destroy(),
        });
        this.enemies.forEach((enemy) => {
          if (!enemy.isDead && Phaser.Math.Distance.Between(blastX, this.player.y, enemy.x, enemy.y) < 75) {
            enemy.die();
            this.score += 150;
            this.emitHud();
          }
        });
        Sfx.stomp();
        break;
      }
    }
  }

  private makeBlock(x: number, y: number, type: BlockType) {
    const block = new Block(this, x, y, type);
    this.blocksGroup.add(block);
    return block;
  }

  private bumpBlock(block: Block) {
    if (this.levelComplete) return;
    block.bumpAnim();
    Sfx.bump();

    if (block.blockType === 'brick') {
      if (this.isBig) {
        this.breakBrick(block);
      }
      return;
    }

    if (block.isUsed) return;
    block.markUsed();

    if (block.blockType === 'coin') {
      this.spawnCoinPopup(block.x, block.y);
    } else if (block.blockType === 'powerup') {
      this.spawnPowerUp(block.x, block.y);
    }
  }

  private spawnCoinPopup(x: number, y: number) {
    const popup = this.add.image(x, y - 20, 'coin').setScale(1.4).setDepth(6);
    this.score += 50;
    this.coinsCollected += 1;
    this.emitHud();

    this.tweens.add({
      targets: popup,
      y: y - 55,
      alpha: 0,
      duration: 450,
      ease: 'Cubic.easeOut',
      onComplete: () => popup.destroy(),
    });
  }

  private spawnPowerUp(x: number, y: number) {
    const gem = new PowerUp(this, x, y - 20);
    gem.setDepth(5);
    this.powerUps.push(gem);
    this.physics.add.collider(gem, this.platforms);
    this.physics.add.collider(gem, this.blocksGroup);
    this.physics.add.overlap(this.player, gem, () => this.collectPowerUp(gem), undefined, this);
  }

  private collectPowerUp(gem: PowerUp) {
    if (gem.collected) return;
    gem.collected = true;
    gem.destroy();
    this.growPlayer();
  }

  private breakBrick(block: Block) {
    Sfx.breakBrick();
    this.score += 20;
    this.emitHud();

    const { x, y } = block;
    for (let i = 0; i < 4; i++) {
      const debris = this.add.image(x, y, 'brick_block').setScale(0.6).setDepth(6);
      const dx = i % 2 === 0 ? -1 : 1;
      const dy = i < 2 ? -1 : 1;
      this.tweens.add({
        targets: debris,
        x: x + dx * 30,
        y: y + dy * 40 - 20,
        alpha: 0,
        angle: dx * 180,
        duration: 400,
        ease: 'Cubic.easeOut',
        onComplete: () => debris.destroy(),
      });
    }
    block.destroy();
  }

  private growPlayer() {
    if (this.isBig) {
      // Already big — a second gem is a bonus rather than a further growth tier.
      this.score += 50;
      this.emitHud();
      return;
    }
    this.isBig = true;
    Sfx.powerUp();
    this.player.setScale(this.bigScale);
    this.player.setSize(34, 51).setOffset(40, 30);
  }

  private shrinkPlayer() {
    if (!this.isBig) return;
    this.isBig = false;
    Sfx.shrink();
    this.player.setScale(this.smallScale);
    this.player.setSize(34, 39).setOffset(40, 42);
  }

  private handleEnemyContact(enemy: Enemy) {
    if (enemy.isDead || this.levelComplete || this.isInvincible) return;

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (this.time.now < enemy.graceUntil) return;

    const isStomp = playerBody.velocity.y > 0 && this.player.y < enemy.y - 10;

    if (isStomp && enemy.isStompable) {
      enemy.stomp();
      enemy.graceUntil = this.time.now + 400;
      this.player.setVelocityY(-250);
      this.score += enemy.points;
      Sfx.stomp();
      this.emitHud();
    } else if (enemy.isShellDormant) {
      // Touching a resting shell from the side kicks it away.
      enemy.stomp();
      enemy.graceUntil = this.time.now + 400;
      Sfx.stomp();
    } else {
      this.takeDamage(enemy.x);
    }
  }

  private hitHazard() {
    this.takeDamage(this.player.x);
  }

  private takeDamage(fromX: number) {
    if (this.isInvincible || this.activeShield || this.levelComplete) return;
    Sfx.hurt();
    this.applyKnockback(fromX);

    if (this.isBig) {
      this.shrinkPlayer();
    } else {
      this.loseLife();
    }
  }

  private applyKnockback(fromX: number) {
    const direction = this.player.x < fromX ? -1 : 1;
    this.player.setVelocity(direction * 200, -300);

    const heroData = HEROES_ROSTER.find((h) => h.id === this.selectedHeroId) || HEROES_ROSTER[0];
    const defenseStat = heroData.stats.defense;
    const invincibilityTime = 1000 + (defenseStat - 5) * 150;

    this.isInvincible = true;
    this.player.setTint(0xff6666);
    let flashes = 0;
    const flashTimer = this.time.addEvent({
      delay: 100,
      repeat: Math.floor(invincibilityTime / 100),
      callback: () => {
        flashes++;
        this.player.setVisible(flashes % 2 === 0);
      },
    });

    const heroTint = PlayScene.HERO_TINTS[this.selectedHeroId] || 0xffffff;
    this.time.delayedCall(invincibilityTime, () => {
      this.isInvincible = false;
      this.player.setVisible(true);
      if (heroTint !== 0xffffff) {
        this.player.setTint(heroTint);
      } else {
        this.player.clearTint();
      }
      flashTimer.remove();
    });
  }

  private collectCoin(_player: unknown, coinObj: unknown) {
    const coin = coinObj as Phaser.Physics.Arcade.Sprite;
    coin.destroy();
    this.score += 10;
    this.coinsCollected += 1;
    Sfx.coin();
    this.emitHud();
  }

  // Returns true when the player still has lives left.
  private loseLife(): boolean {
    if (this.levelComplete) return false;
    this.lives -= 1;
    this.timeRemaining = 300;
    this.emitHud();

    if (this.lives <= 0) {
      Sfx.gameOver();
      EventBus.emit('game-over', this.score);
      // Freeze the stage; the HUD offers Retry (restart-stage) or Menu.
      this.scene.pause();
      return false;
    }
    return true;
  }

  private respawnPlayer() {
    this.player.setPosition(100, 450);
    this.player.setVelocity(0, 0);
  }

  private respawnAtStart() {
    Sfx.pitFall();
    if (this.loseLife()) this.respawnPlayer();
  }

  private completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;

    // 1. Play authentic NES Stage Victory Fanfare
    Sfx.levelComplete();

    // 2. Lock player input and slide down flagpole
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 180);
    this.player.play('hero-idle');

    // 3. Walk right into the victory castle
    this.time.addEvent({
      delay: 750,
      callback: () => {
        body.setVelocity(120, 0);
        this.player.setFlipX(false);
        this.player.play('hero-walk');

        // Fireworks celebration text over castle
        const clearText = this.add
          .text(3560, 360, `STAGE ${this.stageLabel} CLEAR!`, {
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '14px',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 5,
          })
          .setOrigin(0.5)
          .setDepth(15);

        this.tweens.add({
          targets: clearText,
          y: 300,
          duration: 1500,
          ease: 'Cubic.easeOut',
        });
      },
    });

    // 4. Trigger Victory Banner event after castle entry
    this.time.delayedCall(2200, () => {
      body.setVelocity(0, 0);
      EventBus.emit('level-complete', this.score + this.timeRemaining * 10);
    });
  }

  private emitHud() {
    const heroData = HEROES_ROSTER.find((h) => h.id === this.selectedHeroId) || HEROES_ROSTER[0];
    EventBus.emit('hud-update', {
      score: this.score,
      lives: this.lives,
      coins: this.coinsCollected,
      time: this.timeRemaining,
      stage: this.stageLabel,
      heroName: heroData.name,
      specialCooldown: Math.ceil(this.specialCooldownMs / 1000),
    });
  }

  private damageBowser() {
    if (!this.bowserBoss || this.bowserHp <= 0) return;
    this.bowserHp--;
    Sfx.stomp();

    const bossText = this.add
      .text(this.bowserBoss.x, this.bowserBoss.y - 50, `BOWSER HP: ${this.bowserHp}/3`, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        color: '#ff2200',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.tweens.add({
      targets: bossText,
      y: this.bowserBoss.y - 85,
      alpha: 0,
      duration: 1000,
      onComplete: () => bossText.destroy(),
    });

    if (this.bowserHp <= 0) {
      Sfx.powerUp();
      this.score += 2000;
      this.emitHud();
      this.tweens.add({
        targets: this.bowserBoss,
        scale: 0,
        alpha: 0,
        angle: 360,
        duration: 800,
        onComplete: () => {
          this.bowserBoss?.destroy();
          this.bowserFireballTimer?.remove();
        },
      });
    }
  }

  private createPipeTextures() {
    [64, 96, 128, 160].forEach((height) => {
      const key = `pipe_${height}`;
      if (this.textures.exists(key)) return;
      const width = 56;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00a800';
      ctx.fillRect(2, 2, width - 4, 26);
      ctx.fillStyle = '#48e048';
      ctx.fillRect(6, 4, 8, 22);
      ctx.fillStyle = '#007000';
      ctx.fillRect(width - 12, 4, 6, 22);

      ctx.fillStyle = '#00a800';
      ctx.fillRect(6, 28, width - 12, height - 28);
      ctx.fillStyle = '#48e048';
      ctx.fillRect(10, 28, 6, height - 28);
      ctx.fillStyle = '#007000';
      ctx.fillRect(width - 16, 28, 4, height - 28);

      this.textures.addCanvas(key, canvas);
    });
  }

  private createCustomTilesets() {
    // 1:1 NES 1985 Super Mario Bros Ground Brick Tile (Screenshot 2)
    this.makeCanvasTexture('brick_ground', 32, (ctx) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#d84800'; // NES Orange Ground
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#882800'; // NES Grout Shadow
      ctx.fillRect(2, 15, 28, 2);
      ctx.fillRect(15, 2, 2, 13);
      ctx.fillRect(8, 17, 2, 13);
      ctx.fillRect(23, 17, 2, 13);
    });

    this.makeCanvasTexture('sand_ground', 32, (ctx) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#e69d35';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#fce085';
      ctx.fillRect(2, 2, 28, 4);
      ctx.fillStyle = '#b8701d';
      ctx.fillRect(2, 28, 28, 2);
    });

    this.makeCanvasTexture('ice_ground', 32, (ctx) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#8bd7f8';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, 2, 28, 8);
      ctx.fillStyle = '#48a8e0';
      ctx.fillRect(2, 28, 28, 2);
    });

    this.makeCanvasTexture('castle_ground', 32, (ctx) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#3c3a4a';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#5c5a6d';
      ctx.fillRect(2, 2, 28, 3);
      ctx.strokeStyle = '#22202b';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, 28, 28);
    });
  }

  private makePipe(x: number, y: number, height: number) {
    const key = `pipe_${height}`;
    const pipe = this.physics.add.staticSprite(x, y - height / 2, key);
    pipe.refreshBody();
    this.platforms.add(pipe);
    pipe.setDepth(4);
    return pipe;
  }

  private makeGroundSegment(x: number, y: number, w: number, h: number, groundKey = 'brick_ground', topKey = 'ground') {
    const brick = this.add.tileSprite(x, y, w, h, groundKey);
    this.physics.add.existing(brick, true);
    this.platforms.add(brick);

    const grassH = 8;
    this.add.tileSprite(x, y - h / 2 + grassH / 2, w, grassH, topKey).setDepth(1);
  }

  private makePlatform(x: number, y: number, tileCount: number, groundKey = 'brick_ground', topKey = 'ground') {
    const tileSize = 21;
    const w = tileCount * tileSize;
    const brick = this.add.tileSprite(x, y, w, tileSize, groundKey);
    this.physics.add.existing(brick, true);
    this.platforms.add(brick);

    const grassH = 6;
    this.add.tileSprite(x, y - tileSize / 2 + grassH / 2, w, grassH, topKey).setDepth(1);
  }

  private makeSpike(x: number, y: number) {
    const spike = this.hazards.create(x, y, 'spike') as Phaser.Physics.Arcade.Sprite;
    spike.setSize(14, 10).setOffset(2, 8);
    spike.refreshBody();
  }

  private buildStageEnemies(worldNum: number, levelNum: number, topY: number): Enemy[] {
    const enemies: Enemy[] = [];

    if (worldNum === 1) {
      // EASY • GREEN PLAINS (Intro Goombas & Bramble Patrols)
      enemies.push(new Enemy(this, 520, topY - 20, 'sprout', 70));
      enemies.push(new Enemy(this, 820, topY - 20, 'sprout', 75));
      enemies.push(new Enemy(this, 1420, topY - 20, 'sprout', 80));
      enemies.push(new Enemy(this, 2150, topY - 20, 'sprout', 85));

      if (levelNum >= 2) {
        enemies.push(new Enemy(this, 1680, topY - 20, 'bramble', 90));
        enemies.push(new Enemy(this, 2600, topY - 20, 'bramble', 95));
      }
      if (levelNum >= 3) {
        enemies.push(new Enemy(this, 1100, 300, 'puffwing', 110));
      }
      if (levelNum >= 4) {
        enemies.push(new Enemy(this, 2800, 280, 'puffwing', 120));
      }
    } else if (worldNum === 2) {
      // MEDIUM • SUNSCORCH DESERT (Fast Chargers & Aerial Puffwings over Moving Platforms)
      enemies.push(new Enemy(this, 520, topY - 20, 'bramble', 100));
      enemies.push(new Enemy(this, 780, topY - 20, 'bramble', 105));
      enemies.push(new Enemy(this, 1100, 280, 'puffwing', 120));
      enemies.push(new Enemy(this, 1420, topY - 20, 'bramble', 110));
      enemies.push(new Enemy(this, 1885, 260, 'puffwing', 125)); // Flyer over elevator gap!
      enemies.push(new Enemy(this, 2450, topY - 20, 'bramble', 115));
      enemies.push(new Enemy(this, 2900, 280, 'puffwing', 130));

      if (levelNum >= 2) {
        enemies.push(new Enemy(this, 1680, topY - 20, 'spiker', 90)); // Non-stompable Spiked Shell
      }
      if (levelNum >= 4) {
        enemies.push(new Enemy(this, 3100, topY - 20, 'spiker', 100));
      }
    } else if (worldNum === 3) {
      // HARD • FROSTBITE MOUNTAIN (Non-Stompable Spikers + Slippery Ice + Flying Puffwings)
      enemies.push(new Enemy(this, 520, topY - 20, 'spiker', 90)); // SPIKED SHELL (STOMP = DAMAGE!)
      enemies.push(new Enemy(this, 780, topY - 20, 'bramble', 110));
      enemies.push(new Enemy(this, 1100, 260, 'puffwing', 130));
      enemies.push(new Enemy(this, 1420, topY - 20, 'spiker', 95));
      enemies.push(new Enemy(this, 1680, topY - 20, 'emberjaw', 0)); // Fire Spitter
      enemies.push(new Enemy(this, 2150, topY - 20, 'spiker', 100));
      enemies.push(new Enemy(this, 2650, 260, 'puffwing', 140));
      enemies.push(new Enemy(this, 3100, topY - 20, 'spiker', 105));
    } else {
      // EXPERT / BOSS • LAVA CASTLE (Fire Spitters + Spikers + Flying Puffwings + Bowser 4-4)
      enemies.push(new Enemy(this, 520, topY - 20, 'emberjaw', 0));
      enemies.push(new Enemy(this, 780, topY - 20, 'spiker', 105));
      enemies.push(new Enemy(this, 1100, 260, 'puffwing', 140));
      enemies.push(new Enemy(this, 1420, topY - 20, 'emberjaw', 0));
      enemies.push(new Enemy(this, 1680, topY - 20, 'spiker', 110));
      enemies.push(new Enemy(this, 2150, topY - 20, 'emberjaw', 0));
      enemies.push(new Enemy(this, 2650, 260, 'puffwing', 145));
      enemies.push(new Enemy(this, 3100, topY - 20, 'spiker', 115));
    }

    return enemies;
  }
}
