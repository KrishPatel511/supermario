export interface HeroData {
  id: string;
  name: string;
  playstyle: string;
  difficultyStars: number;
  stats: {
    speed: number;
    jump: number;
    power: number;
    defense: number;
  };
  special: {
    name: string;
    desc: string;
  };
  passive: {
    name: string;
    desc: string;
  };
  tags: {
    positives: string[];
    negatives: string[];
  };
  colors: {
    hat: string;
    overalls: string;
    button: string;
    skin: string;
    shoes: string;
  };
}

export const HEROES_ROSTER: HeroData[] = [
  {
    id: 'riko',
    name: 'RIKO',
    playstyle: 'BALANCED',
    difficultyStars: 2,
    stats: { speed: 6, jump: 7, power: 6, defense: 5 },
    special: {
      name: 'EMBER BURST',
      desc: 'Short-range fire burst that breaks weak blocks and trips fire switches.',
    },
    passive: {
      name: 'EMBER RESOLVE',
      desc: 'Brief speed surge right after taking damage.',
    },
    tags: {
      positives: ['+ EASY TO LEARN', '+ NO BAD MATCHUP'],
      negatives: ['- NO STANDOUT TRICK', '- SHORT ATTACK RANGE'],
    },
    colors: {
      hat: '#E60012',
      overalls: '#0022AA',
      button: '#FFCC00',
      skin: '#FFCC99',
      shoes: '#882800',
    },
  },
  {
    id: 'miko',
    name: 'MIKO',
    playstyle: 'SPEEDSTER',
    difficultyStars: 3,
    stats: { speed: 9, jump: 6, power: 4, defense: 4 },
    special: {
      name: 'LIGHTNING DASH',
      desc: 'Instant forward dash that phase-shifts past non-boss enemies.',
    },
    passive: {
      name: 'AGILE FOOTWORK',
      desc: 'Higher acceleration and zero momentum sliding on ice.',
    },
    tags: {
      positives: ['+ HIGH MOBILITY', '+ FAST CLEAR TIMES'],
      negatives: ['- LOWER DEFENSE', '- SENSITIVE CONTROLS'],
    },
    colors: {
      hat: '#FFD000',
      overalls: '#0055FF',
      button: '#FFFFFF',
      skin: '#FFCC99',
      shoes: '#333333',
    },
  },
  {
    id: 'volt',
    name: 'VOLT',
    playstyle: 'ACROBAT',
    difficultyStars: 3,
    stats: { speed: 7, jump: 9, power: 5, defense: 4 },
    special: {
      name: 'THUNDER LEAP',
      desc: 'Empowered high jump launching a shockwave beneath upon landing.',
    },
    passive: {
      name: 'STATIC GLIDE',
      desc: 'Hold jump key mid-air to float gracefully across wide gaps.',
    },
    tags: {
      positives: ['+ EXCELLENT AIR TIME', '+ TRIPLE JUMP OPTION'],
      negatives: ['- LIGHTWEIGHT KNOCKBACK'],
    },
    colors: {
      hat: '#0099FF',
      overalls: '#00FFFF',
      button: '#FFFF00',
      skin: '#FFCC99',
      shoes: '#003366',
    },
  },
  {
    id: 'blade',
    name: 'BLADE',
    playstyle: 'NINJA',
    difficultyStars: 4,
    stats: { speed: 8, jump: 8, power: 7, defense: 3 },
    special: {
      name: 'SHADOW SLASH',
      desc: 'Quick horizontal blade strike cleaving through enemy projectiles.',
    },
    passive: {
      name: 'WALL RUNNER',
      desc: 'Can jump repeatedly off vertical walls.',
    },
    tags: {
      positives: ['+ HIGH BURST DAMAGE', '+ WALL CLIMBING'],
      negatives: ['- FRAGILE HEALTH BAR'],
    },
    colors: {
      hat: '#222222',
      overalls: '#990000',
      button: '#FFFFFF',
      skin: '#FFCC99',
      shoes: '#111111',
    },
  },
  {
    id: 'aegis',
    name: 'AEGIS',
    playstyle: 'TANK',
    difficultyStars: 1,
    stats: { speed: 4, jump: 5, power: 8, defense: 9 },
    special: {
      name: 'IRON BARRIER',
      desc: 'Deploys a temporary energy shield blocking incoming damage completely.',
    },
    passive: {
      name: 'HEAVY ARMOR',
      desc: 'Takes 50% reduced knockback from spikes and hazards.',
    },
    tags: {
      positives: ['+ MAXIMUM SURVIVABILITY', '+ SPIKE IMMUNITY CHANCE'],
      negatives: ['- SLOWER MOVEMENT'],
    },
    colors: {
      hat: '#AAAAAA',
      overalls: '#223366',
      button: '#FFD700',
      skin: '#FFCC99',
      shoes: '#444444',
    },
  },
  {
    id: 'shin',
    name: 'SHIN',
    playstyle: 'SHINOBI',
    difficultyStars: 4,
    stats: { speed: 8, jump: 7, power: 7, defense: 5 },
    special: {
      name: 'KUNAI STORM',
      desc: 'Throws three piercing kunai daggers in a fan pattern.',
    },
    passive: {
      name: 'VANISH STEP',
      desc: 'Brief invincibility frame when triggering a jump.',
    },
    tags: {
      positives: ['+ RANGED ATTACKS', '+ DODGE FRAMES'],
      negatives: ['- HIGH ENERGY CONSUMPTION'],
    },
    colors: {
      hat: '#112255',
      overalls: '#331166',
      button: '#FF0033',
      skin: '#FFCC99',
      shoes: '#050515',
    },
  },
  {
    id: 'cinder',
    name: 'CINDER',
    playstyle: 'FLAME RUSH',
    difficultyStars: 3,
    stats: { speed: 7, jump: 6, power: 9, defense: 5 },
    special: {
      name: 'INFERNO BLAST',
      desc: 'Explosive fiery stomping attack scorching ground hazards.',
    },
    passive: {
      name: 'FIRE WALK',
      desc: 'Immune to lava and burning surfaces.',
    },
    tags: {
      positives: ['+ HIGH AOE DAMAGE', '+ LAVA IMMUNITY'],
      negatives: ['- SHORTER JUMP HEIGHT'],
    },
    colors: {
      hat: '#FF5500',
      overalls: '#FFD000',
      button: '#FFFFFF',
      skin: '#FFCC99',
      shoes: '#661100',
    },
  },
  {
    id: 'frost',
    name: 'FROST',
    playstyle: 'ICE SHIELD',
    difficultyStars: 2,
    stats: { speed: 5, jump: 7, power: 6, defense: 8 },
    special: {
      name: 'GLACIAL FREEZE',
      desc: 'Freezes surrounding enemies into solid ice stepping blocks.',
    },
    passive: {
      name: 'FROST ARMOR',
      desc: 'Creates an ice barrier absorbing one free hit per stage.',
    },
    tags: {
      positives: ['+ ENEMY FREEZING', '+ FREE SHIELD HIT'],
      negatives: ['- MODERATE SPEED'],
    },
    colors: {
      hat: '#66E0FF',
      overalls: '#005599',
      button: '#FFFFFF',
      skin: '#FFCC99',
      shoes: '#003366',
    },
  },
  {
    id: 'aero',
    name: 'AERO',
    playstyle: 'WIND LEAP',
    difficultyStars: 3,
    stats: { speed: 8, jump: 10, power: 4, defense: 4 },
    special: {
      name: 'CYCLONE LIFT',
      desc: 'Creates an updraft wind column boosting jump height massively.',
    },
    passive: {
      name: 'FEATHER FALL',
      desc: 'Reduced falling speed allowing precise platform landings.',
    },
    tags: {
      positives: ['+ MAXIMUM JUMP STAT', '+ EASY PLATFORMING'],
      negatives: ['- LOW BASE DAMAGE'],
    },
    colors: {
      hat: '#F0F8FF',
      overalls: '#00B3B3',
      button: '#FFD000',
      skin: '#FFCC99',
      shoes: '#005555',
    },
  },
  {
    id: 'titan',
    name: 'TITAN',
    playstyle: 'HEAVY BRAWLER',
    difficultyStars: 2,
    stats: { speed: 4, jump: 5, power: 10, defense: 7 },
    special: {
      name: 'EARTHQUAKE STOMP',
      desc: 'Slams down onto the ground causing a screen-wide earthquake.',
    },
    passive: {
      name: 'COLOSSUS MIGHT',
      desc: 'Breaks all wooden and stone blocks by simply walking into them.',
    },
    tags: {
      positives: ['+ MAXIMUM POWER STAT', '+ BLOCK BREAKER'],
      negatives: ['- SLOWEST MOVEMENT'],
    },
    colors: {
      hat: '#8B4513',
      overalls: '#B8860B',
      button: '#CC0000',
      skin: '#FFCC99',
      shoes: '#331100',
    },
  },
];
